const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('../swagger.json');

// expose module
const fileExplore = require('./file-explore');
const uploadFile = require('./upload-file');
const downloadFile = require('./download-file');
const readFile = require('./read-file');
const authenticate = require('./authenticate');

// dependency
app.use(helmet());
app.use(cors());

//document
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

//authenticate
// app.use(authenticate());

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
app.use('/file-explorer', fileExplore.route);
app.use('/upload', uploadFile.route);
app.use('/download', downloadFile.route);
app.use('/read-file', readFile.route);

module.exports = app;
