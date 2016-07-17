/**
 * Browserify wrapper to speed up compiling by caching results.
 * @module abrowserify
 */

'use strict'

let d = (module) => module.default || module

module.exports = {
  get abrowserify () { return d(require('./abrowserify')) }
}
