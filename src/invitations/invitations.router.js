const express = require('express');
const {ACCEPTED} = require('http-status-codes');
const InvitationsService = require('./invitations.service');
const {catchAsyncErrors} = require('../config/route-middlewares');

const invitationsRouter = express.Router();

invitationsRouter.post('/', catchAsyncErrors(inviteMembers));
async function inviteMembers(req, res, next){
    const {inviterId, membersIds} = req.body
    const invitationId = await InvitationsService.inviteMembers({inviterId, membersIds});
    res.status(ACCEPTED).json({invitationId});
}

module.exports = {invitationsRouter};
