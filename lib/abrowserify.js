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

const aglob = require('aglob')
const {clone} = require('asobj')
const {isProduction} = require('asenv')
const fs = require('fs')
const path = require('path')
const akvStatus = require('akv-status')
const {mkdirpAsync} = require('asfs')
const browserify = require('browserify')
const browserifyIncremental = require('browserify-incremental')

const relative = (filename) => path.relative(process.cwd(), filename)

/** @lends abrowserify */
async function abrowserify (src, dest, options = {}) {
  src = src && relative(path.resolve(src))
  dest = dest && relative(path.resolve(dest))
  let {
    cache = 'tmp/abrowserify.cache.json',
    status = 'tmp/abrowserify.status.json',
    transforms = [],
    externals = [],
    requires = [],
    reflects = []
  } = options
  let store = akvStatus(status)
  try {
    reflects = await aglob(reflects)
    options = clone(options, {
      without: ['cache', 'status', 'transforms', 'reflects', 'externals']
    })

    if (!isProduction()) {
      if (reflects.length > 0) {
        let changed = await store.filterStatusUnknown([src, dest, ...reflects].filter(Boolean))
        if (changed.length === 0) {
          return
        }
      }
    }
    await mkdirpAsync(path.dirname(cache))
    await mkdirpAsync(path.dirname(dest))
    const browserifyOptions = Object.assign({
      cache: {}, packageCache: {}, fullPaths: true
    }, options)
    const instance = browserify(browserifyOptions)
    if (src) {
      instance.add(src)
    }
    for (const external of externals) {
      instance.external(...([].concat(external)))
    }
    for (const r of requires) {
      instance.require(...([].concat(r)))
    }
    for (const transform of transforms) {
      instance.transform(...([].concat(transform)))
    }
    browserifyIncremental(instance, {cache})
    let writeStream
    try {
      await new Promise((resolve, reject) => {
        writeStream = fs.createWriteStream(dest)
        writeStream.on('error', (err) => reject(err))
        writeStream.on('close', () => resolve())
        instance.bundle()
          .on('error', (err) => reject(err))
          .pipe(writeStream)
      })
    } catch (err) {
      store.destroy()
      if (writeStream) {
        writeStream.close()
      }
      throw err
    }
    await store.saveStatus([src, dest, ...reflects].filter(Boolean))
    await store.commit()
    console.log(`File generated: ${relative(dest)}`)
  } finally {
    await store.destroy()
  }
}

module.exports = abrowserify
