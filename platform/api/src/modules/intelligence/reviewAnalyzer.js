const repo = require("../../db/repository");

const POSITIVE_TERMS = [
  "bom",
  "boa",
  "otimo",
  "otima",
  "excelente",
  "saboroso",
  "saborosa",
  "rapido",
  "rapida",
  "recomendo",
  "perfeito",
  "perfeita",
  "qualidade"
];

const NEGATIVE_TERMS = [
  "ruim",
  "demora",
  "atraso",
  "frio",
  "fria",
  "caro",
  "cara",
  "queimado",
  "errado",
  "erro",
  "pessimo",
  "cancelado"
];

const OPPORTUNITY_HINTS = {
  demora: "Revisar tempo de preparo e promessa de entrega.",
  atraso: "Ajustar capacidade por faixa horaria e roteirizacao.",
  frio: "Melhorar embalagem termica e despacho.",
  fria: "Melhorar embalagem termica e despacho.",
  caro: "Testar combos com maior valor percebido.",
  cara: "Testar combos com maior valor percebido.",
  erro: "Padronizar checklist de montagem antes do envio.",
  errado: "Padronizar checklist de montagem antes do envio.",
  queimado: "Ajustar controle de qualidade na finalizacao."
};

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function countTerms(reviews, terms) {
  const counts = new Map();
  for (const review of reviews) {
    const text = normalizeText(review.review_text || review.text || "");
    for (const term of terms) {
      if (text.includes(term)) {
        counts.set(term, (counts.get(term) || 0) + 1);
      }
    }
  }

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([term, count]) => ({ term, count }));
}

function getGeneralSentiment(reviews) {
  if (!reviews.length) {
    return "neutro";
  }

  const ratings = reviews.map((r) => Number(r.rating)).filter((r) => Number.isFinite(r));
  if (!ratings.length) {
    return "neutro";
  }

  const avg = ratings.reduce((sum, x) => sum + x, 0) / ratings.length;
  if (avg >= 4.2) {
    return "positivo";
  }
  if (avg >= 3.3) {
    return "misto";
  }
  return "negativo";
}

function buildOpportunities(complaints) {
  const opportunities = [];
  for (const item of complaints) {
    const hint = OPPORTUNITY_HINTS[item.term];
    if (hint && !opportunities.includes(hint)) {
      opportunities.push(hint);
    }
  }

  if (!opportunities.length) {
    opportunities.push("Aumentar incentivo para reviews com foto e prova de produto.");
  }

  return opportunities.slice(0, 6);
}

function analyzeReviews({ companyId, competitorName, source = "google_places", reviews = [] }) {
  const praises = countTerms(reviews, POSITIVE_TERMS);
  const complaints = countTerms(reviews, NEGATIVE_TERMS);
  const generalSentiment = getGeneralSentiment(reviews);
  const opportunities = buildOpportunities(complaints);

  const payload = {
    praises,
    complaints,
    generalSentiment,
    opportunities,
    reviewCount: reviews.length
  };

  const insight = repo.insert("review_insights", {
    company_id: companyId,
    competitor_name: competitorName,
    source,
    praises: JSON.stringify(praises),
    complaints: JSON.stringify(complaints),
    general_sentiment: generalSentiment,
    opportunities: JSON.stringify(opportunities),
    review_count: reviews.length,
    raw_data: JSON.stringify(reviews)
  });

  repo.insert("market_analysis", {
    company_id: companyId,
    analysis_type: "review_analysis",
    source_url: source,
    summary: `Reviews analisados para ${competitorName}: sentimento ${generalSentiment}, ${reviews.length} reviews.`,
    raw_data: JSON.stringify(payload),
    confidence: 0.76
  });

  return {
    ...payload,
    insightId: insight.id
  };
}

module.exports = {
  analyzeReviews
};
