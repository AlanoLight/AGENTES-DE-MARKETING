const express = require("express");
const repo = require("../db/repository");

const router = express.Router();

router.get("/overview/:companyId", (req, res) => {
  const companyId = Number(req.params.companyId);

  const campaigns = repo.list("campaigns", "WHERE company_id = ?", [companyId]);
  const trends = repo.list("trends", "WHERE company_id = ? ORDER BY captured_at DESC LIMIT 20", [companyId]);
  const analyses = repo.list("market_analysis", "WHERE company_id = ? ORDER BY created_at DESC LIMIT 20", [companyId]);
  const competitors = repo.list("competitors", "WHERE company_id = ?", [companyId]);
  const snapshots = repo.list("data_snapshots", "WHERE company_id = ? ORDER BY snapshot_at DESC LIMIT 100", [companyId]);
  const temporal = repo.list("temporal_comparisons", "WHERE company_id = ? ORDER BY created_at DESC LIMIT 100", [companyId]);

  const kpis = {
    campaigns: campaigns.length,
    activeCampaigns: campaigns.filter((c) => c.status === "active").length,
    trendsCaptured: trends.length,
    analyses: analyses.length,
    competitors: competitors.length,
    snapshots: snapshots.length,
    temporalComparisons: temporal.length
  };

  res.json({ kpis, campaigns, trends, analyses, competitors, snapshots, temporal });
});

module.exports = router;
