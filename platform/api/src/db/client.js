const Database = require("better-sqlite3");
const fs = require("fs");
const path = require("path");
const { dbPath } = require("../config/env");

const dbDir = path.dirname(dbPath);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

module.exports = db;
