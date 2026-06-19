const brandContext = {
  salesLines: [
    "Giro rapido: xis, hot dog e bebidas",
    "Assinatura: Chefao, Chefes e combos premium",
    "Ticket maior: tabuas, porcoes e batatao",
    "Teste: burger da semana, combo tematico e sobremesa de campanha"
  ],
  angles: [
    "Fome imediata e decisao rapida",
    "Lanche carregado de verdade",
    "Combo com ganho percebido",
    "Tabua para dividir sem erro",
    "Oferta de abertura e ultima chamada"
  ],
  quickActions: [
    "Plano da semana",
    "Post de hoje",
    "Promocao de abertura",
    "Campanha de recompra",
    "Reorganizar iFood",
    "Lancar produto novo"
  ]
};

const agents = [
  {
    id: "food-growth-master",
    title: "Food Growth Master",
    category: "Orquestrador",
    description: "Coordena a operacao completa de growth para food service e consolida um plano unico por frente.",
    useCases: ["Planejamento da semana", "Diagnostico completo da operacao", "Priorizar agentes e campanhas"],
    outputs: ["Diagnostico executivo", "Sequencia de especialistas", "Plano consolidado", "Prioridades e metricas"],
    references: ["Mix entre giro, margem e recorrencia", "Produto foco + canal foco + oferta foco", "Usar Paulinhos como contexto default"],
    commands: ["monta minha semana com foco em combos e recompra", "quero um plano para vender mais tabuas no fim de semana"],
    promptFile: ".github/prompts/paulinhos-food-growth-master.prompt.md"
  },
  {
    id: "consultor-ifood",
    title: "Consultor iFood",
    category: "Canal",
    description: "Otimiza nomes, descricoes, categorias, vitrine e estrutura de upsell do app de pedidos.",
    useCases: ["Reorganizar cardapio", "Melhorar CTR e conversao", "Criar upsells"],
    outputs: ["Diagnostico da vitrine", "Novos nomes", "Novas descricoes", "Plano de categorias"],
    references: ["Descricoes curtas", "Nome apetitoso", "Combos puxando ticket"],
    commands: ["melhora meus nomes e descricoes do app", "organiza minhas categorias para vender mais combos"],
    promptFile: ".github/prompts/paulinhos-consultor-ifood.prompt.md"
  },
  {
    id: "engenheiro-cardapio",
    title: "Engenheiro de Cardapio",
    category: "Rentabilidade",
    description: "Classifica produtos por performance e orienta destaque, ajuste, teste ou corte do cardapio.",
    useCases: ["Aumentar ticket medio", "Enxugar cardapio", "Descobrir estrela e abacaxi"],
    outputs: ["Classificacao do mix", "Itens para promover", "Itens para ajustar", "Plano de menu engineering"],
    references: ["Entrada, assinatura e premium", "Nao inflar cardapio", "Promover alto apelo e boa margem"],
    commands: ["classifica meu cardapio e me diz o que destacar", "me diga o que pode estar me segurando na margem"],
    promptFile: ".github/prompts/paulinhos-engenheiro-cardapio.prompt.md"
  },
  {
    id: "whatsapp-delivery",
    title: "WhatsApp Delivery",
    category: "Recompra",
    description: "Cria campanhas de retorno, reativacao e fidelizacao para clientes do delivery.",
    useCases: ["Trazer cliente de volta", "Criar campanha de quinta", "Fazer retorno pos-venda"],
    outputs: ["Fluxo de mensagens", "Cadencia", "Gatilhos", "Indicadores"],
    references: ["Quinta a domingo", "Retorno em ate 7 dias", "Oferta curta e direta"],
    commands: ["cria campanha de WhatsApp para trazer cliente de volta", "quero sequencia de recompra para depois do pedido"],
    promptFile: ".github/prompts/paulinhos-whatsapp-delivery.prompt.md"
  },
  {
    id: "promocoes-food",
    title: "Promocoes Food",
    category: "Oferta",
    description: "Modela promocoes, combos e upsells com impacto comercial e cuidado de margem.",
    useCases: ["Promocao de abertura", "Combo de ticket maior", "Campanha sazonal"],
    outputs: ["Objetivo da promocao", "Ticket esperado", "Impacto esperado", "Justificativa"],
    references: ["Combo com bebida", "Upgrade de batata", "Ultima chamada 22h-23h"],
    commands: ["monta uma promocao que aumente ticket sem matar margem", "cria combo de quinta para girar burger e bebida"],
    promptFile: ".github/prompts/paulinhos-promocoes-food.prompt.md"
  },
  {
    id: "google-reviews",
    title: "Google Reviews",
    category: "Reputacao",
    description: "Analisa reputacao local, recorrencia de reclamacoes e melhorias operacionais.",
    useCases: ["Melhorar nota local", "Mapear reclamacoes", "Responder reviews"],
    outputs: ["Diagnostico de reputacao", "Problemas recorrentes", "Plano de acao"],
    references: ["Atendimento", "Atraso", "Temperatura e montagem"],
    commands: ["analisa o que precisa melhorar nas avaliacoes", "me diga quais problemas operacionais podem virar review ruim"],
    promptFile: ".github/prompts/paulinhos-google-reviews.prompt.md"
  },
  {
    id: "pesquisa-mercado",
    title: "Pesquisador de Mercado",
    category: "Pesquisa",
    description: "Levanta linguagem, concorrencia, desejos e oportunidades do mercado local.",
    useCases: ["Entender concorrencia", "Mapear desejo de sabor", "Encontrar espacos de mensagem"],
    outputs: ["Panorama do mercado", "Linguagem do cliente", "Oportunidades"],
    references: ["Mercado local", "Desejo visual", "Combos e oportunidade"],
    commands: ["mapeia como vender mais tabuas em Sombrio", "descobre angulos fortes para burger premium"],
    promptFile: ".github/prompts/paulinhos-pesquisa-mercado.prompt.md"
  },
  {
    id: "estrategista",
    title: "Estrategista de Marketing",
    category: "Estrategia",
    description: "Transforma objetivo comercial em foco de campanha, angulo e canal da semana.",
    useCases: ["Planejar a semana", "Definir angulo", "Escolher foco de produto"],
    outputs: ["Resumo estrategico", "Oferta e CTA", "Funil e canais"],
    references: ["Fome imediata", "Fartura", "Mix entre giro e margem"],
    commands: ["define a estrategia da semana para combos e burger premium", "me diga qual produto puxar hoje no Instagram"],
    promptFile: ".github/prompts/paulinhos-estrategista.prompt.md"
  },
  {
    id: "copywriter",
    title: "Copywriter de Conversao",
    category: "Copy",
    description: "Cria legendas, anuncios, CTAs e textos de venda com linguagem de fome e pedido imediato.",
    useCases: ["Legenda de post", "CTA curto", "Anuncio de oferta"],
    outputs: ["Copy principal", "Variacoes", "CTA"],
    references: ["Fome de verdade", "Lanche carregado", "Pede o teu agora"],
    commands: ["cria legenda e CTA para divulgar o Chefao hoje", "quero copy para tabua com foco em grupo"],
    promptFile: ".github/prompts/paulinhos-copywriter.prompt.md"
  },
  {
    id: "conteudista",
    title: "Conteudista Editorial",
    category: "Conteudo",
    description: "Monta pauta, calendario e formatos de conteudo alinhados aos picos de venda da operacao.",
    useCases: ["Calendario da semana", "Ideias de reels", "Story de oferta"],
    outputs: ["Pautas", "Calendario", "Formato por canal"],
    references: ["Reels de montagem", "Prova social", "Quinta a domingo"],
    commands: ["monta 7 ideias de conteudo para quinta a domingo", "cria linha editorial para burger, tabua e porcao"],
    promptFile: ".github/prompts/paulinhos-conteudista.prompt.md"
  },
  {
    id: "design-criativo",
    title: "Design Criativo",
    category: "Visual",
    description: "Traduz oferta e copy em conceito visual, prompt de imagem e direcao de arte para a marca.",
    useCases: ["Imagem de produto", "Reels de oferta", "Visual de campanha"],
    outputs: ["Conceito visual", "Prompt de imagem", "Direcao de arte"],
    references: ["Close no produto", "Luz quente", "Fundo escuro ou madeira"],
    commands: ["cria imagem do Xis Duplo para reels de abertura", "quero visual premium para tabua G"],
    promptFile: ".github/prompts/paulinhos-design-criativo.prompt.md"
  },
  {
    id: "midia-paga",
    title: "Especialista em Midia Paga",
    category: "Trafego",
    description: "Monta campanhas locais com foco em pedido, produto e oferta de curto prazo.",
    useCases: ["Campanha local", "Promocao paga", "Teste de anuncio"],
    outputs: ["Estrutura da campanha", "Publicos", "Variacoes", "Metricas"],
    references: ["Raio curto", "Produto + oferta", "Clique para pedido"],
    commands: ["monta campanha local para tabuas no fim de semana", "cria anuncio para burger premium com combo"],
    promptFile: ".github/prompts/paulinhos-midia-paga.prompt.md"
  },
  {
    id: "crm-funil",
    title: "CRM e Funil",
    category: "Relacionamento",
    description: "Cria follow-up, retorno e fluxo simples de relacionamento para manter recorrencia.",
    useCases: ["Pos-venda", "Cupom de retorno", "Lista VIP"],
    outputs: ["Fluxo", "Mensagens", "Gatilhos", "Indicadores"],
    references: ["Retorno simples", "Lista VIP", "Oferta curta"],
    commands: ["cria fluxo de pos-venda com cupom de retorno", "quero uma jornada curta para lista VIP"],
    promptFile: ".github/prompts/paulinhos-crm-funil.prompt.md"
  },
  {
    id: "analytics",
    title: "Analytics e Otimizacao",
    category: "Dados",
    description: "Analisa ticket, combos, clique no pedido e recorrencia para orientar o proximo ajuste.",
    useCases: ["Ler resultado de campanha", "Priorizar teste", "Descobrir gargalo"],
    outputs: ["Leitura executiva", "Gargalo", "Testes priorizados"],
    references: ["Ticket medio", "Combos", "Recorrencia 7 dias"],
    commands: ["analisa se a campanha de combo valeu a pena", "me diga o que testar na proxima semana"],
    promptFile: ".github/prompts/paulinhos-analytics.prompt.md"
  },
  {
    id: "seo-growth",
    title: "SEO Growth",
    category: "Organico",
    description: "Pensa busca local, conteudo organico e estrutura SEO quando a operacao quiser reforcar descoberta organica.",
    useCases: ["Busca local", "Conteudo organico", "Presenca no Google"],
    outputs: ["Clusters", "Pautas", "Oportunidade local"],
    references: ["Busca local", "Marca + cidade", "Conteudo de prova social"],
    commands: ["monta ideias de busca local para a marca", "quero conteudo organico para fortalecer nome e cidade"],
    promptFile: ".github/prompts/paulinhos-seo-growth.prompt.md"
  }
];

