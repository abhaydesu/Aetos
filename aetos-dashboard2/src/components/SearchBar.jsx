// src/components/SearchBar.js
import React, { useState } from "react";

function SearchBar({ onAnalyze, isLoading }) {
  const [localTopic, setLocalTopic] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    if (localTopic && !isLoading) {
      onAnalyze(localTopic);
    }
  };

  return (
    <div className="search-container mt-6 mb-4">
      <form onSubmit={handleSubmit} className="flex w-full max-w-2xl mx-auto items-center gap-2">
        <input
          type="text"
          value={localTopic}
          onChange={(e) => setLocalTopic(e.target.value)}
          placeholder="Enter a technology topic (ex. drone, laser, uav, etc.)"
          disabled={isLoading}
          className="flex h-10 w-full rounded-md border border-neutral-700 bg-transparent px-3 py-2 text-sm ring-offset-neutral-900 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-500  disabled:cursor-not-allowed disabled:opacity-50 flex-grow"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-neutral-900 transition-colors  disabled:pointer-events-none disabled:opacity-50 bg-sky-600 text-neutral-50 hover:bg-sky-600/90 h-10 px-4 py-2"
        >
          {isLoading ? "Analyzing..." : "Analyze Topic"}
        </button>
      </form>
    </div>
  );
}

export default SearchBar;