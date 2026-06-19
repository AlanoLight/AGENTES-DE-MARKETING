const express = require("express");
const { generateStrategy } = require("../modules/strategies/strategyEngine");

const router = express.Router();

router.post("/:companyId", (req, res) => {
  const companyId = Number(req.params.companyId);
  try {
    const strategy = generateStrategy(companyId);
    res.json(strategy);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
