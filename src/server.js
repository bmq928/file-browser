const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const app = express();
const crypto = require('crypto');
const serverId = getRandomHash();

console.log("Server ID ", serverId);

const authenticate = require('./authenticate');

function getRandomHash() {
	const current_date = (new Date()).valueOf().toString();
	const random = Math.random().toString();
	return (crypto.createHash('sha1').update(current_date + random).digest('hex'));
}

app.get('/', (req, res) => {
	res.send({serverId: serverId});
});

// app.use(helmet());
app.use(cors());

// expose module
const fileExplorer = require('./file-explorer');
const uploadFile = require('./upload-file');
const downloadFile = require('./download-file');
const readFile = require('./read-file');
const action = require('./action');
const search = require('./search');


// app.use('/', authenticate());

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
app.get('/download', authenticate(), downloadFile.route);
app.use('/file-explorer', authenticate(), fileExplorer.route);
app.use('/upload', authenticate(), uploadFile.route);
app.use('/read-file', authenticate(), readFile.route);
app.use('/action', authenticate(), action.route);
app.use('/search', authenticate(), search.route);

module.exports = app;
