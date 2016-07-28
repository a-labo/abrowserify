/**
 * Test case for abrowserify.
 * Runs with mocha.
 */
'use strict'

const abrowserify = require('../lib/abrowserify.js')
const assert = require('assert')
const co = require('co')

describe('abrowserify', function () {
  this.timeout(3000)

  before(() => co(function * () {

  }))

  after(() => co(function * () {

  }))

  it('Abrowserify', () => co(function * () {
    yield abrowserify(
      `${__dirname}/../misc/mocks/mock-main.js`,
      `${__dirname}/../tmp/testing-bundling/testing-bundle.js`,
      {
        debug: true,
        transforms: [
          [ 'babelify', { presets: [ 'es2015' ] } ]
        ]
      }
    )
  }))
})

/* global describe, before, after, it */
