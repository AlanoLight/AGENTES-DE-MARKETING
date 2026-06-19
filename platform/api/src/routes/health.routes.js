const express = require("express");

const router = express.Router();

router.get("/", (_, res) => {
  res.json({ status: "ok", service: "marketing-intelligence-api" });
});

module.exports = router;
