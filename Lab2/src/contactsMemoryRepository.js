const database = new Map();
let numberId = 0;


const repository = {
    findAll: () => Array.from(database.values()),
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
};

module.exports = repository;