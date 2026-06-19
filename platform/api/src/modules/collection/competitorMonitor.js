const repo = require("../../db/repository");
const { runMarketCollection } = require("./marketIntelligenceEngine");
const googlePlaces = require("./googlePlacesClient");
const instagram = require("./instagramBusinessClient");
const adLibrary = require("./metaAdLibraryClient");
const { buildTemporalComparisons } = require("./temporalComparison");
const { analyzeReviews } = require("../intelligence/reviewAnalyzer");

function nowIso() {
  return new Date().toISOString();
}

function insertSnapshot({ companyId, competitorId = null, snapshotType, source, sourceRef = null, metrics, raw }) {
  return repo.insert("data_snapshots", {
    company_id: companyId,
    competitor_id: competitorId,
    snapshot_type: snapshotType,
    source,
    source_ref: sourceRef,
    metrics_json: JSON.stringify(metrics || {}),
    raw_json: JSON.stringify(raw || {}),
    snapshot_at: nowIso()
  });
}

function upsertCompetitorSnapshot({
  companyId,
  competitorName,
  source,
  rating = null,
  reviewCount = 0,
  website = null,
  rawData = null
}) {
  return repo.insert("competitor_snapshots", {
    company_id: companyId,
    competitor_name: competitorName,
    source,
    rating,
    review_count: reviewCount,
    website,
    captured_at: nowIso(),
    raw_data: JSON.stringify(rawData || {})
  });
}

function getOrCreateCompetitor(companyId, sourceUrl) {
  const existing = repo.list(
    "competitors",
    "WHERE company_id = ? AND source_url = ? ORDER BY id DESC LIMIT 1",
    [companyId, sourceUrl]
  )[0];

  if (existing) {
    return existing;
  }

  return repo.insert("competitors", {
    company_id: companyId,
    name: new URL(sourceUrl).hostname,
    source_url: sourceUrl,
    rating: null,
    social_links: JSON.stringify([]),
    diferencials: JSON.stringify([])
  });
}

function persistGoogleReviews(companyId, competitorId, details) {
  const reviews = details?.reviews || [];
  reviews.forEach((r) => {
    repo.insert("reviews", {
      company_id: companyId,
      competitor_id: competitorId,
      source: "google_places",
      reviewer_name: r.author_name || null,
      rating: r.rating || null,
      review_text: r.text || null,
      review_date: r.relative_time_description || null
    });
  });
}

