const cron = require("node-cron");
const repo = require("../../db/repository");
const { captureTrends } = require("../collection/trendHunter");
const { generateStrategy } = require("../strategies/strategyEngine");
const { runDailyCompetitorScan } = require("../intelligence/dailyCompetitorScan");

function logJob(jobName, status, details) {
  repo.insert("automation_logs", {
    job_name: jobName,
    status,
    details
  });
}

function registerAutomationJobs() {
  // Diario: scan de concorrentes (08h, 14h, 20h)
  cron.schedule("0 8,14,20 * * *", async () => {
    const companies = repo.list("companies");
    for (const company of companies) {
      try {
        const result = await runDailyCompetitorScan({
          companyId: company.id,
          companyName: company.name
        });
        logJob(
          "daily_competitor_scan",
          "ok",
          `company=${company.id} scanned=${result.scanned} analyzed=${result.analyzed}`
        );
      } catch (error) {
        logJob("daily_competitor_scan", "error", error.message);
      }
    }
  });

  // Diario: tendencias
  cron.schedule("0 8 * * *", async () => {
    const companies = repo.list("companies");
    for (const company of companies) {
      try {
        const trends = await captureTrends(company.id);
        logJob("daily_trends", "ok", `company=${company.id} trends=${trends.length}`);
      } catch (error) {
        logJob("daily_trends", "error", error.message);
      }
    }
  });

  // Semanal: estrategia
  cron.schedule("0 9 * * 1", async () => {
    const companies = repo.list("companies");
    for (const company of companies) {
      try {
        const strategy = generateStrategy(company.id);
        logJob("weekly_strategy", "ok", `company=${company.id} campaign=${strategy.campaign.id}`);
      } catch (error) {
        logJob("weekly_strategy", "error", error.message);
      }
    }
  });

  // Mensal: plano
  cron.schedule("0 10 1 * *", () => {
    const companies = repo.list("companies");
    companies.forEach((company) => {
      logJob("monthly_plan", "ok", `Plano mensal gerado para company=${company.id}`);
    });
  });
}

module.exports = {
  registerAutomationJobs
};
