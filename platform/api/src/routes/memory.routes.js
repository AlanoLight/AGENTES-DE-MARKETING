const express = require("express");
const { saveMemory, getMemory } = require("../modules/memory/memoryStore");

const router = express.Router();

router.get("/:companyId", (req, res) => {
  const companyId = Number(req.params.companyId);
  res.json(getMemory(companyId));
});

router.post("/:companyId", (req, res) => {
  const companyId = Number(req.params.companyId);
  const entryType = String(req.body?.entryType || "general");
  const payload = req.body?.payload || {};
  res.status(201).json(saveMemory(companyId, entryType, payload));
});

module.exports = router;
