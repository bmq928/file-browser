const _aws = require('../_aws');
const pathStat = require('./path-stat');

// const awsMock = jest.mock('../_aws', () => ({
//   s3: {
//     listObjects: jest.fn(() => ({
//         promise: () => Promise.resolve({
//           Contents: [{Key: 'folder/'}]
//         })
//       }))
//   }
// }))

describe('_file-sys', () => {
  describe('path-stat', () => {

    beforeEach(() => {
      _aws.s3.listObjects = jest.fn(() => ({
        promise: () => Promise.resolve({
          Contents: [{Key: 'folder/'}]
        })
      }))
    });

    it('result should be a promise', () => {
      const result1 = pathStat(__dirname);
      const result2 = pathStat(__dirname, { s3: true, bucket: 'quang' });

      expect(result1.toString()).toEqual('[object Promise]');
      expect(result2.toString()).toEqual('[object Promise]')
    });

    // it(' fs version should have 2 method isFile and isDirectory', async () => {
    //   jest.resetModules()
    //   const result2 = await pathStat('/tmp')

      
    //   expect(result2).toHaveProperty('isFile')
    //   expect(result2).toHaveProperty('isDirectory')
    // })

    it(' s3 version should have 2 method isFile and isDirectory', async () => {
      const result2 = await pathStat('folder', {
        s3: true,
        bucket: 'test'
      });

      
      expect(result2).toHaveProperty('isFile');
      expect(result2).toHaveProperty('isDirectory')
    });

    afterEach(() => {
      jest.resetModules()
      // jest.clearAllMocks()
    })
  })
});
