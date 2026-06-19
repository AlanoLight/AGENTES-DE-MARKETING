const express = require("express");
const { z } = require("zod");
const repo = require("../db/repository");
const { runMarketCollection } = require("../modules/collection/marketIntelligenceEngine");
const { compareCompetitors } = require("../modules/collection/localMarketScanner");
const { captureTrends } = require("../modules/collection/trendHunter");
const { foodInsights } = require("../modules/food/foodServiceEngine");
const { runCompetitorMonitoring } = require("../modules/collection/competitorMonitor");
const { bootstrapPaulinhos } = require("../bootstrapPaulinhos");

const router = express.Router();

function parseJson(value, fallback) {
  if (!value) {
    return fallback;
  }
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

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

const monitorSchema = z.object({
  companyId: z.number().int().positive(),
  companyName: z.string().min(2).optional(),
  ownMenuUrl: z.string().url(),
  competitorUrls: z.array(z.string().url()).default([])
});

router.post("/monitor", async (req, res) => {
  const parsed = monitorSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const result = await runCompetitorMonitoring(parsed.data);
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

router.get("/snapshots/:companyId", (req, res) => {
  const companyId = Number(req.params.companyId);
  const snapshots = repo.list("data_snapshots", "WHERE company_id = ? ORDER BY snapshot_at DESC LIMIT 500", [companyId]);
  res.json({ snapshots });
});

router.get("/temporal/:companyId", (req, res) => {
  const companyId = Number(req.params.companyId);
  const rows = repo.list("temporal_comparisons", "WHERE company_id = ? ORDER BY created_at DESC LIMIT 300", [companyId]);
  res.json({ comparisons: rows });
});

router.get("/competitor-intelligence/:companyId", (req, res) => {
  const companyId = Number(req.params.companyId);

  const snapshots = repo.list(
    "competitor_snapshots",
    "WHERE company_id = ? ORDER BY captured_at DESC LIMIT 400",
    [companyId]
  );
  const insights = repo.list(
    "review_insights",
    "WHERE company_id = ? ORDER BY captured_at DESC LIMIT 200",
    [companyId]
  );
  const temporal = repo.list(
    "temporal_comparisons",
    "WHERE company_id = ? ORDER BY created_at DESC LIMIT 200",
    [companyId]
  );

  const latestByCompetitor = new Map();
  for (const row of snapshots) {
    if (!latestByCompetitor.has(row.competitor_name)) {
      latestByCompetitor.set(row.competitor_name, row);
    }
  }

  const ranking = Array.from(latestByCompetitor.values())
    .sort((a, b) => {
      const scoreA = Number(a.rating || 0) * 20 + Number(a.review_count || 0) * 0.05;
      const scoreB = Number(b.rating || 0) * 20 + Number(b.review_count || 0) * 0.05;
      return scoreB - scoreA;
    })
    .slice(0, 12);

  const growth = temporal
    .filter((x) => x.metric_name === "google_rating" || x.metric_name === "google_review_count")
    .slice(0, 30);

  const reviewOverview = insights.slice(0, 30).map((x) => ({
    competitorName: x.competitor_name,
    sentiment: x.general_sentiment,
    reviewCount: x.review_count,
    complaints: parseJson(x.complaints, []),
    opportunities: parseJson(x.opportunities, []),
    capturedAt: x.captured_at
  }));

  const trendCounts = snapshots.reduce((acc, row) => {
    acc[row.source] = (acc[row.source] || 0) + 1;
    return acc;
  }, {});

  const opportunities = [];
  for (const item of reviewOverview) {
    for (const tip of item.opportunities || []) {
      opportunities.push({ competitorName: item.competitorName, tip });
    }
  }

  res.json({
    ranking,
    reviews: reviewOverview,
    growth,
    trends: trendCounts,
    opportunities: opportunities.slice(0, 20),
    totals: {
      snapshots: snapshots.length,
      insights: insights.length,
      competitors: latestByCompetitor.size
    }
  });
});

const bootstrapSchema = z.object({
  instagramUrl: z.string().url().optional(),
  siteUrl: z.string().url().optional(),
  menuUrl: z.string().url().optional(),
  googleMapsUrl: z.string().url().optional()
});

router.post("/bootstrap-paulinhos", async (req, res) => {
  const parsed = bootstrapSchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const bootstrap = await bootstrapPaulinhos(parsed.data);
    return res.json({ company: bootstrap.company, monitor: bootstrap.result });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
