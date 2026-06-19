const axios = require("axios");
const { metaAdLibraryToken, metaAdLibraryCountry } = require("../../config/env");

function isConfigured() {
  return Boolean(metaAdLibraryToken);
}

async function searchAds({ query, limit = 25 }) {
  if (!isConfigured()) {
    return { configured: false, ads: [] };
  }

  const url = "https://graph.facebook.com/v20.0/ads_archive";
  const { data } = await axios.get(url, {
    params: {
      access_token: metaAdLibraryToken,
      search_terms: query,
      ad_type: "ALL",
      ad_reached_countries: JSON.stringify([metaAdLibraryCountry]),
      fields: "id,page_name,ad_creation_time,ad_delivery_start_time,ad_delivery_stop_time,ad_snapshot_url,currency,spend,impressions",
      limit
    },
    timeout: 30000
  });

  return {
    configured: true,
    ads: data.data || []
  };
}

module.exports = {
  isConfigured,
  searchAds
};
