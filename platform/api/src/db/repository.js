const db = require("./client");

function list(table, where = "", params = []) {
  const sql = `SELECT * FROM ${table} ${where}`.trim();
  return db.prepare(sql).all(...params);
}

function getById(table, id) {
  return db.prepare(`SELECT * FROM ${table} WHERE id = ?`).get(id);
}

function insert(table, payload) {
  const keys = Object.keys(payload);
  const placeholders = keys.map(() => "?").join(", ");
  const stmt = db.prepare(
    `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`
  );
  const result = stmt.run(...keys.map((k) => payload[k]));
  return getById(table, result.lastInsertRowid);
}

function update(table, id, payload) {
  const keys = Object.keys(payload);
  const setSql = keys.map((k) => `${k} = ?`).join(", ");
  const stmt = db.prepare(`UPDATE ${table} SET ${setSql}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`);
  stmt.run(...keys.map((k) => payload[k]), id);
  return getById(table, id);
}

function remove(table, id) {
  return db.prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
}

module.exports = {
  db,
  list,
  getById,
  insert,
  update,
  remove
};
