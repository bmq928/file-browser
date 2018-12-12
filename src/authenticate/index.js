const utils = require('../_checking');
let jwt = require('jsonwebtoken');
let secretKey = "secretKey";

module.exports = () => {
	return (req, res, next) => {
		let token = req.query.token || req.header['x-access-token'] || req.get('Authorization') || req.query.token;
		let storage_database = JSON.parse(req.query.storage_database || req.header['Storage-Database'] || req.get('Storage-Database') || req.query.storage_database);
		jwt.verify(token, secretKey, (err, decoded) => {
			if (err) {
				res.json("UnAuthorized");
			} else {
				decoded.company = storage_database.company;
				decoded.dir = storage_database.directory;
				utils.checkuserRootDirectory(decoded.company, decoded.dir).then(() => {
					req.decoded = decoded;
					next();
				}).catch(err => {
					console.log(err);
					res.json({data: err});
				});
			}
		});
	}
};