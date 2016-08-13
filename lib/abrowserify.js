/**
 * Browserify a script with caching
 * @function abrowserify
 * @param {string} src - Source file name
 * @param {string} dest - Destination file name
 * @param {Object} [options] - Optional settings
 * @param {string} [options.status] - Status file path
 * @param {string} [options.cache] - Cache file path
 * @param {string[]} [options.reflects] - File patterns to reflects changes
 * @returns {Promise}
 */
'use strict'

const co = require('co')
const aglob = require('aglob')
const { clone } = require('asobj')
const { isProduction } = require('asenv')
const fs = require('fs')
const path = require('path')
const akvStatus = require('akv-status')
const { mkdirpAsync } = require('asfs')
const browserify = require('browserify')
const browserifyIncremental = require('browserify-incremental')

let relative = (filename) => path.relative(process.cwd(), filename)

/** @lends abrowserify */
function abrowserify (src, dest, options = {}) {
  src = src && relative(path.resolve(src))
  dest = dest && relative(path.resolve(dest))
  let {
    cache = 'tmp/abrowserify.cache.json',
    status = 'tmp/abrowserify.status.json',
    transforms = [],
    reflects = []
  } = options
  let store = akvStatus(status)

  return co(function * () {
    reflects = yield aglob(reflects)
    options = clone(options, {
      without: [ 'cache', 'status', 'transforms', 'reflects' ]
    })

    if (!isProduction()) {
      if (reflects.length > 0) {
        let changed = yield store.filterStatusUnknown([ src, dest, ...reflects ].filter(Boolean))
        if (changed.length === 0) {
          return
        }
      }
    }
    yield mkdirpAsync(path.dirname(cache))
    yield mkdirpAsync(path.dirname(dest))
    let browserifyOptions = Object.assign({
      cache: {}, packageCache: {}, fullPaths: true
    }, options)
    let instance = browserify(browserifyOptions)
    if (src) {
      instance.add(src)
    }
    for (let transform of transforms) {
      instance.transform(...([].concat(transform)))
    }
    browserifyIncremental(instance, { cache })
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
    yield store.saveStatus([ src, dest, ...reflects ].filter(Boolean))
    console.log(`File generated: ${relative(dest)}`)
  }).catch((err) => co(function * () {
    yield store.destroy()
    throw err
  }))
}

module.exports = abrowserify