async function runCompetitorMonitoring({ companyId, ownMenuUrl, competitorUrls = [], companyName }) {
  repo.insert("external_collection_runs", {
    company_id: companyId,
    run_type: "monitoring",
    status: "started",
    details: "Iniciando monitoramento completo"
  });

  const collection = await runMarketCollection({ companyId, ownMenuUrl, competitorUrls });

  insertSnapshot({
    companyId,
    snapshotType: "menu",
    source: "link_menu_own",
    sourceRef: ownMenuUrl,
    metrics: collection.own.summary,
    raw: collection.own
  });

  upsertCompetitorSnapshot({
    companyId,
    competitorName: companyName || "operacao_propria",
    source: "own_menu_collection",
    rating: null,
    reviewCount: 0,
    website: ownMenuUrl,
    rawData: collection.own
  });

  for (const competitor of collection.competitors) {
    const comp = getOrCreateCompetitor(companyId, competitor.competitorUrl);
    insertSnapshot({
      companyId,
      competitorId: comp.id,
      snapshotType: "menu",
      source: "link_menu_competitor",
      sourceRef: competitor.competitorUrl,
      metrics: competitor.summary,
      raw: competitor
    });

    upsertCompetitorSnapshot({
      companyId,
      competitorName: comp.name,
      source: "competitor_menu_collection",
      rating: comp.rating || null,
      reviewCount: 0,
      website: competitor.competitorUrl,
      rawData: competitor
    });
  }

  const googleQuery = companyName || "restaurante delivery";
  let googleSummary = { configured: false };
  if (googlePlaces.isConfigured()) {
    googleSummary = await googlePlaces.textSearch(googleQuery);
    for (const place of googleSummary.places.slice(0, 6)) {
      const comp = getOrCreateCompetitor(companyId, place.placeId ? `google-place:${place.placeId}` : place.formattedAddress || place.name);
      repo.update("competitors", comp.id, {
        name: place.name,
        rating: place.rating,
        source_url: comp.source_url,
        social_links: JSON.stringify([]),
        diferencials: JSON.stringify([])
      });

      insertSnapshot({
        companyId,
        competitorId: comp.id,
        snapshotType: "google_place",
        source: "google_places_api",
        sourceRef: place.placeId,
        metrics: {
          rating: place.rating || null,
          reviewCount: place.userRatingsTotal || 0
        },
        raw: place
      });

      upsertCompetitorSnapshot({
        companyId,
        competitorName: place.name,
        source: "google_places_collection",
        rating: place.rating || null,
        reviewCount: place.userRatingsTotal || 0,
        website: place.formattedAddress || null,
        rawData: place
      });

      if (place.placeId) {
        const detailsResult = await googlePlaces.placeDetails(place.placeId);
        if (detailsResult.details) {
          persistGoogleReviews(companyId, comp.id, detailsResult.details);
          insertSnapshot({
            companyId,
            competitorId: comp.id,
            snapshotType: "google_reviews",
            source: "google_places_details_api",
            sourceRef: place.placeId,
            metrics: {
              rating: detailsResult.details.rating || null,
              reviewCount: detailsResult.details.user_ratings_total || 0
            },
            raw: detailsResult.details
          });

          upsertCompetitorSnapshot({
            companyId,
            competitorName: detailsResult.details.name || place.name,
            source: "google_reviews_collection",
            rating: detailsResult.details.rating || place.rating || null,
            reviewCount: detailsResult.details.user_ratings_total || place.userRatingsTotal || 0,
            website: detailsResult.details.website || detailsResult.details.url || null,
            rawData: detailsResult.details
          });

          analyzeReviews({
            companyId,
            competitorName: detailsResult.details.name || place.name,
            source: "google_places_collection",
            reviews: detailsResult.details.reviews || []
          });
        }
      }
    }
  }

  let instagramData = { configured: false };
  if (instagram.isConfigured()) {
    const media = await instagram.fetchBusinessMedia();
    const insights = await instagram.fetchAccountInsights();
    instagramData = { media, insights };

    insertSnapshot({
      companyId,
      snapshotType: "instagram_business",
      source: "instagram_business_api",
      sourceRef: null,
      metrics: {
        instagramMediaCount: (media.media || []).length,
        instagramInsightCount: (insights.insights || []).length
      },
      raw: instagramData
    });
  }

  let adLibraryData = { configured: false };
  if (adLibrary.isConfigured()) {
    adLibraryData = await adLibrary.searchAds({ query: companyName || "delivery" });
    insertSnapshot({
      companyId,
      snapshotType: "meta_ad_library",
      source: "meta_ad_library_api",
      sourceRef: companyName || "delivery",
      metrics: {
        adCount: (adLibraryData.ads || []).length
      },
      raw: adLibraryData
    });
  }

  const comparisons = buildTemporalComparisons(companyId);

  repo.insert("market_analysis", {
    company_id: companyId,
    analysis_type: "monitoring_run_summary",
    source_url: ownMenuUrl,
    summary: `Monitoramento concluido com ${collection.competitors.length} concorrentes por link e ${googleSummary.places ? googleSummary.places.length : 0} resultados Google Places.`,
    raw_data: JSON.stringify({
      ownSummary: collection.own.summary,
      competitorsByLink: collection.competitors.length,
      googlePlacesConfigured: googleSummary.configured,
      instagramConfigured: instagram.isConfigured(),
      adLibraryConfigured: adLibrary.isConfigured(),
      temporalComparisonsCreated: comparisons.length
    }),
    confidence: 0.82
  });

  repo.insert("external_collection_runs", {
    company_id: companyId,
    run_type: "monitoring",
    status: "ok",
    details: `Snapshots e comparacoes registrados: ${comparisons.length}`
  });

  return {
    collection,
    googleSummary,
    instagramConfigured: instagram.isConfigured(),
    adLibraryConfigured: adLibrary.isConfigured(),
    temporalComparisons: comparisons.length
  };
}

module.exports = {
  runCompetitorMonitoring,
  upsertCompetitorSnapshot
};
