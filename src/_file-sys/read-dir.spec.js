const readDir = require('./read-dir');

describe('_file-sys', () => {
  describe('path-stat', () => {

    it('result should be a promise', () => {
      const result1 = readDir(__dirname);
      const result2 = readDir(__dirname, {s3:true});

      expect(result1.toString()).toEqual('[object Promise]');
      expect(result2.toString()).toEqual('[object Promise]')
    })

    // it('value should be an array', async () => {
    //   const result1 = readDir(__dirname)
    //   const result2 = readDir(__dirname, {s3:true, bucket})
    // })
  })
});