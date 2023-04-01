const crypto = require('crypto');
require('dotenv').config();
const { MongoClient } = require("mongodb");
const connection = process.env.CONNECTION;
const dbName = process.env.DATABASE_NAME;
const mongodb = new MongoClient(connection);
const database = mongodb.db(dbName);
const collectionName = process.env.COLLECTION;
const col = database.collection(collectionName);

const repository = {

    findAll: async () => await col.find().toArray(),
    findByID: async (id) => await col.findOne({ id: id }),
    create: async (contacts) => {
        const newContact = {
            id: crypto.randomUUID(),
            firstName: contacts.firstName,
            lastName: contacts.lastName,
            email: contacts.email,
            notes: contacts.notes,
            creation: Date(),
            modified: Date(),
            /*This can be used if we want to standardize the time across the database
            if it was used in multiple locations at once.*/

            creation: new Date().toUTCString(),
            
        };

        await col.insertOne(newContact);
    },/*
    deleteByID: (id) => {
        database.delete(id);
    },
    update: (contact) => {
        database.set(contact.id, contact);
    }, */
};

module.exports = repository;