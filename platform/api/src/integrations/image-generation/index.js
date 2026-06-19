const { imageDefaultProvider, openAiApiKey, leonardoApiKey, canvaApiKey } = require("../../config/env");
const { generateWithOpenAI } = require("./providers/openaiProvider");
const { generateWithLeonardo } = require("./providers/leonardoProvider");
const { generateWithCanva } = require("./providers/canvaProvider");

async function generateImage({ provider = imageDefaultProvider, prompt, variations = 2 }) {
  if (!prompt) {
    throw new Error("Prompt da imagem e obrigatorio");
  }

  if (provider === "openai") {
    return generateWithOpenAI({ apiKey: openAiApiKey, prompt, variations });
  }

  if (provider === "leonardo") {
    return generateWithLeonardo({ apiKey: leonardoApiKey, prompt, variations });
  }

  if (provider === "canva") {
    return generateWithCanva({ apiKey: canvaApiKey, prompt });
  }

  throw new Error(`Provider nao suportado: ${provider}`);
}

module.exports = {
  generateImage
};
