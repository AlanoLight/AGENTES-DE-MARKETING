const express = require("express");
const { z } = require("zod");
const repo = require("../db/repository");
const { runMarketCollection } = require("../modules/collection/marketIntelligenceEngine");
const { compareCompetitors } = require("../modules/collection/localMarketScanner");
const { captureTrends } = require("../modules/collection/trendHunter");
const { foodInsights } = require("../modules/food/foodServiceEngine");
const { runCompetitorMonitoring } = require("../modules/collection/competitorMonitor");

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

router.post("/bootstrap-paulinhos", async (_req, res) => {
  try {
    let company = repo.list("companies", "WHERE name = ? LIMIT 1", ["Paulinhos Burguer"])[0];

    if (!company) {
      company = repo.insert("companies", {
        name: "Paulinhos Burguer",
        city: "Sombrio",
        state: "SC",
        niche: "food_service_delivery",
        instagram_url: "https://www.instagram.com/paulinhosburgueroficial/",
        facebook_url: "",
        ifood_url: "",
        anota_url: "https://pedido.anota.ai/loja/paulinhos-burguer-4?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGn794V0cKLUjYGihvQ4Mw1gJsmjEe3g5qqQb9HJHsD2Zm8Z-g21cDR-nfEFkQ_aem_h3gaj4cCzxb0YjHZ3RjChw&utm_id=97760_v0_s00_e0_tv3",
        delivery_url: "https://pedido.anota.ai/loja/paulinhos-burguer-4?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGn794V0cKLUjYGihvQ4Mw1gJsmjEe3g5qqQb9HJHsD2Zm8Z-g21cDR-nfEFkQ_aem_h3gaj4cCzxb0YjHZ3RjChw&utm_id=97760_v0_s00_e0_tv3"
      });
    }

    const monitor = await runCompetitorMonitoring({
      companyId: company.id,
      companyName: company.name,
      ownMenuUrl: company.delivery_url,
      competitorUrls: ["https://maisdeliveryapp.com.br/pwa/shop/detail/list/product/subcategorie/MjU1ODQ="]
    });

    return res.json({ company, monitor });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
