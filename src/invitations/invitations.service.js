const {uniq} = require('lodash');
const {getMembersByIds, getMemberById} = require('../members/members.service');
const {sendBulkMail} = require('../services/mail.service');
const {dbAccess} = require('../services/db');

const INVITATIONS_COLLECTION_NAME = 'invitations';
const DEFAULT_INVITE_SYSTEM_MAIL = "vlasorokin@gmail.com";
const INVITE_EMAIL_ID = 'd-15954d3561674676a82a9213fd9ef26b';

async function inviteMembers({inviterId, membersIds}){
    let inviteEmail;
    if (inviterId){
        const inviterMember = await getMemberById(inviterId);
        inviteEmail = inviterMember && inviterMember.email;
    }

    const createdInvitationId = await _createInvitation(inviterId);
    
    const uniqueMembersIds = uniq(membersIds);
    getMembersByIds(uniqueMembersIds).then(members => {
        _sendInviteMails(createdInvitationId, inviteEmail, members);
    });

    return createdInvitationId;
}

async function _sendInviteMails(invitationId, inviteByEmail = DEFAULT_INVITE_SYSTEM_MAIL, members = []){
    try{
        const basicMailMsg = {
            from: inviteByEmail, 
            subject: 'Hooray!',
            templateId: INVITE_EMAIL_ID
        };

        const personalizations = members.map(({email, name}) => 
            ({to: email, dynamic_template_data: {name}})
        );

        await sendBulkMail(basicMailMsg, personalizations);
        _updateInvitation(invitationId, {status: 'success'});
    }catch(err){
        _updateInvitation(invitationId, {status: 'failed'});
        console.error(err);
    }
}

async function _createInvitation(inviterId){
    const invitation = {inviterId, createdTime: new Date(new Date().toUTCString())}
    const {insertedId} = await _getCollection().insertOne(invitation);

    return insertedId;
}

async function _updateInvitation(invitationId, updatedInvitation){
    await _getCollection().updateOne({_id: invitationId}, {$set: updatedInvitation});
}

function _getCollection(){
    return dbAccess.db.collection(INVITATIONS_COLLECTION_NAME);
}

module.exports = {
    inviteMembers
}