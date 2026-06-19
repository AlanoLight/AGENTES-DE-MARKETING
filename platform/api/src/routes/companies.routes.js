const express = require("express");
const { z } = require("zod");
const repo = require("../db/repository");

const router = express.Router();

const createCompanySchema = z.object({
  name: z.string().min(2),
  city: z.string().optional(),
  state: z.string().optional(),
  niche: z.string().optional(),
  instagram_url: z.string().url().optional(),
  facebook_url: z.string().url().optional(),
  ifood_url: z.string().url().optional(),
  anota_url: z.string().url().optional(),
  delivery_url: z.string().url().optional()
});

router.get("/", (_, res) => {
  res.json(repo.list("companies", "ORDER BY created_at DESC"));
});

router.post("/", (req, res) => {
  const parsed = createCompanySchema.safeParse(req.body || {});
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  const company = repo.insert("companies", parsed.data);
  return res.status(201).json(company);
});

module.exports = router;
