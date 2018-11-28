const express = require('express');
const {CREATED} = require('http-status-codes');
const {catchAsyncErrors} = require('../config/route-middlewares');
const {validateNewMembers} = require('./members.validator');
const MembersService = require('./members.service');

const membersRouter = express.Router();

membersRouter.post('/',  validateNewMembers, catchAsyncErrors(createMembers));
async function createMembers(req, res){
    const createdMembers = await MembersService.createMembers(req.body);
    res.status(CREATED).json(createdMembers);
}

module.exports = {membersRouter};
