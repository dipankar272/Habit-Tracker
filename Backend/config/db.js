const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.json');
const adapter = new FileSync(DB_PATH);
const db = low(adapter);

// Set default structure
db.defaults({
  users: [],
  habits: [],
}).write();

console.log('[DB] LowDB (JSON file) initialized at:', DB_PATH);

module.exports = db;