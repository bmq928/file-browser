const route = require('express').Router();
const controller = require('./controller');
const config = require('config');
const bodyParser = require('body-parser');
const _ = require("lodash");
const s3 = require('../_aws').s3;
const options = {
    s3: process.env.STORAGE_S3 || config.get('s3'),
    bucket: process.env.STORAGE_BUCKET || config.get('aws.bucket')
};
const checking = require('../_checking');

route.get('/copy', async (req, res) => {
    let from = req.query.from;
    let dest = req.query.dest;
    from = await checking.validateUrl(from, req.decoded);
    if (!req.query.skipCheckingUrl || req.query.skipCheckingUrl !== "true") dest = await checking.validateUrl(dest, req.decoded);
    console.log(from, dest)
    try {
        const data = await controller.itemCopy(from, dest, options);
        res.status(200).json({data})
    } catch (error) {
        // console.log({error})
        res.status(400).json({message: error.message})
    }
});

route.get('/remove', async (req, res) => {
    let filePath = req.query.file_path;
    filePath = await checking.validateUrl(filePath, req.decoded);
    try {
        const data = await controller.itemRemove(filePath, options);
        res.status(200).json({data});
    } catch (error) {
        console.log({error});
        res.status(400).json({message: error.message})
    }

});

route.get('/move', async (req, res) => {
    let from = req.query.from;
    let dest = req.query.dest;
    from = await checking.validateUrl(from, req.decoded);
    if (!req.query.skipCheckingUrl || req.query.skipCheckingUrl !== "true") dest = await checking.validateUrl(dest, req.decoded);
    try {
        const data = await controller.itemMove(from, dest, options);
        res.status(200).json({data});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

route.get('/create-folder', async (req, res) => {
    // const {dest, name} = req.query;
    let dest = req.query.dest;
    let name = req.query.name;
    let metaData = req.query.metaData ? JSON.parse(req.query.metaData) : {};
    dest = await checking.validateUrl(dest, req.decoded);
    try {
        let names = req.query.dest.substring(1).split('/');
        let l = names.length;
        let data = [];
        for (let i = 1; i <= l; i++) {
            let folder = _.take(names, i);
            let folderName = folder.pop();
            let folderMeta = {...metaData};
            folderMeta.name = folderName;
            folderMeta.location = '/' + _.take(names, i).join('/');
            let folderCreateLocation = await checking.validateUrl(folderMeta.location.substring(0, folderMeta.location.lastIndexOf('/')), req.decoded);
            let isExisted = await checkObjExisted(folderCreateLocation + '/' + folderName);
            if (!isExisted && folderMeta.location !== "/") {
                // console.log("Create ", folderName, "===", folderCreateLocation, "++", folderMeta);
                data.push(await controller.folderCreate(folderName, folderCreateLocation, options, folderMeta));
            }
        }
        data.push(await controller.folderCreate(name, dest, options, metaData));
        res.status(200).json({data});
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

function checkObjExisted(key) {
    return new Promise(resolve => {
        s3.headObject({
            Bucket: process.env.STORAGE_BUCKET || config.aws.bucket,
            Key: key + '/'
        }).promise().then(rs => {
            if (rs) {
                resolve(true);
            } else {
                resolve(false);
            }
        }).catch(err => {
            resolve(false);
        });
    })
}

route.use(bodyParser.json());
route.post('/update-meta-data', async (req, res) => {
    let dest = req.body.key;
    dest = await checking.validateUrl(dest, req.decoded);
    try {
        const data = await controller.updateMetaData(dest, options, req.body.metaData);
        res.status(200).json({data});
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

module.exports = route;