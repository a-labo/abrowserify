'use strict'

const { isProduction } = require('asenv')
const sub = require('./mock-sub')
const sub2 = require('./mock-sub2')
const setting = require('./mock-setting')

console.log(sub())
console.log('isProduction =', isProduction())