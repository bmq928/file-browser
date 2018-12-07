const {copy, getPath} = require('../_file-sys');
const config = require('config');
const rootFolderFs = config.get('rootFolder');

const itemCopy = async (from, dest, options) => {
  if (!from) throw new Error('from is required');
  if (!dest) throw new Error ('dest is required');

  from = getPath(from, rootFolderFs, options);
  dest = getPath(dest, rootFolderFs, options);

  const data = await copy(from, dest, options);
  return data;
}

module.exports = {
  itemCopy
}