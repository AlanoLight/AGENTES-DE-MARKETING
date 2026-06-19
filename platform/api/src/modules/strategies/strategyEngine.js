const repo = require("../../db/repository");

function topTrendNames(companyId, limit = 6) {
  const rows = repo.list(
    "trends",
    "WHERE company_id = ? ORDER BY trend_score DESC, captured_at DESC LIMIT ?",
    [companyId, limit]
  );
  return rows.map((r) => r.trend_name);
}

function generateStrategy(companyId) {
  const analyses = repo.list(
    "market_analysis",
    "WHERE company_id = ? ORDER BY created_at DESC LIMIT 30",
    [companyId]
  );

  const trends = topTrendNames(companyId);
  const hasCompetitorData = analyses.some((x) => x.analysis_type === "competitor_menu_snapshot");

  const strategyLines = [
    "Priorizar campanhas de ticket medio com combo + bebida.",
    "Criar duas janelas de promocao: abertura e ultima chamada.",
    "Ativar conteudo de produto com prova visual e CTA de pedido imediato.",
    "Manter trilha de experimento semanal com controle por canal."
  ];

  if (hasCompetitorData) {
    strategyLines.push("Executar monitoramento de diferenciais e preco medio da concorrencia 2x por semana.");
  }

  if (trends.length) {
    strategyLines.push(`Incorporar tendencias detectadas: ${trends.join(", ")}.`);
  }

  const strategyText = strategyLines.join(" ");

  const campaign = repo.insert("campaigns", {
    company_id: companyId,
    name: `Plano semanal orientado a dados ${new Date().toISOString().slice(0, 10)}`,
    objective: "Aumentar pedidos e ticket medio com base em inteligencia de mercado",
    status: "planned",
    channel: "instagram|delivery|whatsapp",
    budget: null,
    start_date: new Date().toISOString().slice(0, 10),
    end_date: null,
    result_summary: null
  });

  repo.insert("ideas", {
    company_id: companyId,
    source: "strategy_engine",
    title: "Estrategia automatica semanal",
    description: strategyText,
    confidence: 0.78,
    tags: JSON.stringify(["strategy", "automation", "food-service"])
  });

  repo.insert("memory_entries", {
    company_id: companyId,
    entry_type: "strategy_snapshot",
    payload: JSON.stringify({ strategyText, campaignId: campaign.id })
  });

  return {
    campaign,
    strategyText,
    trends
  };
}

module.exports = {
  generateStrategy
};
