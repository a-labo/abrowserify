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
    delete options.cacheFile
    let instance = browserify(defaults(options, {
      cache: {}, packageCache: {}, fullPaths: true
    }))
    browserifyIncremental(instance, { cacheFile })
    instance.bundle().pipe()
  })
}

module.exports = abrowserify
