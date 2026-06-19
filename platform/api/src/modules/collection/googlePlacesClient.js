const axios = require("axios");
const { googlePlacesApiKey, googleMapsApiKey } = require("../../config/env");

function getApiKey() {
  return googlePlacesApiKey || googleMapsApiKey;
}

function isConfigured() {
  return Boolean(getApiKey());
}

async function textSearch(query) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { configured: false, places: [] };
  }

  const url = "https://maps.googleapis.com/maps/api/place/textsearch/json";
  const { data } = await axios.get(url, {
    params: {
      query,
      key: apiKey,
      language: "pt-BR"
    },
    timeout: 20000
  });

  const places = (data.results || []).map((x) => ({
    placeId: x.place_id,
    name: x.name,
    formattedAddress: x.formatted_address,
    rating: x.rating || null,
    userRatingsTotal: x.user_ratings_total || 0
  }));

  return { configured: true, places };
}

async function placeDetails(placeId) {
  const apiKey = getApiKey();
  if (!apiKey) {
    return { configured: false, details: null };
  }

  const url = "https://maps.googleapis.com/maps/api/place/details/json";
  const { data } = await axios.get(url, {
    params: {
      place_id: placeId,
      fields: "name,rating,user_ratings_total,reviews,formatted_address,url,website",
      key: apiKey,
      language: "pt-BR"
    },
    timeout: 20000
  });

  return {
    configured: true,
    details: data.result || null
  };
}

module.exports = {
  isConfigured,
  textSearch,
  placeDetails
};
