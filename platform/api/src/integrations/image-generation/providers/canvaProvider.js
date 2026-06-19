const axios = require("axios");

async function generateWithCanva({ apiKey, prompt }) {
  if (!apiKey) {
    throw new Error("CANVA_API_KEY nao configurada");
  }

  const response = await axios.post(
    "https://api.canva.com/rest/v1/designs",
    {
      title: "Marketing Creative",
      notes: prompt
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: 30000
    }
  );

  return [{ designId: response.data?.id || null }];
}

module.exports = {
  generateWithCanva
};
