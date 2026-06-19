const repo = require("./db/repository");
const { runCompetitorMonitoring } = require("./modules/collection/competitorMonitor");

const DEFAULT_INPUT = {
  companyName: "Paulinhos Burguer",
  city: "Sombrio",
  state: "SC",
  instagramUrl: "https://www.instagram.com/paulinhosburgueroficial/",
  siteUrl: "",
  menuUrl:
    "https://pedido.anota.ai/loja/paulinhos-burguer-4?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGn794V0cKLUjYGihvQ4Mw1gJsmjEe3g5qqQb9HJHsD2Zm8Z-g21cDR-nfEFkQ_aem_h3gaj4cCzxb0YjHZ3RjChw&utm_id=97760_v0_s00_e0_tv3",
  googleMapsUrl: "https://maps.google.com/?q=Paulinhos+Burguer+Sombrio",
  competitorUrls: ["https://maisdeliveryapp.com.br/pwa/shop/detail/list/product/subcategorie/MjU1ODQ="],
  competitorNames: ["Concorrente Mais Delivery"],
  competitorMapLinks: ["https://maps.google.com/?q=hamburgueria+sombrio"]
};

function ensureCompetitorSeed(companyId, name, sourceUrl) {
  const existing = repo
    .list("competitors", "WHERE company_id = ? AND name = ? ORDER BY id DESC LIMIT 1", [companyId, name])[0];

  if (existing) {
    return existing;
  }

  return repo.insert("competitors", {
    company_id: companyId,
    name,
    source_url: sourceUrl,
    rating: null,
    social_links: JSON.stringify([]),
    diferencials: JSON.stringify(["seed_phase2"])
  });
}

function seedCompanyIntelligence(company) {
  const hasBootstrapAnalysis = repo.list(
    "market_analysis",
    "WHERE company_id = ? AND analysis_type = ? LIMIT 1",
    [company.id, "phase2_bootstrap"]
  )[0];

  if (hasBootstrapAnalysis) {
    return;
  }

  const summary = `Bootstrap Fase 2 para ${company.name}: canais, concorrentes e oportunidades iniciais consolidadas.`;
  repo.insert("market_analysis", {
    company_id: company.id,
    analysis_type: "phase2_bootstrap",
    source_url: "manual_bootstrap",
    summary,
    raw_data: JSON.stringify({
      channels: {
        instagram: company.instagram_url,
        site: company.delivery_url,
        menu: company.anota_url,
        maps: company.ifood_url
      }
    }),
    confidence: 0.83
  });

  repo.insert("strategies", {
    company_id: company.id,
    title: "Defesa de share local em horarios de pico",
    summary:
      "Priorizar combos de maior margem no almoco e jantar, com criativos focados em entrega rapida e prova social local.",
    source: "phase2_bootstrap"
  });

  repo.insert("strategies", {
    company_id: company.id,
    title: "Aquisicao por raio geolocalizado",
    summary:
      "Executar campanhas por bairros com maior densidade de pedidos e comunicar tempo medio real de entrega.",
    source: "phase2_bootstrap"
  });

  repo.insert("content_ideas", {
    company_id: company.id,
    title: "Bastidores da montagem em 30 segundos",
    description: "Reels mostrando velocidade de preparo e padrao de qualidade.",
    source: "phase2_bootstrap"
  });

  repo.insert("content_ideas", {
    company_id: company.id,
    title: "Duelo de combos mais pedidos",
    description: "Comparativo visual entre dois combos com CTA para pedido imediato.",
    source: "phase2_bootstrap"
  });
}

async function bootstrapPaulinhos(input = {}) {
  const settings = { ...DEFAULT_INPUT, ...input };
  let company = repo.list("companies", "WHERE name = ? LIMIT 1", [settings.companyName])[0];

  if (!company) {
    company = repo.insert("companies", {
      name: settings.companyName,
      city: settings.city,
      state: settings.state,
      niche: "food_service_delivery",
      instagram_url: settings.instagramUrl,
      facebook_url: "",
      ifood_url: settings.googleMapsUrl,
      anota_url: settings.menuUrl,
      delivery_url: settings.siteUrl || settings.menuUrl
    });
  }

  settings.competitorNames.forEach((name, index) => {
    const fallback = settings.competitorUrls[index] || settings.competitorMapLinks[index] || "manual_seed";
    ensureCompetitorSeed(company.id, name, fallback);
  });

  seedCompanyIntelligence(company);

  const result = await runCompetitorMonitoring({
    companyId: company.id,
    companyName: company.name,
    ownMenuUrl: settings.menuUrl,
    competitorUrls: settings.competitorUrls
  });

  return { company, result };
}

if (require.main === module) {
  require("./db/runMigrations");
  bootstrapPaulinhos()
    .then((output) => {
      console.log(JSON.stringify(output, null, 2));
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = {
  bootstrapPaulinhos
};
