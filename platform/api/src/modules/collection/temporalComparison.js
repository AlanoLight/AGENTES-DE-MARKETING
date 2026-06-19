const repo = require("../../db/repository");

function toMetric(raw, name) {
  if (!raw || typeof raw !== "object") {
    return null;
  }
  const v = raw[name];
  return typeof v === "number" ? v : null;
}

function computeDelta(prev, curr) {
  if (typeof prev !== "number" || typeof curr !== "number") {
    return { deltaAbs: null, deltaPct: null };
  }

  const deltaAbs = Number((curr - prev).toFixed(2));
  const deltaPct = prev === 0 ? null : Number((((curr - prev) / prev) * 100).toFixed(2));
  return { deltaAbs, deltaPct };
}

function buildTemporalComparisons(companyId) {
  const snapshots = repo.list(
    "data_snapshots",
    "WHERE company_id = ? ORDER BY snapshot_at DESC",
    [companyId]
  );

  const grouped = new Map();
  snapshots.forEach((s) => {
    const key = `${s.competitor_id || 0}|${s.snapshot_type}|${s.source}`;
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }
    grouped.get(key).push(s);
  });

  const created = [];
  grouped.forEach((list) => {
    if (list.length < 2) {
      return;
    }

    const current = list[0];
    const previous = list[1];
    const currentMetrics = JSON.parse(current.metrics_json || "{}");
    const previousMetrics = JSON.parse(previous.metrics_json || "{}");

    const metricNames = ["avgPrice", "itemCount", "rating", "reviewCount", "adCount", "instagramMediaCount"];

    metricNames.forEach((metricName) => {
      const prev = toMetric(previousMetrics, metricName);
      const curr = toMetric(currentMetrics, metricName);
      if (prev === null && curr === null) {
        return;
      }
      const delta = computeDelta(prev, curr);
      const row = repo.insert("temporal_comparisons", {
        company_id: companyId,
        competitor_id: current.competitor_id,
        metric_name: metricName,
        value_previous: prev,
        value_current: curr,
        delta_abs: delta.deltaAbs,
        delta_pct: delta.deltaPct,
        period_previous: previous.snapshot_at,
        period_current: current.snapshot_at
      });
      created.push(row);
    });
  });

  return created;
}

module.exports = {
  buildTemporalComparisons
};
