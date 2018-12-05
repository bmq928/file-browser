const utils = require('../utils');


module.exports = () => {
	return (req, res, next) => {
		const decoded = {
			username: 'administrator',
			company: 'I2G'
		};
		utils.checkuserRootDirectory(decoded.company, decoded.username).then(() => {
			req.decoded = decoded;
			next();
		}).catch(err => {
			console.log(err);
			res.json({data: err});
		});
	}
};