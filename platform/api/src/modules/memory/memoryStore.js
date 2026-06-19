const repo = require("../../db/repository");

function saveMemory(companyId, entryType, payload) {
  return repo.insert("memory_entries", {
    company_id: companyId,
    entry_type: entryType,
    payload: JSON.stringify(payload)
  });
}

function getMemory(companyId, limit = 50) {
  return repo.list(
    "memory_entries",
    "WHERE company_id = ? ORDER BY created_at DESC LIMIT ?",
    [companyId, limit]
  ).map((x) => ({
    ...x,
    payload: safeJson(x.payload)
  }));
}

function safeJson(value) {
  try {
    return JSON.parse(value || "{}");
  } catch {
    return { raw: value };
  }
}

module.exports = {
  saveMemory,
  getMemory
};
