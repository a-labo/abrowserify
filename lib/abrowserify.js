/**
 * @function abrowserify
 */
'use strict'

const co = require('co')
const defaults = require('defaults')
const fs = require('fs')
const path = require('path')
const { mkdirpAsync } = require('asfs')
const browserify = require('browserify')
const browserifyIncremental = require('browserify-incremental')

/** @lends abrowserify */
function abrowserify (src, dest, options = {}) {
  return co(function * () {
    let cacheFile = options.cacheFile || 'tmp/abrowserify.cache.json'
    yield mkdirpAsync(path.dirname(cacheFile))
    yield mkdirpAsync(path.dirname(dest))
    delete options.cacheFile
    let instance = browserify(defaults(options, {
      cache: {}, packageCache: {}, fullPaths: true
    }))
    instance.add(src)
    browserifyIncremental(instance, { cacheFile })
    yield new Promise((resolve, reject) => {
      let writeStream = fs.createWriteStream(dest)
      writeStream.on('error', (err) => reject(err))
      writeStream.on('close', () => resolve())
      instance.bundle().pipe(writeStream)
    })
    console.log(`File generated: ${path.relative(process.cwd(), dest)}`)
  })
}

module.exports = abrowserify
