const repo = require("../../db/repository");
const { generateImage } = require("../../integrations/image-generation");

function buildImagePrompt({ campaign, audience, product, visualDirection }) {
  return [
    `Campanha: ${campaign}`,
    `Publico: ${audience}`,
    `Produto: ${product}`,
    `Direcao visual: ${visualDirection}`,
    "Objetivo: gerar imagem comercial com foco em conversao local."
  ].join(" | ");
}

async function createCreative({ companyId, campaignId, provider, campaign, audience, product, visualDirection, variations = 2 }) {
  const prompt = buildImagePrompt({ campaign, audience, product, visualDirection });
  const images = await generateImage({ provider, prompt, variations });

  const asset = repo.insert("creative_assets", {
    company_id: companyId,
    campaign_id: campaignId || null,
    provider: provider || "openai",
    prompt,
    image_url: images[0]?.url || null,
    variations_json: JSON.stringify(images)
  });

  return { asset, images, prompt };
}

module.exports = {
  createCreative,
  buildImagePrompt
};
