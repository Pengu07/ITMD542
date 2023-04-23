require('dotenv').config();
const { MongoClient, ObjectId } = require("mongodb");
const connection = process.env.CONNECTION;
const dbName = process.env.DATABASE_NAME;
const mongodb = new MongoClient(connection);
const database = mongodb.db(dbName);
const collectionName = process.env.DATABASE_ACCOUNTS;
const col = database.collection(collectionName);

const accountOperations = {
    findAll: async () => await col.find().toArray(),
    findByID: async (id) => await col.findOne({ _id: new ObjectId(id) }),
    findByUsername: async (username) => await col.findOne({ username: username }),
    create: async (account) => {
        const newAccount = {
            firstName: account.firstName,
            lastName: account.lastName,
            username: account.username,
            password: account.password,
            salt: account.salt,
            admin: 'n'
        };

        await col.insertOne(newAccount);
    },
    deleteByID: async (id) => await col.deleteOne({ _id: new ObjectId(id) }),
    update: async (id, account) => {
        await col.updateOne({_id: new ObjectId(id)}, { $set: { 
            firstName: account.firstName,
            lastName: account.lastName,
            username: account.username,
            admin: account.admin
        }});
    },
}

module.exports = accountOperations;