const fs = require("fs");
const path = require("path");
const db = require("./client");

const migrationsDir = path.resolve(__dirname, "migrations");
const files = fs.readdirSync(migrationsDir).sort();

files.forEach((file) => {
  const sql = fs.readFileSync(path.join(migrationsDir, file), "utf-8");
  db.exec(sql);
  console.log(`Migration applied: ${file}`);
});

console.log("All migrations applied.");
