const axios = require("axios");
const repo = require("../../db/repository");

const trendSources = [
  "https://trends.google.com/trends/trendingsearches/daily/rss?geo=BR",
  "https://www.youtube.com/feeds/videos.xml?channel_id=UChBfR6QkAJl4an5EFfA6R_w"
];

async function captureTrends(companyId) {
  const results = [];

  for (const source of trendSources) {
    try {
      const response = await axios.get(source, { timeout: 15000 });
      const payload = response.data;
      const matches = String(payload).match(/<title>(.*?)<\/title>/g) || [];

      matches.slice(1, 12).forEach((m, idx) => {
        const trendName = m.replace(/<\/?title>/g, "").trim();
        if (!trendName) {
          return;
        }
        const trend = repo.insert("trends", {
          company_id: companyId,
          source,
          trend_name: trendName,
          trend_score: 100 - idx * 4,
          trend_url: source,
          notes: "captured_automatically"
        });
        results.push(trend);
      });
    } catch (error) {
      repo.insert("automation_logs", {
        job_name: "trend_hunter",
        status: "error",
        details: `Falha ao capturar ${source}: ${error.message}`
      });
    }
  }

  return results;
}

module.exports = {
  captureTrends
};
