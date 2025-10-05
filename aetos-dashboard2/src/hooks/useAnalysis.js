import { useState } from "react";
import { fetchDocumentsByTopic, startAnalysisForTopic } from "../services/api";

const INITIAL_STATUS = "Enter a topic to begin analysis.";

/**
 * @description Custom hook to manage the state and logic for topic analysis.
 * It encapsulates all API calls, loading states, and status updates,
 * providing a clean interface for the UI components.
 *
 * @returns {{
 * documents: Array<any>,
 * status: string,
 * isLoading: boolean,
 * analyzedTopic: string,
 * startAnalysis: (topic: string) => Promise<void>
 * }}
 */
export const useAnalysis = () => {
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState(INITIAL_STATUS);
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedTopic, setAnalyzedTopic] = useState("");

  /**
   * @description Initiates the analysis process for a given topic.
   * This function handles the entire lifecycle: starting the job,
   * fetching results, and updating the UI state.
   * @param {string} topic The topic to be analyzed.
   */
  const startAnalysis = async (topic) => {
    if (!topic) {
      setStatus("Please enter a topic to search.");
      return;
    }

    setIsLoading(true);
    setDocuments([]);
    setAnalyzedTopic("");
    setStatus(`Initializing analysis for "${topic}"...`);

    try {
      // Step 1: Start the analysis job on the server.
      await startAnalysisForTopic(topic);
      setStatus(`Processing documents for "${topic}"...`);

      // Step 2: Fetch the processed documents.
      const data = await fetchDocumentsByTopic(topic);
      const results = data || [];

      setDocuments(results);
      setAnalyzedTopic(topic); // Set topic to render analytics.

      // Step 3: Update status message based on results.
      if (results.length > 0) {
        setStatus(`Displaying ${results.length} results for "${topic}".`);
      } else {
        setStatus(`No results found for "${topic}".`);
      }
    } catch (error) {
      console.error("An error occurred during the analysis process:", error);
      setStatus(`Error: Failed to analyze "${topic}". Please try again.`);
      setDocuments([]);
      setAnalyzedTopic("");
    } finally {
      setIsLoading(false);
    }
  };

  return { documents, status, isLoading, analyzedTopic, startAnalysis };
};