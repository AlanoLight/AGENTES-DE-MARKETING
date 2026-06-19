const axios = require("axios");

async function generateWithLeonardo({ apiKey, prompt, width = 1024, height = 1024, variations = 2 }) {
  if (!apiKey) {
    throw new Error("LEONARDO_API_KEY nao configurada");
  }

  const response = await axios.post(
    "https://cloud.leonardo.ai/api/rest/v1/generations",
    {
      prompt,
      width,
      height,
      num_images: variations
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      timeout: 30000
    }
  );

  const generationId = response.data?.sdGenerationJob?.generationId;
  return [{ generationId }];
}

module.exports = {
  generateWithLeonardo
};
