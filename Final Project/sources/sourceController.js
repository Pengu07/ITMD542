require('dotenv').config();
const { MongoClient, ObjectId } = require("mongodb");
const connection = process.env.CONNECTION;
const dbName = process.env.DATABASE_NAME;
const mongodb = new MongoClient(connection);
const database = mongodb.db(dbName);
const collectionName = process.env.DATABASE_SOURCES;
const col = database.collection(collectionName);

const sourceOperations = {
    findAll: async () => await col.find().toArray(),
    findByID: async (id) => await col.findOne({ _id: new ObjectId(id)}),
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
    deleteByID: async (id) => await col.deleteOne({ _id: new ObjectId(id) }),
    update: async (id, source) => {
        await col.updateOne({_id: new ObjectId(id)}, { $set: { 
            name: source.sourceName,
            location: source.location,
            level: source.level,
        }});
    },
}

module.exports = sourceOperations;