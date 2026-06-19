const axios = require("axios");
const { parseMenuFromHtml } = require("./htmlMenuParser");
const repo = require("../../db/repository");

async function collectMenu(link) {
  const response = await axios.get(link, {
    timeout: 20000,
    headers: {
      "User-Agent": "MarketingIntelligenceBot/1.0"
    }
  });

  return parseMenuFromHtml(response.data, link);
}

function summarizeMenu(items) {
  const categories = new Map();
  const prices = items.map((x) => x.price).filter((x) => typeof x === "number");

  items.forEach((item) => {
    categories.set(item.category, (categories.get(item.category) || 0) + 1);
  });

  const avgPrice = prices.length
    ? Number((prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2))
    : null;

  return {
    itemCount: items.length,
    categoryCount: categories.size,
    avgPrice,
    topCategories: Array.from(categories.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, count]) => ({ name, count }))
  };
}

async function runMarketCollection({ companyId, ownMenuUrl, competitorUrls = [] }) {
  const ownItems = await collectMenu(ownMenuUrl);
  const ownSummary = summarizeMenu(ownItems);

  const competitorSummaries = [];
  for (const competitorUrl of competitorUrls) {
    const items = await collectMenu(competitorUrl);
    const summary = summarizeMenu(items);

    competitorSummaries.push({ competitorUrl, summary, items });

    const comp = repo.insert("competitors", {
      company_id: companyId,
      name: new URL(competitorUrl).hostname,
      source_url: competitorUrl,
      rating: null,
      social_links: JSON.stringify([]),
      diferencials: JSON.stringify([])
    });

    repo.insert("market_analysis", {
      company_id: companyId,
      analysis_type: "competitor_menu_snapshot",
      source_url: competitorUrl,
      summary: `Concorrente ${comp.name}: ${summary.itemCount} itens, ${summary.categoryCount} categorias, preco medio ${summary.avgPrice ?? "n/a"}`,
      raw_data: JSON.stringify({ summary, sample: items.slice(0, 200) }),
      confidence: 0.7
    });
  }

  repo.insert("market_analysis", {
    company_id: companyId,
    analysis_type: "own_menu_snapshot",
    source_url: ownMenuUrl,
    summary: `Operacao propria: ${ownSummary.itemCount} itens, ${ownSummary.categoryCount} categorias, preco medio ${ownSummary.avgPrice ?? "n/a"}`,
    raw_data: JSON.stringify({ summary: ownSummary, sample: ownItems.slice(0, 300) }),
    confidence: 0.85
  });

  return {
    own: { summary: ownSummary, sample: ownItems.slice(0, 120) },
    competitors: competitorSummaries.map((x) => ({
      competitorUrl: x.competitorUrl,
      summary: x.summary,
      sample: x.items.slice(0, 80)
    }))
  };
}

module.exports = {
  runMarketCollection
};
