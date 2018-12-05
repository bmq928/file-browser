const path = require('path')

const withFs = (itemPath, rootFolder) => {

  return path.join(rootFolder, itemPath);
}

const withS3 = (itemPath) => {
  // if ( itemPath.length > 1 && itemPath.startsWith('/')) return itemPath.substr(1);

  return itemPath;
}

module.exports = (itemPath, rootFolder, options) => {
  if(options && options.s3) {

    //remove redundant /
    return path.join(withS3(itemPath))
  }

  return withFs(itemPath, rootFolder);
}