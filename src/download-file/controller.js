const config = require('config');
const rootFolderFs = process.env.STORAGE_ROOT_FOLDER || config.get('rootFolder');
const {pathStat, getFile, getPath, readDir} = require('../_file-sys');
const archiver = require('archiver');
const {s3} = require('../_aws');
const _ = require('lodash');
const download = (filePath, options, res) => {

    filePath = getPath(filePath, rootFolderFs, options);

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

function getALlPathInFolder(dir, options, path) {
    return new Promise(resolve => {
        dir = dir.substring(0, dir.lastIndexOf('/'));
        readDir(dir, options).then(items => {
            Promise.all(items.map(item => pathStat(dir + '/' + item, options))).then(pathStats => {
                if (!pathStats.find(p => p.isDirectory())) resolve();
                pathStats.forEach(p => {
                    if (p.isDirectory()) {
                        let location = p.metaData.location;
                        resolve(getALlPathInFolder(dir + location.substring(location.lastIndexOf('/'), location.length) + '/', options, path));
                    } else {
                        path.push(p.metaData.location);
                    }
                });
            });
        });
    })
}

const downloadMultiFiles = function (payload, options, res) {
    let filePaths = payload.files;
    return new Promise(async (resolve, reject) => {
        let downloadFileKeys = [];
        filePaths = filePaths.map(f => getPath(f, rootFolderFs, options));
        // fetch all s3 key for download
        for (let i = 0; i < filePaths.length; i++) {
            if (filePaths[i].endsWith('/')) {
                let paths = [];
                await getALlPathInFolder(filePaths[i], options, paths);
                paths = paths.map(p => options.dir + p)
                downloadFileKeys = _.concat(paths, downloadFileKeys);
            } else {
                downloadFileKeys.push(filePaths[i]);
            }
        }
        // init archive stream
        let archive = archiver('zip', {
            zlib: {level: 9}
        });
        let fileName = Date.now() + '_' + Math.floor(Math.random() * 100000) + '.zip';
        res.setHeader('Content-disposition', 'attachment');
        res.setHeader('File-Name', fileName);
        res.setHeader('Content-type', 'application/octet-steam');

        // push all s3 read stream into archive
        for (let i = 0; i < downloadFileKeys.length; i++) {
            let params = {
                Bucket: options.bucket,
                Key: downloadFileKeys[i]
            };
            try {
                await s3.headObject(params).promise();
                let s3Stream = s3.getObject(params).createReadStream();
                let fileKey = downloadFileKeys[i].substring(downloadFileKeys[i].indexOf(options.dir) + options.dir.length);
                archive.append(s3Stream && s3Stream, {name: fileKey});
            } catch (e) {
                if (e.code === "NotFound") {
                    console.log("File not found ", downloadFileKeys[i])
                } else {
                    console.log("Error ne ", e);
                }
            }
        }
        archive.pipe(res);
        archive.finalize().then(() => {
            console.log('Zip file successfully');
        }).catch((err) => {
            console.log('Zip error:', err.message);
        });
    })
};

module.exports = {download, downloadMultiFiles};

