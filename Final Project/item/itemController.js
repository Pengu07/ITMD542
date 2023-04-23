require('dotenv').config();
const { MongoClient } = require("mongodb");
const connection = process.env.CONNECTION;
const dbName = process.env.DATABASE_NAME;
const mongodb = new MongoClient(connection);
const database = mongodb.db(dbName);
const collectionName = process.env.DATABASE_ITEMS;
const col = database.collection(collectionName);

const Rarity = {
    Common: "Common",
    Uncommon: "Uncommon",
    Rare: "Rare",
    Epic: "Epic",
    Legendary: "Legendary"
}


const itemOperations = {
    findAll: async () => await col.find().toArray(),
    findByID: async (id) => await col.findOne({ id: id }),
    findByName: async (name) => await col.findOne({ name: name }),
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
    deleteByID: async (id) => await col.deleteOne({ id: id }),
    update: async (item) => {
        await col.updateOne({id: item.id}, { $set: { 
            name: item.itemName,
            rarity: item.rarity,
            source: item.source
        }});
    },
}

module.exports = itemOperations;