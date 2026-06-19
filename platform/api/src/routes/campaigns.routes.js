const express = require("express");
const repo = require("../db/repository");

const router = express.Router();

router.get("/:companyId", (req, res) => {
  const companyId = Number(req.params.companyId);
  const campaigns = repo.list("campaigns", "WHERE company_id = ? ORDER BY created_at DESC", [companyId]);
  res.json(campaigns);
});

router.patch("/:id/status", (req, res) => {
  const id = Number(req.params.id);
  const status = String(req.body?.status || "");
  if (!status) {
    return res.status(400).json({ error: "status obrigatorio" });
  }
  const updated = repo.update("campaigns", id, { status });
  res.json(updated);
});

module.exports = router;
