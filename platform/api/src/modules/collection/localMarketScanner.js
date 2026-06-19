const repo = require("../../db/repository");

function compareCompetitors(companyId) {
  const analyses = repo.list(
    "market_analysis",
    "WHERE company_id = ? AND analysis_type IN ('own_menu_snapshot', 'competitor_menu_snapshot') ORDER BY created_at DESC",
    [companyId]
  );

  const own = analyses.find((a) => a.analysis_type === "own_menu_snapshot");
  const competitors = analyses.filter((a) => a.analysis_type === "competitor_menu_snapshot");

  if (!own) {
    return { ok: false, reason: "own_snapshot_missing" };
  }

  const ownRaw = JSON.parse(own.raw_data || "{}");
  const ownAvg = ownRaw.summary?.avgPrice || 0;
  const ownCount = ownRaw.summary?.itemCount || 0;

  const rows = competitors.map((c) => {
    const raw = JSON.parse(c.raw_data || "{}");
    const avg = raw.summary?.avgPrice || 0;
    const count = raw.summary?.itemCount || 0;
    return {
      sourceUrl: c.source_url,
      avgPrice: avg,
      itemCount: count,
      gapAvgPrice: Number((ownAvg - avg).toFixed(2)),
      gapItemCount: ownCount - count
    };
  });

  return {
    ok: true,
    own: { avgPrice: ownAvg, itemCount: ownCount },
    competitors: rows
  };
}

module.exports = {
  compareCompetitors
};
