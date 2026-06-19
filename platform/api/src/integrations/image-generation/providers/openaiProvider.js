const OpenAI = require("openai");

async function generateWithOpenAI({ apiKey, prompt, size = "1024x1024", variations = 2 }) {
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY nao configurada");
  }

  const client = new OpenAI({ apiKey });
  const result = await client.images.generate({
    model: "gpt-image-1",
    prompt,
    size,
    n: variations
  });

  return (result.data || []).map((d) => ({
    url: d.url || null,
    b64: d.b64_json || null
  }));
}

module.exports = {
  generateWithOpenAI
};
