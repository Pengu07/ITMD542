require('dotenv').config();
const { MongoClient } = require("mongodb");
const connection = process.env.CONNECTION;
const dbName = process.env.DATABASE_NAME;
const mongodb = new MongoClient(connection);
const database = mongodb.db(dbName);
const collectionName = process.env.DATABASE_ACCOUNTS;
const col = database.collection(collectionName);

const accountOperations = {
    findAll: async () => await col.find().toArray(),
    findByID: async (id) => await col.findOne({ id: id }),
    create: async (account) => {
        const newAccount = {
            firstName: account.firstName,
            lastName: account.lastName,
            username: account.username,
            password: account.password
        };

        await col.insertOne(newAccount);
    },
    deleteByID: async (id) => await col.deleteOne({ id: id }),
    update: async (account) => {
        await col.updateOne({id: account.id}, { $set: { 
            password: account.password
        }});
    },
}

module.exports = accountOperations;