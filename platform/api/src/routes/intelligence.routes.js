const express = require("express");
const { z } = require("zod");
const repo = require("../db/repository");
const { runMarketCollection } = require("../modules/collection/marketIntelligenceEngine");
const { compareCompetitors } = require("../modules/collection/localMarketScanner");
const { captureTrends } = require("../modules/collection/trendHunter");
const { foodInsights } = require("../modules/food/foodServiceEngine");

const router = express.Router();

const collectSchema = z.object({
  companyId: z.number().int().positive(),
  ownMenuUrl: z.string().url(),
  competitorUrls: z.array(z.string().url()).default([])
});

router.post("/collect-links", async (req, res) => {
  const parsed = collectSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const data = await runMarketCollection(parsed.data);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/competitors/:companyId", (req, res) => {
  const companyId = Number(req.params.companyId);
  const competitors = repo.list("competitors", "WHERE company_id = ? ORDER BY created_at DESC", [companyId]);
  const comparison = compareCompetitors(companyId);
  res.json({ competitors, comparison });
});

router.post("/trends/:companyId", async (req, res) => {
  const companyId = Number(req.params.companyId);
  try {
    const trends = await captureTrends(companyId);
    res.json({ trends });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/food/:companyId", (req, res) => {
  const companyId = Number(req.params.companyId);
  res.json(foodInsights(companyId));
});

module.exports = router;