const analysisConfigs = {
  "pesquisa-mercado": {
    title: "Pesquisador de Mercado",
    neededFields: ["item", "segmento", "metric", "date"],
    metrics: ["volume_busca", "preco_medio", "share"],
    description: "Concorrencia por faixa de preco, share percebido e tracao de demanda local."
  },
  "consultor-ifood": {
    title: "Consultor iFood",
    neededFields: ["item", "categoria", "metric", "date"],
    metrics: ["ctr", "conversao", "ticket_medio"],
    description: "Comparativo de conversao do cardapio e desempenho por categoria."
  },
  "engenheiro-cardapio": {
    title: "Engenheiro de Cardapio",
    neededFields: ["item", "categoria", "metric", "date"],
    metrics: ["margem", "cmv", "ticket_medio"],
    description: "Performance real por item para decidir destaque, ajuste ou corte."
  },
  "google-reviews": {
    title: "Google Reviews",
    neededFields: ["item", "tema", "metric", "date"],
    metrics: ["nota_media", "reclamacoes", "tempo_resposta_h"],
    description: "Evolucao de reputacao, temas criticos e distancia para concorrentes."
  },
  analytics: {
    title: "Analytics e Otimizacao",
    neededFields: ["item", "canal", "metric", "date"],
    metrics: ["pedidos", "receita", "taxa_conversao"],
    description: "Comparacao de funil e impacto de campanhas em resultado real."
  },
  "seo-growth": {
    title: "SEO Growth",
    neededFields: ["item", "query", "metric", "date"],
    metrics: ["impressions", "clicks", "ctr"],
    description: "Busca local: visibilidade, clique e ganho de presenca organica."
  },
  "midia-paga": {
    title: "Especialista em Midia Paga",
    neededFields: ["item", "campanha", "metric", "date"],
    metrics: ["cpc", "cpa", "roas"],
    description: "Comparativo de eficiencia entre sua operacao e os referenciais competitivos."
  }
};

