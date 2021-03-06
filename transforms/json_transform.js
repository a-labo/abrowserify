/**
 * @function jsonTransform
 */
'use strict'

const through = require('through2')
const minimatch = require('minimatch')

/** @lends jsonTransform */
function jsonTransform (filename, optinos = {}) {
  let { pattern } = optinos
  if (!pattern) {
    console.warn('[json-transform] Do nothing because pattern is not passed.')
    return through()
  }
  let skip = !minimatch(filename, pattern)
  if (skip) {
    return through()
  }

  return through(
    function doTransform (chunc, encode, callback) {
      callback()
    },
    function doFlush (callback) {
      const s = this
      let content = require(filename)

      function warnFunction (content) {
        switch (typeof content) {
          case 'function':
            console.warn(`[json-transform][${filename}] A function detected. You should not include one for json transform.`)
            break
          case 'object':
            for (let name of Object.keys(content)) {
              warnFunction(content[ name ])
            }
            break
          default:
            break
        }
      }

      warnFunction(content)

      s.push(`'use strict';module.exports = ${JSON.stringify(content)};`)
      callback()
    }
  )
}

module.exports = jsonTransform
