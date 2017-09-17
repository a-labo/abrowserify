/**
 * Bundle with browserify only when file changed from last time
 * @module abrowserify
 */

'use strict'

const abrowserify = require('./abrowserify')

const lib = abrowserify.bind(this)

Object.assign(lib, abrowserify, {
  abrowserify
})

module.exports = lib
