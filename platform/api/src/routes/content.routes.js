const express = require("express");
const repo = require("../db/repository");
const { generateCaptions } = require("../modules/content/captionEngine");

const router = express.Router();

router.post("/captions", (req, res) => {
  const result = generateCaptions(req.body || {});
  res.json(result);
});

router.get("/:companyId", (req, res) => {
  const companyId = Number(req.params.companyId);
  const contents = repo.list("contents", "WHERE company_id = ? ORDER BY created_at DESC", [companyId]);
  res.json(contents);
});

module.exports = router;
