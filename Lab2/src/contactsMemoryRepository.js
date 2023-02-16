const database = new Map();
let numberId = 1;

const testData = {id: '0',firstName: 'William',lastName: 'Smith',email: 'WillS@Email.com',notes: 'Example Text',creation: new Date()};
database.set('0',testData);

const repository = {
    findAll: () => Array.from(database.values()),
    findByID: (id) => database.get(id),
    create: (contacts) => {
        const newContact = {
            id: numberId++,
            firstName: contacts.firstName,
            lastName: contacts.lastName,
            email: contacts.email,
            notes: contacts.notes,
            creation: new Date(),
            /*This can be used if we want to standardize the time across the database
            if it was used in multiple locations at once.

            creation: new Date().toUTCString(),
            */
        };

        database.set(newContact.id, newContact);
    },
    deleteByID: (id) => database.delete(id),
    update: (contact) => database.set(contact.id, contact),
};

module.exports = repository;