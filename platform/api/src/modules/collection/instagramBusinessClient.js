const axios = require("axios");
const { instagramAccessToken, instagramBusinessId } = require("../../config/env");

function isConfigured() {
  return Boolean(instagramAccessToken && instagramBusinessId);
}

async function fetchBusinessMedia(limit = 20) {
  if (!isConfigured()) {
    return { configured: false, media: [] };
  }

  const fields = "id,caption,media_type,media_url,permalink,timestamp,like_count,comments_count";
  const url = `https://graph.facebook.com/v20.0/${instagramBusinessId}/media`;

  const { data } = await axios.get(url, {
    params: {
      fields,
      limit,
      access_token: instagramAccessToken
    },
    timeout: 20000
  });

  return {
    configured: true,
    media: data.data || []
  };
}

async function fetchAccountInsights() {
  if (!isConfigured()) {
    return { configured: false, insights: [] };
  }

  const metrics = "impressions,reach,profile_views,follower_count";
  const url = `https://graph.facebook.com/v20.0/${instagramBusinessId}/insights`;
  const { data } = await axios.get(url, {
    params: {
      metric: metrics,
      period: "day",
      access_token: instagramAccessToken
    },
    timeout: 20000
  });

  return {
    configured: true,
    insights: data.data || []
  };
}

module.exports = {
  isConfigured,
  fetchBusinessMedia,
  fetchAccountInsights
};
