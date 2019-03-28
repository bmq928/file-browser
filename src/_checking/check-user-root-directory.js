const config = require('config');
const s3 = require('../_aws').s3;
const fs = require('fs');
const path = require('path');

module.exports = (company, username) => {
	console.log(company, username);
	return new Promise(async (resolve, reject) => {
		if (process.env.STORAGE_S3 || config.s3) {
			let companyParams = {
				Bucket: process.env.STORAGE_BUCKET || config.aws.bucket,
				Key: company + '/'
			};
			let userParams = {
				Bucket: process.env.STORAGE_BUCKET || config.aws.bucket,
				Key: company + '/' + username + '/'
			};
			try {
				await s3.headObject(companyParams).promise();
				await s3.headObject(userParams).promise();
				resolve();
			} catch (e) {
				if (e.code === 'NotFound') {
					console.log("User's directory not found in s3, create...");
					resolve();
					s3.putObject(companyParams, () => {
						s3.putObject(userParams, () => {
							resolve();
						});
					});
				} else {
					reject(e);
				}
			}
		} else {
			if (fs.existsSync(path.join(process.env.STORAGE_ROOT_FOLDER || config.rootFolder, company, username))) {
				resolve();
			} else {
				fs.mkdirSync(path.join(process.env.STORAGE_ROOT_FOLDER || config.rootFolder, company));
				fs.mkdirSync(path.join(process.env.STORAGE_ROOT_FOLDER || config.rootFolder, company, username));
				resolve();
			}
		}
	});
};