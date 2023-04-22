require('dotenv').config();
const { MongoClient } = require("mongodb");
const connection = process.env.CONNECTION;
const dbName = process.env.DATABASE_NAME;
const mongodb = new MongoClient(connection);
const database = mongodb.db(dbName);
const collectionName = process.env.DATABASE_SOURCES;
const col = database.collection(collectionName);

const sourceOperations = {
    findAll: async () => await col.find().toArray(),
    findByID: async (id) => await col.findOne({ id: id }),
    findByName: async (name) => await col.findOne({ name: name }),
    create: async (source) => {
        const newSource = {
            name: source.sourceName,
            location: source.location,
            type: source.type,
            level: source.level,
        };

        await col.insertOne(newSource);
    },
    deleteByID: async (id) => await col.deleteOne({ id: id }),
    update: async (source) => {
        await col.updateOne({id: source.id}, { $set: { 
            name: source.sourceName,
            location: source.location,
            type: source.type,
            level: source.level,
        }});
    },
}

module.exports = sourceOperations;