const elements = {
  quickActions: document.getElementById("quickActions"),
  agentTabs: document.getElementById("agentTabs"),
  totalAgents: document.getElementById("totalAgents"),
  agentTitle: document.getElementById("agentTitle"),
  agentCategory: document.getElementById("agentCategory"),
  agentDescription: document.getElementById("agentDescription"),
  agentUseCases: document.getElementById("agentUseCases"),
  agentOutputs: document.getElementById("agentOutputs"),
  agentReferences: document.getElementById("agentReferences"),
  agentCommands: document.getElementById("agentCommands"),
  salesLines: document.getElementById("salesLines"),
  angleList: document.getElementById("angleList"),
  goalInput: document.getElementById("goalInput"),
  productInput: document.getElementById("productInput"),
  formatInput: document.getElementById("formatInput"),
  offerInput: document.getElementById("offerInput"),
  channelInput: document.getElementById("channelInput"),
  contextInput: document.getElementById("contextInput"),
  instagramLinkInput: document.getElementById("instagramLinkInput"),
  facebookLinkInput: document.getElementById("facebookLinkInput"),
  ifoodLinkInput: document.getElementById("ifoodLinkInput"),
  anotaLinkInput: document.getElementById("anotaLinkInput"),
  deliveryLinkInput: document.getElementById("deliveryLinkInput"),
  promptOutput: document.getElementById("promptOutput"),
  fillExampleButton: document.getElementById("fillExampleButton"),
  generateButton: document.getElementById("generateButton"),
  copyButton: document.getElementById("copyButton"),
  clearButton: document.getElementById("clearButton"),
  analysisAgentSelect: document.getElementById("analysisAgentSelect"),
  metricFieldSelect: document.getElementById("metricFieldSelect"),
  chartTypeSelect: document.getElementById("chartTypeSelect"),
  methodSelect: document.getElementById("methodSelect"),
  myDataFile: document.getElementById("myDataFile"),
  competitorDataFile: document.getElementById("competitorDataFile"),
  myDataLink: document.getElementById("myDataLink"),
  competitorDataLink: document.getElementById("competitorDataLink"),
  linkStatusBox: document.getElementById("linkStatusBox"),
  neededFields: document.getElementById("neededFields"),
  renderDashboardButton: document.getElementById("renderDashboardButton"),
  loadFromLinksButton: document.getElementById("loadFromLinksButton"),
  downloadTemplateButton: document.getElementById("downloadTemplateButton"),
  kpiGrid: document.getElementById("kpiGrid"),
  analysisInsights: document.getElementById("analysisInsights"),
  analysisChartCanvas: document.getElementById("analysisChart")
};

