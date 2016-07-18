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
let relative = (filename) => path.relative(process.cwd(), filename)

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
    let srcLastHash = yield kv.get(relative(src))
    let destLastHash = yield kv.get(relative(dest))
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
    yield kv.set(relative(src), (yield fileHash(src)))
    yield kv.set(relative(dest), (yield fileHash(dest)))
    yield kv.commit()
    console.log(`File generated: ${relative(dest)}`)
  })
}

module.exports = abrowserify
