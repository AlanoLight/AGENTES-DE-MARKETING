const repo = require("../../db/repository");
const googlePlaces = require("../collection/googlePlacesClient");
const { analyzeReviews } = require("./reviewAnalyzer");
const { upsertCompetitorSnapshot } = require("../collection/competitorMonitor");

function mapGooglePlaceToCompetitor(place) {
  return {
    name: place.name || "concorrente_sem_nome",
    sourceRef: place.placeId || place.formattedAddress || place.name || "google_places",
    rating: place.rating || null,
    reviewCount: place.userRatingsTotal || 0,
    website: null,
    raw: place
  };
}

function ensureCompetitor(companyId, competitorName, sourceUrl, rating) {
  const existing = repo
    .list(
      "competitors",
      "WHERE company_id = ? AND name = ? ORDER BY id DESC LIMIT 1",
      [companyId, competitorName]
    )[0];

  if (existing) {
    if (rating !== null && rating !== undefined) {
      repo.update("competitors", existing.id, {
        source_url: existing.source_url,
        rating,
        social_links: existing.social_links || JSON.stringify([]),
        diferencials: existing.diferencials || JSON.stringify([])
      });
    }
    return existing;
  }

  return repo.insert("competitors", {
    company_id: companyId,
    name: competitorName,
    source_url: sourceUrl,
    rating: rating || null,
    social_links: JSON.stringify([]),
    diferencials: JSON.stringify([])
  });
}

async function runDailyCompetitorScan({ companyId, companyName }) {
  if (!googlePlaces.isConfigured()) {
    return { configured: false, scanned: 0, analyzed: 0 };
  }

  const search = await googlePlaces.textSearch(companyName || "restaurante delivery");
  let analyzed = 0;

  for (const place of search.places.slice(0, 8)) {
    const mapped = mapGooglePlaceToCompetitor(place);

    const competitor = ensureCompetitor(
      companyId,
      mapped.name,
      `google-place:${mapped.sourceRef}`,
      mapped.rating
    );

    upsertCompetitorSnapshot({
      companyId,
      competitorName: mapped.name,
      source: "google_places_daily_scan",
      rating: mapped.rating,
      reviewCount: mapped.reviewCount,
      website: mapped.website,
      rawData: mapped.raw
    });

    const detail = place.placeId ? await googlePlaces.placeDetails(place.placeId) : { details: null };
    const details = detail.details || null;

    if (details) {
      if (details.website) {
        upsertCompetitorSnapshot({
          companyId,
          competitorName: mapped.name,
          source: "google_places_details_daily_scan",
          rating: details.rating || mapped.rating,
          reviewCount: details.user_ratings_total || mapped.reviewCount,
          website: details.website || null,
          rawData: details
        });
      }

      const reviews = details.reviews || [];
      for (const r of reviews) {
        repo.insert("reviews", {
          company_id: companyId,
          competitor_id: competitor.id,
          source: "google_places_daily_scan",
          reviewer_name: r.author_name || null,
          rating: r.rating || null,
          review_text: r.text || null,
          review_date: r.relative_time_description || null
        });
      }

      analyzeReviews({
        companyId,
        competitorName: mapped.name,
        source: "google_places_daily_scan",
        reviews
      });

      analyzed += 1;
    }
  }

  repo.insert("automation_logs", {
    job_name: "daily_competitor_scan",
    status: "ok",
    details: `company=${companyId} scanned=${search.places.length} analyzed=${analyzed}`
  });

  return {
    configured: true,
    scanned: search.places.length,
    analyzed
  };
}

module.exports = {
  runDailyCompetitorScan
};
