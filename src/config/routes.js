const express = require('express');
const {INTERNAL_SERVER_ERROR} = require('http-status-codes');

const {membersRouter} = require('../members/members.router');
const {invitationsRouter} = require('../invitations/invitations.router');

function initRoutes(app){
    const apiRouter = express.Router();
    app.use('/api/v1', apiRouter);

    apiRouter.use('/members', membersRouter);
    apiRouter.use('/invitations', invitationsRouter);

    app.use((err, req, res, next) => {
        console.error(err);
        res.status(err.statusCode|| INTERNAL_SERVER_ERROR).send(err.message);
    });
}

module.exports = {
    initRoutes
};