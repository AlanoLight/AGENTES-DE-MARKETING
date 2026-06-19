const express = require("express");
const cors = require("cors");
const { port } = require("./config/env");
require("./db/runMigrations");

const { registerAutomationJobs } = require("./modules/automation/scheduler");
const healthRoutes = require("./routes/health.routes");
const companiesRoutes = require("./routes/companies.routes");
const intelligenceRoutes = require("./routes/intelligence.routes");
const strategyRoutes = require("./routes/strategy.routes");
const campaignsRoutes = require("./routes/campaigns.routes");
const contentRoutes = require("./routes/content.routes");
const creativeRoutes = require("./routes/creative.routes");
const memoryRoutes = require("./routes/memory.routes");
const dashboardRoutes = require("./routes/dashboard.routes");
const automationRoutes = require("./routes/automation.routes");

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/health", healthRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/intelligence", intelligenceRoutes);
app.use("/api/strategies", strategyRoutes);
app.use("/api/campaigns", campaignsRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/creative", creativeRoutes);
app.use("/api/memory", memoryRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/automation", automationRoutes);

app.use((err, _req, res, _next) => {
  res.status(500).json({ error: err.message || "internal_error" });
});

app.listen(port, () => {
  registerAutomationJobs();
  console.log(`Marketing Intelligence API ativa na porta ${port}`);
});
