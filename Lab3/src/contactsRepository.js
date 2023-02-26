const database = new Map();
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const sqlite = require('better-sqlite3');
const Contact = require('./Contact')

const db = new sqlite(path.join(__dirname, '../database/contacts.sqlite'), {verbose: console.log});

const createTable = db.prepare("CREATE TABLE IF NOT EXISTS CONTACTS (id INTEGER PRIMARY KEY AUTOINCREMENT, first_name TEXT NOT NULL, last_name TEXT NOT NULL, email TEXT NOT NULL, notes TEXT, creation TEXT, modified TEXT)");
createTable.run();

const repository = {
    findAll: () => {
        const statement = db.prepare("SELECT * FROM CONTACTS");
        const rows = statement.all();
        let contacts = [];
        rows.forEach((row) => {
            const contact = new Contact(row.id, row.first_name, row.last_name, row.email, row.notes, row.creation, row.modified);
            contacts.push(contact);
        });
        return contacts;
    },
    findByID: (id) => database.get(id),
    create: (contacts) => {
        const newContact = {
            id: crypto.randomUUID(),
            firstName: contacts.firstName,
            lastName: contacts.lastName,
            email: contacts.email,
            notes: contacts.notes,
            creation: Date(),
            modified: Date(),
            /*This can be used if we want to standardize the time across the database
            if it was used in multiple locations at once.

            creation: new Date().toUTCString(),
            */
        };

        database.set(newContact.id, newContact);
        saveData();
    },
    deleteByID: (id) => {
        database.delete(id);
        saveData();
    },
    update: (contact) => {
        database.set(contact.id, contact);
        saveData();
    },
};

module.exports = repository;