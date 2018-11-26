const getFile = require('./get-file')

describe('_file-sys', () => {
  describe('get-file', () => {

    it('result should be a promise', () => {
      const result1 = getFile(__dirname)
      const result2 = getFile(__dirname, {s3:true})

      expect(result1.toString()).toEqual('[object Promise]')
      expect(result2.toString()).toEqual('[object Promise]')
    })
  })
})