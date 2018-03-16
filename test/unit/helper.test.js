/* eslint-env mocha */
/* eslint no-unused-expressions: 0 */
/* eslint no-unused-vars: 0 */
process.env.NODE_ENV = 'test'

const chai = require('chai')

const should = chai.should()

const helperFunctions = require('../../src/helper')

describe('helper.js testing', () => {
  describe('normilizeStr()', () => {
    const forTestStr = 'Новая титулка'
    const sep = '-'
    const normalizedStr = helperFunctions.normilizeStr(
      forTestStr,
      new Date().toString(),
      0,
      sep,
    )
    it('should return a string', () => {
      normalizedStr.should.be.a('string')
    })
    it('should be not exist of spaces', () => {
      ;/[ ]/g.test(normalizedStr).should.be.false
    })
  })

  describe('uploadImg()', () => {})

  describe('randomStringCookie()', () => {
    it('should return a string and have length 36', () => {
      helperFunctions.randomStringCookie().should.be.a('string')
      helperFunctions.randomStringCookie().should.have.length(36)
    })
  })

  describe('randomStringFile()', () => {
    it('should return a string and have length 36', () => {
      helperFunctions.randomStringFile().should.be.a('string')
      helperFunctions.randomStringFile().should.have.length(36)
    })
  })
})
