/**
 * Test case for abrowserify.
 * Runs with mocha.
 */
'use strict'

const abrowserify = require('../lib/abrowserify.js')
const assert = require('assert')

describe('abrowserify', function () {
  this.timeout(3000)

  before(async () => {

  })

  after(async () => {

  })

  it('Abrowserify', async () => {
    let main = `${__dirname}/../misc/mocks/mock-main.js`
    let bundle = `${__dirname}/../tmp/testing-bundling/testing-bundle.js`
    let external = `${__dirname}/../tmp/testing-bundling/testing-external.js`
    let transforms = [
      [ 'babelify', { presets: [ 'es2015' ], babelrc: false } ],
      [ require('../transforms/json_transform'), { pattern: '**/*-setting.js' } ]
    ]
    await abrowserify(
      main,
      bundle,
      {
        debug: true,
        transforms: transforms,
        externals: [
          require.resolve('../misc/mocks/mock-sub2'),
          'asenv'
        ]
      }
    )
    await abrowserify(
      null,
      external,
      {
        debug: true,
        transforms: transforms,
        require: [ require.resolve('../misc/mocks/mock-sub2') ]
      }
    )
  })
})

/* global describe, before, after, it */