let selectedAgent = agents[0];
let myRecords = [];
let competitorRecords = [];
let analysisChartInstance = null;

function renderQuickActions() {
  elements.quickActions.innerHTML = "";
  brandContext.quickActions.forEach((action) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quick-chip";
    button.textContent = action;
    button.addEventListener("click", () => {
      elements.goalInput.value = action;
      generatePrompt();
    });
    elements.quickActions.appendChild(button);
  });
}

function renderAgentNav() {
  elements.agentTabs.innerHTML = "";
  agents.forEach((agent) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `agent-tab${agent.id === selectedAgent.id ? " is-active" : ""}`;
    button.innerHTML = `<strong>${agent.title}</strong><span>${agent.category}</span>`;
    button.addEventListener("click", () => {
      selectedAgent = agent;
      renderSelectedAgent();
      renderAgentNav();
      generatePrompt();
    });
    elements.agentTabs.appendChild(button);
  });
}

function fillList(target, items) {
  target.innerHTML = "";
  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    target.appendChild(li);
  });
}

function fillChips(target, items, clickable = false) {
  target.innerHTML = "";
  items.forEach((item) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = `chip${clickable ? " is-clickable" : ""}`;
    chip.textContent = item;
    if (clickable) {
      chip.addEventListener("click", () => {
        elements.goalInput.value = item;
        generatePrompt();
      });
    } else {
      chip.disabled = true;
    }
    target.appendChild(chip);
  });
}

function renderSelectedAgent() {
  elements.agentTitle.textContent = selectedAgent.title;
  elements.agentCategory.textContent = selectedAgent.category;
  elements.agentDescription.textContent = selectedAgent.description;
  fillList(elements.agentUseCases, selectedAgent.useCases);
  fillList(elements.agentOutputs, selectedAgent.outputs);
  fillChips(elements.agentReferences, selectedAgent.references, false);
  fillChips(elements.agentCommands, selectedAgent.commands, true);
}

function renderBrandContext() {
  fillList(elements.salesLines, brandContext.salesLines);
  fillList(elements.angleList, brandContext.angles);
  elements.totalAgents.textContent = String(agents.length);
}

