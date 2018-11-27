const { upload, pathStat } = require('../_file-sys');

const uploadToServer = (file,location, options) => {
  return new Promise( async (resolve, reject) => {
    if(!file) return reject(new Error('file is required'));
    
    try {
      const stat = await pathStat(location, options);
      if(!stat.isDirectory()) return reject(new Error('location must be a directory'));

      const data = await upload(file, location, options);
      resolve(data)

    } catch (error) {
      reject(error)
    }

  })
};

module.exports = {
  uploadToServer
};