/**
 * Browserify wrapper to speed up compiling by caching results.
 * @module abrowserify
 */

'use strict'

const abrowserify = require('./abrowserify')

let lib = abrowserify.bind(this)

Object.assign(lib, abrowserify, {
  abrowserify
})

module.exports = lib