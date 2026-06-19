const path = require("path");
const dotenv = require("dotenv");

dotenv.config();

module.exports = {
  port: Number(process.env.PORT || 4000),
  dbPath: process.env.DB_PATH
    ? path.resolve(__dirname, "..", "..", process.env.DB_PATH)
    : path.resolve(__dirname, "..", "..", "..", "..", "database", "marketing-intelligence.db"),
  imageDefaultProvider: process.env.IMAGE_DEFAULT_PROVIDER || "openai",
  googlePlacesApiKey: process.env.GOOGLE_PLACES_API_KEY || "",
  googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "",
  instagramAccessToken: process.env.INSTAGRAM_ACCESS_TOKEN || "",
  instagramBusinessId: process.env.INSTAGRAM_BUSINESS_ID || "",
  metaAdLibraryToken: process.env.META_AD_LIBRARY_TOKEN || "",
  metaAdLibraryCountry: process.env.META_AD_LIBRARY_COUNTRY || "BR",
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  leonardoApiKey: process.env.LEONARDO_API_KEY || "",
  canvaApiKey: process.env.CANVA_API_KEY || ""
};
