import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000"
});

export async function getOverview(companyId) {
  const { data } = await api.get(`/api/dashboard/overview/${companyId}`);
  return data;
}

export async function collectLinks(payload) {
  const { data } = await api.post("/api/intelligence/collect-links", payload);
  return data;
}

export async function runRealMonitoring(payload) {
  const { data } = await api.post("/api/intelligence/monitor", payload);
  return data;
}

export async function getSnapshots(companyId) {
  const { data } = await api.get(`/api/intelligence/snapshots/${companyId}`);
  return data;
}

export async function getTemporalComparison(companyId) {
  const { data } = await api.get(`/api/intelligence/temporal/${companyId}`);
  return data;
}

export async function getCompetitorIntelligence(companyId) {
  const { data } = await api.get(`/api/intelligence/competitor-intelligence/${companyId}`);
  return data;
}

export async function bootstrapPaulinhos() {
  const { data } = await api.post("/api/intelligence/bootstrap-paulinhos");
  return data;
}

export async function getCompetitorComparison(companyId) {
  const { data } = await api.get(`/api/intelligence/competitors/${companyId}`);
  return data;
}

export async function captureTrends(companyId) {
  const { data } = await api.post(`/api/intelligence/trends/${companyId}`);
  return data;
}

export async function generateStrategy(companyId) {
  const { data } = await api.post(`/api/strategies/${companyId}`);
  return data;
}

export async function generateCaption(payload) {
  const { data } = await api.post("/api/content/captions", payload);
  return data;
}

export async function generateImage(payload) {
  const { data } = await api.post("/api/creative/image", payload);
  return data;
}
