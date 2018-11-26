const { upload } = require('../_file-sys')

const uploadToServer = (file,location, options) => {
  return new Promise( async (resolve, reject) => {
    if(!file) return reject(new Error('file is required'))
    
    try {
      
      const data = await upload(file, location, options)
      resolve(data)

    } catch (error) {
      reject(error)
    }

  })
}

module.exports = {
  uploadToServer
}