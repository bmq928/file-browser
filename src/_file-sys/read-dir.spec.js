const readDir = require('./read-dir')
const path = require('path')

describe('_file-sys', () => {
  describe('path-stat', () => {
    it('result should be a promise', () => {
      const result1 = readDir(__dirname)
      const result2 = readDir(__dirname, {s3:true})

      expect(result1.toString()).toEqual('[object Promise]')
      expect(result2.toString()).toEqual('[object Promise]')
    })
  })
})