function buildPrompt() {
  const goal = elements.goalInput.value.trim() || "Definir a proxima acao comercial da operacao";
  const product = elements.productInput.value.trim() || "produto ainda nao definido";
  const format = elements.formatInput.value;
  const offer = elements.offerInput.value.trim() || "sem oferta explicita ate aqui";
  const channel = elements.channelInput.value;
  const extra = elements.contextInput.value.trim() || "usar referencias prontas da Paulinhos Burguer, preservar o estilo visual e manter foco em conversao local.";
  const instagram = elements.instagramLinkInput.value.trim() || "nao informado";
  const facebook = elements.facebookLinkInput.value.trim() || "nao informado";
  const ifood = elements.ifoodLinkInput.value.trim() || "nao informado";
  const anota = elements.anotaLinkInput.value.trim() || "nao informado";
  const delivery = elements.deliveryLinkInput.value.trim() || "nao informado";

  return [
    `Agente alvo: ${selectedAgent.title}`,
    "",
    "Contexto fixo da marca:",
    "- Marca: Paulinhos Burguer",
    "- Cidade: Sombrio-SC",
    "- Nicho: hamburgueria, xis, tabuas, porcoes e delivery",
    "- Horario: 18:30 as 23:00, fechado na terca",
    "- Canais principais: Instagram, link de pedido e WhatsApp",
    "- Objetivo continuo: vender o cardapio inteiro e manter espaco para novos produtos",
    "",
    "Rodada atual:",
    `- Objetivo: ${goal}`,
    `- Produto foco: ${product}`,
    `- Formato: ${format}`,
    `- Canal: ${channel}`,
    `- Oferta: ${offer}`,
    `- Contexto extra: ${extra}`,
    "",
    "Links oficiais da operacao:",
    `- Instagram: ${instagram}`,
    `- Facebook: ${facebook}`,
    `- iFood: ${ifood}`,
    `- Anota AI: ${anota}`,
    `- Delivery principal: ${delivery}`,
    "",
    "Diretrizes de evidencia real:",
    "- Usar dados fornecidos e citar base, periodo e amostra",
    "- Comparar Minha Operacao x Concorrencia com metrica numerica",
    "- Se faltar dado, devolver checklist do que precisa",
    "",
    "Diretrizes prontas:",
    `- Referencias do agente: ${selectedAgent.references.join("; ")}`,
    "- Linguagem: fome, fartura, apelo visual, CTA curto e senso de oportunidade",
    "- Visual: close no produto, luz quente, textura destacada, identidade premium do alimento",
    "",
    "Entrega esperada:",
    ...selectedAgent.outputs.map((output) => `- ${output}`),
    "",
    `Arquivo de apoio sugerido: ${selectedAgent.promptFile}`
  ].join("\n");
}

function generatePrompt() {
  elements.promptOutput.value = buildPrompt();
}

function fillExample() {
  elements.goalInput.value = "Criar uma peca forte para puxar pedidos hoje a noite";
  elements.productInput.value = "Xis burguer duplo";
  elements.formatInput.value = "Reels";
  elements.offerInput.value = "combo com batata e mini refri";
  elements.channelInput.value = "Instagram";
  elements.contextInput.value = "usar linguagem de oportunidade, destacar queijo, carne e apelo de fome; manter CTA direto para pedido imediato.";
  elements.instagramLinkInput.value = "https://www.instagram.com/paulinhosburgueroficial/";
  elements.facebookLinkInput.value = "";
  elements.ifoodLinkInput.value = "";
  elements.anotaLinkInput.value = "https://pedido.anota.ai/loja/paulinhos-burguer-4?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGn794V0cKLUjYGihvQ4Mw1gJsmjEe3g5qqQb9HJHsD2Zm8Z-g21cDR-nfEFkQ_aem_h3gaj4cCzxb0YjHZ3RjChw&utm_id=97760_v0_s00_e0_tv3";
  elements.deliveryLinkInput.value = "https://pedido.anota.ai/loja/paulinhos-burguer-4?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGn794V0cKLUjYGihvQ4Mw1gJsmjEe3g5qqQb9HJHsD2Zm8Z-g21cDR-nfEFkQ_aem_h3gaj4cCzxb0YjHZ3RjChw&utm_id=97760_v0_s00_e0_tv3";
  elements.myDataLink.value = "https://pedido.anota.ai/loja/paulinhos-burguer-4?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQPOTM2NjE5NzQzMzkyNDU5AAGn794V0cKLUjYGihvQ4Mw1gJsmjEe3g5qqQb9HJHsD2Zm8Z-g21cDR-nfEFkQ_aem_h3gaj4cCzxb0YjHZ3RjChw&utm_id=97760_v0_s00_e0_tv3";
  elements.competitorDataLink.value = "https://maisdeliveryapp.com.br/pwa/shop/detail/list/product/subcategorie/MjU1ODQ=";
  setLinkStatus("Links da sua operacao e do concorrente aplicados no exemplo. Clique em Carregar por links para comparar.");
  generatePrompt();
}

