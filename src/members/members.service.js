const {ObjectId} = require('mongodb');
const {dbAccess} = require('../services/db');
const MEMBERS_COLLECTION_NAME = 'members';

async function createMembers(newMembers = []){
    const {insertedIds} = await _getCollection().insertMany(newMembers);
    return getMembersByIds(Object.values(insertedIds));
}

async function getMembersByIds(membersIds = []){
    const objectifiedMembersIds = membersIds.map(id => typeof id === 'string' ? ObjectId(id) : id);
    return await _getCollection().find({_id: {$in: objectifiedMembersIds}}).toArray();
}

async function getMemberById(memberId){
    return await _getCollection().findOne({_id:  ObjectId(memberId)});
}

function _getCollection(){
    return dbAccess.db.collection(MEMBERS_COLLECTION_NAME);
}

module.exports = {
    createMembers, getMembersByIds, getMemberById
}