// src/pages/Dashboard.jsx

import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import SearchBar from "../components/SearchBar";
import StatusBar from "../components/StatusBar";
import DocumentTable from "../components/DocumentTable";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import { fetchDocumentsByTopic, startAnalysisForTopic } from "../services/api";
import Footer from "../components/footer";
import Navbar from "../components/navbar";

function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState("Enter a topic to begin analysis.");
  const [isLoading, setIsLoading] = useState(false);
  const [analyzedTopic, setAnalyzedTopic] = useState("");

  const handleStartAnalysis = async (topic) => {
    setIsLoading(true);
    setDocuments([]);
    setAnalyzedTopic("");
    setStatus(`Submitting new analysis job for "${topic}"...`);
    try {
      const payload = await startAnalysisForTopic(topic);
      setStatus(
        `Server response: ${
          payload?.status || "Analysis started. Fetching documents..."
        }`
      );

      const data = await fetchDocumentsByTopic(topic);
      setDocuments(data || []);

      if (data && data.length > 0) {
        setStatus(`Displaying ${data.length} results for "${topic}".`);
      } else {
        setStatus(`No results found for "${topic}".`);
      }

      setAnalyzedTopic(topic);
    } catch (error) {
      console.error("Error starting analysis:", error);
      setStatus(`Error: Could not start analysis. ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-neutral-950 text-neutral-100 inter">
      {/* Decorative grid background with fade-in animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-0 w-full h-full bg-grid-neutral-800/40 -z-1"
        style={{
          maskImage:
            "radial-gradient(ellipse at top, black 20%, transparent 70%)",
        }}
      />

      <div className="relative z-10 flex-1 flex flex-col">
        <Navbar />

        {/* Main content area */}
        <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.h1
              variants={itemVariants}
              className="text-4xl md:text-5xl font-extrabold tracking-tight"
            >
              Intelligence Dashboard
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-2xl mx-auto text-lg text-neutral-400"
            >
              Enter a technology topic to aggregate data and generate strategic
              insights.
            </motion.p>
          </motion.div>

          {/* Search and Status Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12"
          >
            <SearchBar onAnalyze={handleStartAnalysis} isLoading={isLoading} />
            <StatusBar status={status} />
          </motion.div>

          {/* Results Section */}
          <div className="mt-8 space-y-8 pb-24">
            <AnimatePresence mode="wait">
              {/* Document Table Container */}
              {documents.length > 0 && (
                <motion.div
                  key="documents"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 md:p-8 backdrop-blur-sm"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-semibold mb-4 text-neutral-200"
                  >
                    Aggregated Documents
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <DocumentTable documents={documents} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {/* Analytics Dashboard Container */}
              {analyzedTopic && (
                <motion.div
                  key="analytics"
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 md:p-8 backdrop-blur-sm"
                >
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-semibold mb-4 text-neutral-200"
                  >
                    Strategic Analysis for "{analyzedTopic}"
                  </motion.h2>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <AnalyticsDashboard topic={analyzedTopic} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;