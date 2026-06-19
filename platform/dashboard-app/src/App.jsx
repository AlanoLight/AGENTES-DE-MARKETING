import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import {
  bootstrapPaulinhos,
  captureTrends,
  collectLinks,
  generateCaption,
  generateImage,
  generateStrategy,
  getCompetitorComparison,
  getCompetitorIntelligence,
  getOverview,
  getSnapshots,
  getTemporalComparison,
  runRealMonitoring
} from "./api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function App() {
  const [companyId, setCompanyId] = useState(1);
  const [overview, setOverview] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [competitorIntel, setCompetitorIntel] = useState(null);
  const [snapshots, setSnapshots] = useState([]);
  const [temporalRows, setTemporalRows] = useState([]);
  const [status, setStatus] = useState("Pronto para carregar dados.");
  const [links, setLinks] = useState({
    ownMenuUrl: "",
    competitorUrls: ""
  });
  const [creative, setCreative] = useState({ campaign: "", audience: "", product: "", visualDirection: "" });
  const [caption, setCaption] = useState(null);
  const [imageResult, setImageResult] = useState(null);

  const comparisonData = useMemo(() => {
    if (!comparison?.comparison?.ok) {
      return null;
    }

    const rows = comparison.comparison.competitors || [];
    return {
      labels: rows.map((x) => x.sourceUrl.replace(/^https?:\/\//, "")),
      datasets: [
        {
          label: "Gap preco medio (meu - concorrente)",
          data: rows.map((x) => x.gapAvgPrice),
          backgroundColor: "rgba(255, 122, 26, 0.65)"
        },
        {
          label: "Gap total de itens (meu - concorrente)",
          data: rows.map((x) => x.gapItemCount),
          backgroundColor: "rgba(255, 209, 102, 0.65)"
        }
      ]
    };
  }, [comparison]);

  async function loadOverview() {
    setStatus("Carregando visao geral...");
    try {
      const data = await getOverview(companyId);
      setOverview(data);
      const s = await getSnapshots(companyId);
      setSnapshots(s.snapshots || []);
      const t = await getTemporalComparison(companyId);
      setTemporalRows(t.comparisons || []);
      const intel = await getCompetitorIntelligence(companyId);
      setCompetitorIntel(intel);
      setStatus("Visao geral atualizada.");
    } catch (error) {
      setStatus(`Falha no overview: ${error.message}`);
    }
  }

  async function runCollection() {
    setStatus("Executando coleta de mercado por links...");
    try {
      const competitorUrls = links.competitorUrls
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);

      await collectLinks({
        companyId,
        ownMenuUrl: links.ownMenuUrl,
        competitorUrls
      });

      const compare = await getCompetitorComparison(companyId);
      setComparison(compare);
      setStatus("Coleta e comparacao concluidas.");
    } catch (error) {
      setStatus(`Falha na coleta: ${error.message}`);
    }
  }

  async function runMonitoring() {
    setStatus("Executando monitoramento real (APIs + links + snapshots)...");
    try {
      const competitorUrls = links.competitorUrls
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean);

      await runRealMonitoring({
        companyId,
        companyName: "Paulinhos Burguer",
        ownMenuUrl: links.ownMenuUrl,
        competitorUrls
      });

      const compare = await getCompetitorComparison(companyId);
      setComparison(compare);
      await loadOverview();
      setStatus("Monitoramento real concluido.");
    } catch (error) {
      setStatus(`Falha no monitoramento: ${error.message}`);
    }
  }

  async function runBootstrapPaulinhos() {
    setStatus("Executando bootstrap automatico da Paulinhos...");
    try {
      const result = await bootstrapPaulinhos();
      setCompanyId(result.company.id);
      await loadOverview();
      setStatus("Bootstrap da Paulinhos concluido com sucesso.");
    } catch (error) {
      setStatus(`Falha no bootstrap: ${error.message}`);
    }
  }

  const temporalChart = useMemo(() => {
    if (!temporalRows.length) {
      return null;
    }

    const top = temporalRows.slice(0, 12);
    return {
      labels: top.map((x) => `${x.metric_name} #${x.id}`),
      datasets: [
        {
          label: "Delta absoluto",
          data: top.map((x) => x.delta_abs ?? 0),
          backgroundColor: "rgba(255, 77, 47, 0.7)"
        }
      ]
    };
  }, [temporalRows]);

  async function runTrends() {
    setStatus("Capturando tendencias...");
    try {
      await captureTrends(companyId);
      setStatus("Tendencias capturadas.");
      await loadOverview();
    } catch (error) {
      setStatus(`Falha nas tendencias: ${error.message}`);
    }
  }

  async function runStrategy() {
    setStatus("Gerando estrategia baseada em dados...");
    try {
      const result = await generateStrategy(companyId);
      setStatus(`Estrategia criada: campanha ${result.campaign.id}`);
      await loadOverview();
    } catch (error) {
      setStatus(`Falha na estrategia: ${error.message}`);
    }
  }

  async function runCaption() {
    setStatus("Gerando legendas...");
    try {
      const result = await generateCaption({
        campaignName: creative.campaign,
        audience: creative.audience,
        imageDescription: creative.visualDirection,
        product: creative.product
      });
      setCaption(result);
      setStatus("Legendas geradas.");
    } catch (error) {
      setStatus(`Falha na legenda: ${error.message}`);
    }
  }

  async function runImage(provider) {
    setStatus(`Gerando imagem no provider ${provider}...`);
    try {
      const result = await generateImage({
        companyId,
        provider,
        campaign: creative.campaign,
        audience: creative.audience,
        product: creative.product,
        visualDirection: creative.visualDirection,
        variations: 2
      });
      setImageResult(result);
      setStatus("Imagem solicitada com sucesso.");
    } catch (error) {
      setStatus(`Falha na imagem: ${error.message}`);
    }
  }

  return (
    <main className="app">
      <header className="hero">
        <h1>Centro de Inteligencia de Marketing</h1>
        <p>{status}</p>
      </header>

      <section className="card grid-2">
        <div>
          <label>ID da empresa</label>
          <input value={companyId} onChange={(e) => setCompanyId(Number(e.target.value) || 1)} />
        </div>
        <div className="button-line">
          <button onClick={loadOverview}>Atualizar KPIs</button>
          <button onClick={runTrends}>Capturar tendencias</button>
          <button onClick={runStrategy}>Gerar estrategia</button>
          <button onClick={runBootstrapPaulinhos}>Bootstrap Paulinhos</button>
        </div>
      </section>

      <section className="card">
        <h2>Visao geral</h2>
        <div className="kpis">
          <article><span>Campanhas</span><strong>{overview?.kpis?.campaigns ?? 0}</strong></article>
          <article><span>Ativas</span><strong>{overview?.kpis?.activeCampaigns ?? 0}</strong></article>
          <article><span>Tendencias</span><strong>{overview?.kpis?.trendsCaptured ?? 0}</strong></article>
          <article><span>Concorrentes</span><strong>{overview?.kpis?.competitors ?? 0}</strong></article>
          <article><span>Snapshots</span><strong>{overview?.kpis?.snapshots ?? 0}</strong></article>
          <article><span>Comparacoes temporais</span><strong>{overview?.kpis?.temporalComparisons ?? 0}</strong></article>
        </div>
      </section>

      <section className="card grid-2">
        <div>
          <h2>Coleta de concorrentes</h2>
          <label>Link do meu cardapio</label>
          <input
            value={links.ownMenuUrl}
            onChange={(e) => setLinks((s) => ({ ...s, ownMenuUrl: e.target.value }))}
            placeholder="https://..."
          />
          <label>Links de concorrentes (1 por linha)</label>
          <textarea
            rows={5}
            value={links.competitorUrls}
            onChange={(e) => setLinks((s) => ({ ...s, competitorUrls: e.target.value }))}
            placeholder="https://concorrente-1\nhttps://concorrente-2"
          />
          <button onClick={runCollection}>Coletar e comparar</button>
          <button onClick={runMonitoring}>Monitoramento real completo</button>
        </div>

        <div>
          <h2>Comparacao visual</h2>
          {comparisonData ? <Bar data={comparisonData} /> : <p>Sem comparacao ainda.</p>}
        </div>
      </section>

      <section className="card grid-2">
        <div>
          <h2>Historico de snapshots</h2>
          <p>Total carregado: {snapshots.length}</p>
          <div className="result-box">
            <pre>{JSON.stringify(snapshots.slice(0, 20), null, 2)}</pre>
          </div>
        </div>
        <div>
          <h2>Comparacao temporal</h2>
          {temporalChart ? <Bar data={temporalChart} /> : <p>Sem comparacao temporal ainda.</p>}
        </div>
      </section>

      <section className="card">
        <h2>Concorrentes</h2>
        <div className="kpis competitors-kpis">
          <article><span>Snapshots competitivos</span><strong>{competitorIntel?.totals?.snapshots ?? 0}</strong></article>
          <article><span>Insights de reviews</span><strong>{competitorIntel?.totals?.insights ?? 0}</strong></article>
          <article><span>Concorrentes no radar</span><strong>{competitorIntel?.totals?.competitors ?? 0}</strong></article>
          <article><span>Tendencias mapeadas</span><strong>{Object.keys(competitorIntel?.trends || {}).length}</strong></article>
        </div>

        <div className="grid-2">
          <div className="result-box">
            <h3>Ranking atual</h3>
            {(competitorIntel?.ranking || []).length ? (
              <ul className="plain-list">
                {competitorIntel.ranking.slice(0, 8).map((row) => (
                  <li key={`${row.competitor_name}-${row.id}`}>
                    <strong>{row.competitor_name}</strong>
                    <span> | Nota: {row.rating ?? "n/d"} | Reviews: {row.review_count ?? 0}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Sem ranking consolidado ainda.</p>
            )}
          </div>

          <div className="result-box">
            <h3>Avaliacoes e sentimento</h3>
            {(competitorIntel?.reviews || []).length ? (
              <ul className="plain-list">
                {competitorIntel.reviews.slice(0, 8).map((row, idx) => (
                  <li key={`${row.competitorName}-${idx}`}>
                    <strong>{row.competitorName}</strong>
                    <span> | Sentimento: {row.sentiment} | Reviews: {row.reviewCount}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Sem analise de reviews ainda.</p>
            )}
          </div>
        </div>

        <div className="grid-2">
          <div className="result-box">
            <h3>Crescimento e variacao</h3>
            <pre>{JSON.stringify((competitorIntel?.growth || []).slice(0, 20), null, 2)}</pre>
          </div>
          <div className="result-box">
            <h3>Oportunidades acionaveis</h3>
            {(competitorIntel?.opportunities || []).length ? (
              <ul className="plain-list">
                {competitorIntel.opportunities.slice(0, 10).map((o, idx) => (
                  <li key={`${o.competitorName}-${idx}`}>
                    <strong>{o.competitorName}</strong>
                    <span> | {o.tip}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhuma oportunidade consolidada.</p>
            )}
          </div>
        </div>
      </section>

      <section className="card">
        <h2>Criativos e conteudo</h2>
        <div className="grid-2">
          <div>
            <label>Campanha</label>
            <input value={creative.campaign} onChange={(e) => setCreative((s) => ({ ...s, campaign: e.target.value }))} />
            <label>Publico</label>
            <input value={creative.audience} onChange={(e) => setCreative((s) => ({ ...s, audience: e.target.value }))} />
            <label>Produto</label>
            <input value={creative.product} onChange={(e) => setCreative((s) => ({ ...s, product: e.target.value }))} />
            <label>Direcao visual</label>
            <textarea rows={4} value={creative.visualDirection} onChange={(e) => setCreative((s) => ({ ...s, visualDirection: e.target.value }))} />
            <div className="button-line">
              <button onClick={runCaption}>Gerar legendas</button>
              <button onClick={() => runImage("openai")}>Imagem OpenAI</button>
              <button onClick={() => runImage("leonardo")}>Imagem Leonardo</button>
              <button onClick={() => runImage("canva")}>Imagem Canva</button>
            </div>
          </div>

          <div className="result-box">
            <h3>Legenda</h3>
            {caption ? (
              <>
                <p><strong>Curta:</strong> {caption.short}</p>
                <p><strong>Media:</strong> {caption.medium}</p>
                <p><strong>Longa:</strong> {caption.long}</p>
                <p><strong>CTA:</strong> {caption.cta}</p>
                <p><strong>Hashtags:</strong> {(caption.hashtags || []).join(" ")}</p>
              </>
            ) : <p>Nenhuma legenda gerada.</p>}

            <h3>Imagem</h3>
            <pre>{imageResult ? JSON.stringify(imageResult, null, 2) : "Nenhum resultado de imagem."}</pre>
          </div>
        </div>
      </section>
    </main>
  );
}
