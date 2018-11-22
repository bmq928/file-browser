const { readdirRecursive, readdirShallow } = require('./controller')
const dir = '.'

describe('fileExplore controller', () => {
  describe('readdirRecursive', () => {
    it('result should be a promise', async () => {
      const result = readdirRecursive(dir)
      expect(result.toString()).toEqual('[object Promise]')
    })

    it('have attributes', async () => {
      //     this.rootIsFile = rootIsFile
      //   this.rootName = rootName
      //   this.files = files
      //   this.folders = folders
      // }
      const result = await readdirRecursive(dir)
      expect(result).toHaveProperty('rootIsFile')
      expect(result).toHaveProperty('rootName')
      expect(result).toHaveProperty('files')
      expect(result).toHaveProperty('folders')
    })

    it('value of property', async () => {
      const { rootIsFile, rootName, files, folders } = await readdirRecursive(dir)
      expect( typeof rootIsFile).toEqual('boolean')
      expect(typeof rootName).toEqual('string')
      expect(files).toHaveProperty('length')
      expect(folders).toHaveProperty('length')
    })
  })

  describe('readdirShallow', () => {
    it('result should be a promise', () => {
      const result = readdirShallow(dir)
      expect(result.toString()).toEqual('[object Promise]')
    })

    it('have attributes', async () => {
      const result = await readdirShallow(dir)

      expect(result).toHaveProperty('rootIsFile')
      expect(result).toHaveProperty('rootName')
      expect(result).toHaveProperty('files')
      expect(result).toHaveProperty('folders')
    })


    it('value of property', async () => {
      const { rootIsFile, rootName, files, folders } = await readdirShallow(dir)
      expect( typeof rootIsFile).toEqual('boolean')
      expect(typeof rootName).toEqual('string')
      expect(files).toHaveProperty('length')
      expect(folders).toHaveProperty('length')
    })
  })
})
