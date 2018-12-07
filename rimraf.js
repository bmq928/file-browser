const config = require('config');
const ROOT_FOLDER = config.get('rootFolder');
const rimraf = require('rimraf');

rimraf.sync(`${ROOT_FOLDER}/*`);