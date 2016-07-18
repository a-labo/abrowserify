/**
 * @function abrowserify
 */
'use strict'

const co = require('co')
const defaults = require('defaults')
const fs = require('fs')
const path = require('path')
const akv = require('akv')
const { mkdirpAsync } = require('asfs')
const browserify = require('browserify')
const browserifyIncremental = require('browserify-incremental')

let { fileHash } = akv

/** @lends abrowserify */
function abrowserify (src, dest, options = {}) {
  src = path.resolve(src)
  dest = path.resolve(dest)
  return co(function * () {
    let cacheFile = options.cache || 'tmp/abrowserify.cache.json'
    let statusFile = options.status || 'tmp/abrowserify.status.json'
    delete options.cache
    delete options.status
    let kv = akv(statusFile)
    let srcLastHash = yield kv.get(src)
    let destLastHash = yield kv.get(dest)
    let srcHash = yield fileHash(src)
    let destHash = yield fileHash(dest)
    let unchanged = srcLastHash && destLastHash && (srcHash === srcLastHash) && (destHash === destLastHash)
    if (unchanged) {
      return
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
          console.error(err)
          writeStream.close()
        })
        .pipe(writeStream)
    })
    yield kv.set(src, (yield fileHash(src)))
    yield kv.set(dest, (yield fileHash(dest)))
    yield kv.commit()
    console.log(`File generated: ${path.relative(process.cwd(), dest)}`)
  })
}

module.exports = abrowserify