function clearForm() {
  elements.goalInput.value = "";
  elements.productInput.value = "";
  elements.formatInput.selectedIndex = 0;
  elements.offerInput.value = "";
  elements.channelInput.selectedIndex = 0;
  elements.contextInput.value = "";
  elements.instagramLinkInput.value = "";
  elements.facebookLinkInput.value = "";
  elements.ifoodLinkInput.value = "";
  elements.anotaLinkInput.value = "";
  elements.deliveryLinkInput.value = "";
  generatePrompt();
}

async function copyPrompt() {
  if (!elements.promptOutput.value) {
    generatePrompt();
  }

  try {
    await navigator.clipboard.writeText(elements.promptOutput.value);
    elements.copyButton.textContent = "Prompt copiado";
    setTimeout(() => {
      elements.copyButton.textContent = "Copiar prompt";
    }, 1800);
  } catch (error) {
    elements.copyButton.textContent = "Copie manualmente";
    setTimeout(() => {
      elements.copyButton.textContent = "Copiar prompt";
    }, 1800);
  }
}

function parseCsv(text) {
  const rows = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (rows.length < 2) {
    return [];
  }
  const headers = rows[0].split(",").map((h) => h.trim());
  return rows.slice(1).map((row) => {
    const cols = row.split(",").map((c) => c.trim());
    const rec = {};
    headers.forEach((header, index) => {
      rec[header] = cols[index] ?? "";
    });
    return rec;
  });
}

function parseJson(text) {
  const parsed = JSON.parse(text);
  if (Array.isArray(parsed)) {
    return parsed;
  }
  if (Array.isArray(parsed.data)) {
    return parsed.data;
  }
  return [];
}

function toNumber(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : NaN;
  }
  if (typeof value !== "string") {
    return NaN;
  }
  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  const num = Number(normalized);
  return Number.isFinite(num) ? num : NaN;
}

function aggregateByItem(records, metricField, method) {
  const map = new Map();

  records.forEach((row) => {
    const item = String(row.item ?? row.produto ?? row.keyword ?? row.tema ?? row.categoria ?? "sem-item").trim();
    const value = toNumber(row[metricField]);

    if (!item || Number.isNaN(value)) {
      return;
    }

    if (!map.has(item)) {
      map.set(item, { sum: 0, count: 0 });
    }

    const cell = map.get(item);
    cell.sum += value;
    cell.count += 1;
  });

  const output = new Map();
  map.forEach((value, key) => {
    const computed = method === "sum" ? value.sum : value.sum / value.count;
    output.set(key, Number(computed.toFixed(2)));
  });

  return output;
}

function sortedLabels(myAgg, competitorAgg) {
  const all = new Set([...myAgg.keys(), ...competitorAgg.keys()]);
  return Array.from(all).sort((a, b) => a.localeCompare(b, "pt-BR"));
}

function metricsKpi(myValues, competitorValues) {
  const myTotal = myValues.reduce((acc, value) => acc + value, 0);
  const competitorTotal = competitorValues.reduce((acc, value) => acc + value, 0);
  const delta = competitorTotal === 0 ? 0 : ((myTotal - competitorTotal) / competitorTotal) * 100;

  return {
    myTotal: Number(myTotal.toFixed(2)),
    competitorTotal: Number(competitorTotal.toFixed(2)),
    gapPercent: Number(delta.toFixed(2)),
    itemCount: myValues.length
  };
}

function updateKpis(kpis) {
  elements.kpiGrid.innerHTML = "";
  const cards = [
    { label: "Meu total", value: kpis.myTotal },
    { label: "Concorrencia total", value: kpis.competitorTotal },
    { label: "Gap (%)", value: `${kpis.gapPercent}%` },
    { label: "Itens comparados", value: kpis.itemCount }
  ];

  cards.forEach((card) => {
    const article = document.createElement("article");
    article.className = "kpi-card";
    article.innerHTML = `<span>${card.label}</span><strong>${card.value}</strong>`;
    elements.kpiGrid.appendChild(article);
  });
}

