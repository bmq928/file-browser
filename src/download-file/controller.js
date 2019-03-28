const config = require('config');
const rootFolderFs = process.env.STORAGE_ROOT_FOLDER || config.get('rootFolder');
const { getFile, getPath } = require('../_file-sys');

const download = (filePath, options, res) => {

  filePath = getPath(filePath, rootFolderFs, options)

  return new Promise(async (resolve, reject) => {

    if (!filePath) return reject(new Error('file_path is required'));

    try {

      const file = await getFile(filePath, options);

      res.setHeader('Content-disposition', 'attachment; filename=' + file.name);
      res.setHeader('Content-type', file.contentType);

      file.body.pipe(res);

      res.on('end', () => resolve())
    } catch (error) {
      reject(error)
    }

  })
};

module.exports = { download };

