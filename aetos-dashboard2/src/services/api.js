// src/services/api.js
const API_BASE_URL = "http://127.0.0.1:5001/api";

/**
 * Fetches documents for a given topic.
 */
export const fetchDocumentsByTopic = async (topic) => {
  const response = await fetch(`${API_BASE_URL}/documents/${encodeURIComponent(topic)}`);
  if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  return response.json();
};

/**
 * Starts a new analysis for a given topic.
 */
export const startAnalysisForTopic = async (topic) => {
  const response = await fetch(`${API_BASE_URL}/analyze/${encodeURIComponent(topic)}`, {
    method: "POST"
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    let payload = text || response.statusText
    try { payload = JSON.parse(text) } catch (e) {}
    throw new Error(payload?.status || payload?.error || payload || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Fetches analytics data — here we call analyze and return its payload.
 */
export const fetchAnalyticsData = async (topic) => {
  try {
    const payload = await startAnalysisForTopic(topic);
    return payload;
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);
    return null;
  }
};
