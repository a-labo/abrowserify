'use strict'

const abrowserify = require('abrowserify')
const co = require('co')

co(function * () {
  yield abrowserify('src/entrypoint.js', 'public/bundle.js', {
    debug: true
  })
}).catch((err) => console.error(err))
