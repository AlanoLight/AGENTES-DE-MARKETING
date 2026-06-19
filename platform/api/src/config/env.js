const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: Number(process.env.PORT || 4000),
  dbPath: process.env.DB_PATH
    ? path.resolve(__dirname, "..", "..", process.env.DB_PATH)
    : path.resolve(__dirname, "..", "..", "..", "..", "database", "marketing-intelligence.db"),
  imageDefaultProvider: process.env.IMAGE_DEFAULT_PROVIDER || "openai",
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  leonardoApiKey: process.env.LEONARDO_API_KEY || "",
  canvaApiKey: process.env.CANVA_API_KEY || ""
};
