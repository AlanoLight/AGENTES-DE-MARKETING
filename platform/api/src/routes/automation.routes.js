const express = require("express");
const repo = require("../db/repository");

const router = express.Router();

router.get("/logs", (_, res) => {
  const logs = repo.list("automation_logs", "ORDER BY executed_at DESC LIMIT 200");
  res.json(logs);
});

module.exports = router;
