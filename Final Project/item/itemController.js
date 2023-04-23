require('dotenv').config();
const { MongoClient, ObjectId } = require("mongodb");
const connection = process.env.CONNECTION;
const dbName = process.env.DATABASE_NAME;
const mongodb = new MongoClient(connection);
const database = mongodb.db(dbName);
const collectionName = process.env.DATABASE_ITEMS;
const col = database.collection(collectionName);

const itemOperations = {
    findAll: async () => await col.find().toArray(),
    findByID: async (id) => await col.findOne({ _id: new ObjectId(id)}),
    findByName: async (name) => await col.findOne({ name: name }),
    findBySource: async (sourceName) => await col.find({ sourceName: sourceName }).toArray(),
    create: async (item, source) => {
        const newItem = {
            name: item.itemName,
            rarity: item.rarity,
            sourceName: source.name,
            type: source.type,
            sourceLevel: source.level
        };

        await col.insertOne(newItem);
    },
    deleteByID: async (id) => await col.deleteOne({ _id: new ObjectId(id) }),
    update: async (id, item, source) => {
        await col.updateOne({_id: new ObjectId(id)}, { $set: { 
            name: item.itemName,
            rarity: item.rarity,
            sourceName: source.name,
            type: source.type,
            sourceLevel: source.level
        }});
    },
}

module.exports = itemOperations;