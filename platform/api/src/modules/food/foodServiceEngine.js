const repo = require("../../db/repository");

function foodInsights(companyId) {
  const analyses = repo.list(
    "market_analysis",
    "WHERE company_id = ? ORDER BY created_at DESC LIMIT 40",
    [companyId]
  );

  const snapshots = analyses
    .map((a) => {
      try {
        return JSON.parse(a.raw_data || "{}");
      } catch {
        return {};
      }
    })
    .filter((x) => x.summary);

  const avgPrices = snapshots.map((s) => s.summary.avgPrice).filter((n) => typeof n === "number");
  const itemCounts = snapshots.map((s) => s.summary.itemCount).filter((n) => typeof n === "number");

  const avgPrice = avgPrices.length ? Number((avgPrices.reduce((a, b) => a + b, 0) / avgPrices.length).toFixed(2)) : null;
  const avgItemCount = itemCounts.length ? Number((itemCounts.reduce((a, b) => a + b, 0) / itemCounts.length).toFixed(2)) : null;

  const recommendations = [
    "Separar cardapio por missao de compra: entrada, combo, premium e compartilhamento.",
    "Criar indicadores semanais: ticket medio, taxa de combo e venda de itens premium.",
    "Aplicar teste A/B de promocao com controle de margem em janela curta."
  ];

  return {
    avgObservedPrice: avgPrice,
    avgObservedItemCount: avgItemCount,
    recommendations
  };
}

module.exports = {
  foodInsights
};
