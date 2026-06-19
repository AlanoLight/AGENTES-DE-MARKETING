function buildHashtags(inputTags = []) {
  const defaults = ["#delivery", "#hamburguer", "#comidaboa", "#sombrio"];
  const merged = [...new Set([...inputTags, ...defaults])];
  return merged.slice(0, 12);
}

function generateCaptions({ campaignName, audience, imageDescription, product, tone = "direto" }) {
  const base = `${campaignName} | Produto: ${product}. Publico: ${audience}. Visual: ${imageDescription}. Tom: ${tone}.`;

  return {
    short: `${product} no ponto certo. Pede agora e mata a fome sem enrolacao.`,
    medium: `${product} acabou de entrar no radar da ${campaignName}. ${audience} que curte sabor forte e entrega rapida ja tem destino: pedido imediato no link da bio.`,
    long: `${base} Hoje a campanha entra com foco em conversao: destaque de produto, oferta clara e chamada direta para pedido. Use o criativo principal no feed e versoes curtas em stories para reforcar abertura e ultima chamada.`,
    cta: "Clique no link e faz teu pedido agora.",
    hashtags: buildHashtags([`#${String(product || "produto").replace(/\s+/g, "").toLowerCase()}`])
  };
}

module.exports = {
  generateCaptions
};
