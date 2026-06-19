const cheerio = require("cheerio");

function normalizePrice(raw) {
  if (!raw) {
    return null;
  }
  const clean = String(raw).replace(/[^0-9,\.]/g, "").replace(".", "").replace(",", ".");
  const value = Number(clean);
  return Number.isFinite(value) ? value : null;
}

function parseMenuFromHtml(html, sourceUrl) {
  const $ = cheerio.load(html);
  const items = [];
  let currentCategory = "Sem categoria";

  $("h2, h3").each((_, el) => {
    const text = $(el).text().trim();
    if (!text) {
      return;
    }

    if (el.tagName.toLowerCase() === "h2") {
      currentCategory = text;
      return;
    }

    const nextText = $(el).nextAll().text();
    const priceMatch = nextText.match(/R\$\s*([0-9]+(?:[\.,][0-9]{1,2})?)/);

    items.push({
      item: text,
      category: currentCategory,
      price: normalizePrice(priceMatch ? priceMatch[0] : ""),
      sourceUrl
    });
  });

  const dedup = new Map();
  items.forEach((it) => {
    const key = `${it.category}::${it.item}`.toLowerCase();
    if (!dedup.has(key)) {
      dedup.set(key, it);
    }
  });

  return Array.from(dedup.values()).filter((x) => x.item.length > 1);
}

module.exports = {
  parseMenuFromHtml
};
