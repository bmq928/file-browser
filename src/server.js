const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const crypto = require('crypto');

function getRandomHash() {
	const current_date = (new Date()).valueOf().toString();
	const random = Math.random().toString();
	return (crypto.createHash('sha1').update(current_date + random).digest('hex'));
}

// const swaggerUi = require('swagger-ui-express');
// const swaggerDoc = require('../swagger.json');

// expose module
const fileExplorer = require('./file-explorer');
const uploadFile = require('./upload-file');
const downloadFile = require('./download-file');
const readFile = require('./read-file');
const action = require('./action');
const search = require('./search');

app.get('/', (req, res) => {
	res.send({serverId: serverId});
});
app.get('/download', downloadFile.route);

// dependency
app.use(helmet());
app.use(cors());

let serverId = getRandomHash();
console.log("Server ID ", serverId);

//document
// app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

//authenticate
const authenticate = require('./authenticate');
app.use(authenticate());

//monitoring
app.use((req, res, next) => {
	const start = Date.now();
	res.once('finish', () => {
		let duration = Date.now() - start;
		console.log(req.decoded ? req.decoded.username : "User", (req.header('x-real-ip') || req.ip), req.method, req.originalUrl, `${duration}ms`);
	});
	next();
});

//api router
app.use('/file-explorer', fileExplorer.route);
app.use('/upload', uploadFile.route);
app.use('/read-file', readFile.route);
app.use('/action', action.route);
app.use('/search', search.route);

module.exports = app;
