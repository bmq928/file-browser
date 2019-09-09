const config = require('config');
const rootFolderFs = process.env.STORAGE_ROOT_FOLDER || config.get('rootFolder');
const {getFile, getPath, readDir} = require('../_file-sys');
const archiver = require('archiver');
const fs = require('fs');
const {s3} = require('../_aws');
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

const downloadMultiFiles = function (payload, options, res) {
    let filePaths = payload.files;
    return new Promise(async (resolve, reject) => {
        let downloadFileKeys = [];
        filePaths = filePaths.map(f => getPath(f, rootFolderFs, options));
        // fetch all s3 key for download
        for (let i = 0; i < filePaths.length; i++) {
            if (filePaths[i].endsWith('/')) {
                let items = await readDir(filePaths[i].substring(0, filePaths[i].lastIndexOf('/')), {
                    bucket: options.bucket,
                    s3: true
                });
                items = items.map(item => filePaths[i] + item);
                items.forEach(item => {
                    downloadFileKeys.push(item);
                })
            } else {
                downloadFileKeys.push(filePaths[i]);
            }
        }
        // init archive stream
        let archive = archiver('zip', {
            zlib: {level: 9}
        });
        let fileName = Date.now() + '_' + Math.floor(Math.random() * 100000) + '.zip';
        res.setHeader('Content-disposition', fileName);
        res.setHeader('Content-type', 'application/zip, application/octet-stream');
        archive.pipe(res);

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

        archive.finalize().then((res) => {
            console.log('Zip file successfully');
        }).catch((err) => {
            console.log('Zip error:', err.message);
        });
    })
};

module.exports = {download, downloadMultiFiles};

