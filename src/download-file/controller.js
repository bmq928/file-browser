const { getFile } = require('../_file-sys');

const download = (filePath, options, res) => {
  return new Promise(async (resolve, reject) => {

    if (!filePath) return reject(Error('file_path is required'));

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

