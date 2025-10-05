// src/services/api.js

const API_BASE_URL = "http://127.0.0.1:5000/api";

/**
 * Fetches documents for a given topic.
 * @param {string} topic The topic to search for.
 * @returns {Promise<Array>} A promise that resolves to an array of documents.
 */
export const fetchDocumentsByTopic = async (topic) => {
  const response = await fetch(`${API_BASE_URL}/documents/${encodeURIComponent(topic)}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Starts a new analysis job for a given topic.
 * @param {string} topic The topic to analyze.
 * @returns {Promise<Object>} A promise that resolves to the server's response payload.
 */
export const startAnalysisForTopic = async (topic) => {
  const response = await fetch(`${API_BASE_URL}/analyze/${encodeURIComponent(topic)}`, {
    method: "POST",
  });
  if (!response.ok) {
     const errorPayload = await response.json().catch(() => ({ status: response.statusText }));
     throw new Error(errorPayload?.status || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

/**
 * Fetches all analytics data from the single synthesis endpoint.
 * @param {string} topic The topic to analyze.
 * @returns {Promise<Object | null>} A promise that resolves to the full analytics payload, or null on error.
 */
export const fetchAnalyticsData = async (topic) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analytics/synthesis/${encodeURIComponent(topic)}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch analytics data:", error);
    return null; // Return null on error to be handled by the component
  }
};