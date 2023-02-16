const database = new Map();

const repository = {
    findAll: () => Array.from(database.values()),
};