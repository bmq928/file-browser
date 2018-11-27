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

// dependency
app.use(helmet());
app.use(cors());

//document
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

//api router
app.use('/file-explore', fileExplore.route);
app.use('/upload', uploadFile.route);
app.use('/download', downloadFile.route);

module.exports = app;