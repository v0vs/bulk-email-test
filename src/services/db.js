const {MongoClient} = require('mongodb');
const {dbUrl, dbName} = require('../config/env');

const mongoConfig = {
    connectTimeoutMS: 10000,
    poolSize: 50,
    reconnectTries: Number.MAX_VALUE,
    reconnectInterval: 50,
    useNewUrlParser: true
};

const collectionsInitArray = [
    {name: 'members', createCollection: async (db) => {
        await db.createCollection('members');
        db.collection('members').createIndex({ email: 1 }, {unique: true, background: true});
    }},
    {name: 'invitations', createCollection: async (db) => {
        await db.createCollection('invitations');
    }}
]

async function createCollectionsIfNotExist(db){
    const collections = await db.collections();

    await Promise.all(collectionsInitArray.map(async (collectionInitObj) => {
        if (!collections.map(collection => collection.s.name).includes(collectionInitObj.name)) {
            await collectionInitObj.createCollection(db);
        }
    }));
}

class DbAccess{
    async initDb(){
        const mongoClient = await MongoClient.connect(dbUrl, mongoConfig);
        this.db = mongoClient.db(dbName);
        await createCollectionsIfNotExist(this.db);
    }
}

module.exports = {dbAccess: new DbAccess()};