function updateInsights(labels, myData, competitorData, metricField, config) {
  elements.analysisInsights.innerHTML = "";

  if (!labels.length) {
    const li = document.createElement("li");
    li.textContent = "Sem dados suficientes para gerar leitura automatica.";
    elements.analysisInsights.appendChild(li);
    return;
  }

  const rows = labels.map((label, index) => ({
    label,
    my: myData[index] ?? 0,
    competitor: competitorData[index] ?? 0,
    delta: (myData[index] ?? 0) - (competitorData[index] ?? 0)
  }));

  const best = [...rows].sort((a, b) => b.delta - a.delta)[0];
  const worst = [...rows].sort((a, b) => a.delta - b.delta)[0];

  const insights = [
    `${config.title}: metrica ${metricField} comparada com concorrencia em ${rows.length} itens.`,
    `Maior vantagem: ${best.label} (${best.delta.toFixed(2)} acima da concorrencia).`,
    `Maior risco: ${worst.label} (${Math.abs(worst.delta).toFixed(2)} abaixo da concorrencia).`,
    "Acao: priorize 1 teste no item de maior risco e mantenha investimento no item de maior vantagem."
  ];

  insights.forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    elements.analysisInsights.appendChild(li);
  });
}

function drawChart(labels, myData, competitorData, chartType, metricField) {
  const ChartRef = window.Chart;
  if (!ChartRef) {
    return;
  }

  if (analysisChartInstance) {
    analysisChartInstance.destroy();
  }

  analysisChartInstance = new ChartRef(elements.analysisChartCanvas, {
    type: chartType,
    data: {
      labels,
      datasets: [
        {
          label: `Meu cardapio (${metricField})`,
          data: myData,
          borderColor: "#ff7a1a",
          backgroundColor: "rgba(255, 122, 26, 0.35)",
          tension: 0.25,
          borderWidth: 2
        },
        {
          label: `Concorrencia (${metricField})`,
          data: competitorData,
          borderColor: "#ffd166",
          backgroundColor: "rgba(255, 209, 102, 0.25)",
          tension: 0.25,
          borderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: chartType === "radar" ? {} : {
        x: {
          ticks: { color: "#d8dddc" },
          grid: { color: "rgba(255,255,255,0.08)" }
        },
        y: {
          ticks: { color: "#d8dddc" },
          grid: { color: "rgba(255,255,255,0.08)" }
        }
      },
      plugins: {
        legend: {
          labels: { color: "#f2f4f3" }
        }
      }
    }
  });
}

function populateAnalysisAgents() {
  elements.analysisAgentSelect.innerHTML = "";
  Object.entries(analysisConfigs).forEach(([id, config]) => {
    const option = document.createElement("option");
    option.value = id;
    option.textContent = config.title;
    elements.analysisAgentSelect.appendChild(option);
  });
  renderAnalysisNeeds();
}

function populateMetricOptions() {
  const config = analysisConfigs[elements.analysisAgentSelect.value];
  elements.metricFieldSelect.innerHTML = "";
  config.metrics.forEach((metric) => {
    const option = document.createElement("option");
    option.value = metric;
    option.textContent = metric;
    elements.metricFieldSelect.appendChild(option);
  });
}

function renderAnalysisNeeds() {
  const config = analysisConfigs[elements.analysisAgentSelect.value];
  if (!config) {
    return;
  }
  populateMetricOptions();
  elements.neededFields.innerHTML = [
    `Agente: ${config.title}`,
    `Painel: ${config.description}`,
    `Campos minimos: ${config.neededFields.join(", ")}`,
    `Metricas sugeridas: ${config.metrics.join(", ")}`,
    "Observacao: se faltar algum campo, me avise no chat que eu ajusto o parser."
  ].join("<br>");
}

async function readDataFile(file) {
  if (!file) {
    return [];
  }
  const text = await file.text();
  const lower = file.name.toLowerCase();

  try {
    if (lower.endsWith(".json")) {
      return parseJson(text);
    }
    return parseCsv(text);
  } catch (error) {
    return [];
  }
}

function setLinkStatus(message) {
  elements.linkStatusBox.innerHTML = message;
}

async function readDataFromLink(url) {
  const trimmed = String(url || "").trim();
  if (!trimmed) {
    return [];
  }

  const response = await fetch(trimmed);
  if (!response.ok) {
    throw new Error(`Falha ao carregar link (${response.status})`);
  }

  const text = await response.text();
  const lower = trimmed.toLowerCase();

  if (lower.includes(".json") || response.headers.get("content-type")?.includes("application/json")) {
    return parseJson(text);
  }

  return parseCsv(text);
}

async function loadDataFromLinks() {
  const myUrl = elements.myDataLink.value.trim();
  const competitorUrl = elements.competitorDataLink.value.trim();

  if (!myUrl || !competitorUrl) {
    setLinkStatus("Informe os dois links de dados para carregar o dashboard comparativo.");
    return;
  }

  setLinkStatus("Carregando links...");

  try {
    myRecords = await readDataFromLink(myUrl);
    competitorRecords = await readDataFromLink(competitorUrl);

    setLinkStatus(
      `Coleta concluida. Meu dataset: ${myRecords.length} linhas | Concorrencia: ${competitorRecords.length} linhas.`
    );

    renderRealDashboard();
  } catch (error) {
    setLinkStatus(
      "Nao foi possivel ler um dos links diretamente (CORS, login ou bloqueio da plataforma). " +
      "Alternativa: abrir o link, exportar CSV/JSON ou copiar os dados e me enviar que eu adapto para voce."
    );
  }
}

async function handleMyFileChange(event) {
  myRecords = await readDataFile(event.target.files[0]);
}

async function handleCompetitorFileChange(event) {
  competitorRecords = await readDataFile(event.target.files[0]);
}

function generateTemplateCsv() {
  const config = analysisConfigs[elements.analysisAgentSelect.value];
  const metric = elements.metricFieldSelect.value || "metric";
  const header = ["item", "categoria", metric, "date"].join(",");
  const row1 = ["Xis Duplo", "burger", "12.5", "2026-06-19"].join(",");
  const row2 = ["Tabua G", "tabua", "9.8", "2026-06-19"].join(",");
  const row3 = ["Combo Chefao", "combo", "14.2", "2026-06-19"].join(",");
  const content = [
    `# Template para ${config.title}`,
    header,
    row1,
    row2,
    row3
  ].join("\n");

  const blob = new Blob([content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `template-${config.title.toLowerCase().replace(/\s+/g, "-")}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

function renderRealDashboard() {
  const config = analysisConfigs[elements.analysisAgentSelect.value];
  const metricField = elements.metricFieldSelect.value;

  if (!myRecords.length || !competitorRecords.length) {
    updateInsights([], [], [], metricField, config);
    elements.kpiGrid.innerHTML = "";
    if (analysisChartInstance) {
      analysisChartInstance.destroy();
      analysisChartInstance = null;
    }
    const li = document.createElement("li");
    li.textContent = "Envie dois arquivos reais (seu + concorrencia) para gerar o comparativo.";
    elements.analysisInsights.appendChild(li);
    return;
  }

  const method = elements.methodSelect.value;
  const myAgg = aggregateByItem(myRecords, metricField, method);
  const competitorAgg = aggregateByItem(competitorRecords, metricField, method);
  const labels = sortedLabels(myAgg, competitorAgg);

  const myData = labels.map((label) => myAgg.get(label) ?? 0);
  const competitorData = labels.map((label) => competitorAgg.get(label) ?? 0);

  const kpis = metricsKpi(myData, competitorData);
  updateKpis(kpis);
  updateInsights(labels, myData, competitorData, metricField, config);
  drawChart(labels, myData, competitorData, elements.chartTypeSelect.value, metricField);
}

elements.fillExampleButton.addEventListener("click", fillExample);
elements.generateButton.addEventListener("click", generatePrompt);
elements.copyButton.addEventListener("click", copyPrompt);
elements.clearButton.addEventListener("click", clearForm);

elements.analysisAgentSelect.addEventListener("change", renderAnalysisNeeds);
elements.renderDashboardButton.addEventListener("click", renderRealDashboard);
elements.loadFromLinksButton.addEventListener("click", loadDataFromLinks);
elements.downloadTemplateButton.addEventListener("click", generateTemplateCsv);
elements.myDataFile.addEventListener("change", handleMyFileChange);
elements.competitorDataFile.addEventListener("change", handleCompetitorFileChange);
[elements.chartTypeSelect, elements.methodSelect, elements.metricFieldSelect].forEach((field) => {
  field.addEventListener("change", renderRealDashboard);
});

[elements.goalInput, elements.productInput, elements.formatInput, elements.offerInput, elements.channelInput, elements.contextInput, elements.instagramLinkInput, elements.facebookLinkInput, elements.ifoodLinkInput, elements.anotaLinkInput, elements.deliveryLinkInput].forEach((field) => {
  field.addEventListener("input", generatePrompt);
  field.addEventListener("change", generatePrompt);
});

renderQuickActions();
renderAgentNav();
renderSelectedAgent();
renderBrandContext();
populateAnalysisAgents();
setLinkStatus("Aguardando links para coleta.");
fillExample();