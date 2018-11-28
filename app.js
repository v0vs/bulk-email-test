const express = require('express');
const http = require('http');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const {initRoutes} = require('./src/config/routes');
const {dbAccess} = require('./src/services/db');

const DEFAULT_PORT = 5000;
const app = express();

dbAccess.initDb().then(() => {
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: false }));
    app.use(cookieParser());

    const server = http.createServer(app);
    server.listen(DEFAULT_PORT);

    initRoutes(app);
}).catch(err => {
    console.error(err);
    process.exit(1);
})

module.exports = {
    app
};