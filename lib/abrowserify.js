/**
 * @function abrowserify
 * @param {string} src - Source file name
 * @param {string} dest - Detination file name
 * @param {Object} [options] - Optional settings
 * @param {string} [options.status] - Status file path
 * @parma {string} [options.cache] - Cache file path
 * @param {string[]} [options.reflects] - File patterns to reflects changes
 * @param {string[]} [options.reflects] - File patterns to reflects changes
 * @returns {Promise}
 */
'use strict'

const co = require('co')
const defaults = require('defaults')
const fs = require('fs')
const path = require('path')
const akvStatus = require('akv-status')
const { mkdirpAsync } = require('asfs')
const browserify = require('browserify')
const browserifyIncremental = require('browserify-incremental')

let relative = (filename) => path.relative(process.cwd(), filename)

/** @lends abrowserify */
function abrowserify (src, dest, options = {}) {
  src = relative(path.resolve(src))
  dest = relative(path.resolve(dest))
  return co(function * () {
    let cacheFile = options.cache || 'tmp/abrowserify.cache.json'
    let statusFile = options.status || 'tmp/abrowserify.status.json'
    let reflects = options.reflects || []

    delete options.cache
    delete options.status
    delete options.reflects

    let store = akvStatus(statusFile)
    if (reflects.length > 0) {
      let changed = yield store.filterStatusUnknown([ src, dest, ...reflects ])
      if (changed.length === 0) {
        return
      }
    }
    yield mkdirpAsync(path.dirname(cacheFile))
    yield mkdirpAsync(path.dirname(dest))
    let instance = browserify(defaults(options, {
      cache: {}, packageCache: {}, fullPaths: true
    }))
    instance.add(src)
    browserifyIncremental(instance, { cacheFile })
    yield new Promise((resolve, reject) => {
      let writeStream = fs.createWriteStream(dest)
      writeStream.on('error', (err) => reject(err))
      writeStream.on('close', () => resolve())
      instance.bundle()
        .on('error', (err) => {
          store.destroy()
          reject(err)
          writeStream.close()
        })
        .pipe(writeStream)
    })
    yield store.saveStatus([ src, dest, ...reflects ])
    console.log(`File generated: ${relative(dest)}`)
  })
}

module.exports = abrowserify
