require("./db/runMigrations");
const repo = require("./db/repository");
const { runCompetitorMonitoring } = require("./modules/collection/competitorMonitor");

async function bootstrapPaulinhos() {
  let company = repo.list("companies", "WHERE name = ? LIMIT 1", ["Paulinhos Burguer"])[0];

  if (!company) {
    company = repo.insert("companies", {
      name: "Paulinhos Burguer",
      city: "Sombrio",
      state: "SC",
      niche: "food_service_delivery",
      instagram_url: "https://www.instagram.com/paulinhosburgueroficial/",
      facebook_url: "",
      ifood_url: "",
      anota_url: "https://pedido.anota.ai/loja/paulinhos-burguer-4?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGn794V0cKLUjYGihvQ4Mw1gJsmjEe3g5qqQb9HJHsD2Zm8Z-g21cDR-nfEFkQ_aem_h3gaj4cCzxb0YjHZ3RjChw&utm_id=97760_v0_s00_e0_tv3",
      delivery_url: "https://pedido.anota.ai/loja/paulinhos-burguer-4?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGn794V0cKLUjYGihvQ4Mw1gJsmjEe3g5qqQb9HJHsD2Zm8Z-g21cDR-nfEFkQ_aem_h3gaj4cCzxb0YjHZ3RjChw&utm_id=97760_v0_s00_e0_tv3"
    });
  }

  const result = await runCompetitorMonitoring({
    companyId: company.id,
    companyName: company.name,
    ownMenuUrl: company.delivery_url,
    competitorUrls: ["https://maisdeliveryapp.com.br/pwa/shop/detail/list/product/subcategorie/MjU1ODQ="]
  });

  console.log(JSON.stringify({ company, result }, null, 2));
}

bootstrapPaulinhos().catch((error) => {
  console.error(error);
  process.exit(1);
});
