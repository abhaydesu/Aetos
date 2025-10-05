// src/components/DocumentRow.jsx
import React from "react";
import { getTRLClasses } from "../utils/colorUtils";
import { FiExternalLink } from "react-icons/fi"; // For a nice external link icon

function DocumentRow({ doc }) {
  const publishedDate = doc.published?.$date
    ? new Date(doc.published.$date).toLocaleDateString()
    : doc.published || "N/A";

  return (
    // Each row is now a self-contained card with a subtle hover effect.
    <div className="bg-neutral-900/70 border border-neutral-800 rounded-lg p-5 transition-all duration-300 hover:border-sky-500/40 hover:bg-neutral-800/50">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-x-6 gap-y-4">
        
        {/* Column 1: Strategic Analysis (takes up more space) */}
        <div className="lg:col-span-3">
          <a
            href={doc.id}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 text-lg font-semibold text-neutral-100 hover:text-sky-400 transition-colors"
          >
            {doc.title}
            <FiExternalLink className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>

          <div className="mt-2 flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${getTRLClasses(
                doc.TRL
              )}`}
            >
              TRL {doc.TRL ?? "N/A"}
            </span>
            <p className="text-xs text-neutral-400 italic">
              {doc.TRL_justification || ""}
            </p>
          </div>
          <p className="mt-3 text-sm text-neutral-300 leading-relaxed">
            {doc.strategic_summary || "Not available."}
          </p>
        </div>

        {/* Column 2: Technologies & Relationships */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <h4 className="font-semibold text-neutral-200 text-sm mb-2">
              Key Technologies
            </h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-neutral-300">
              {(doc.technologies || []).length > 0 ? (
                doc.technologies.map((t, i) => <li key={i}>{t}</li>)
              ) : (
                <li className="text-neutral-500 list-none italic">None listed</li>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-200 text-sm mb-2">
              Key Relationships
            </h4>
            <ul className="space-y-1.5 text-sm text-neutral-300">
              {(doc.key_relationships || []).length > 0 ? (
                doc.key_relationships.map((r, i) => (
                  <li key={i}>
                    <strong className="font-medium text-neutral-200">{r.subject}</strong> {r.relationship}{" "}
                    <strong className="font-medium text-neutral-200">{r.object}</strong>
                  </li>
                ))
              ) : (
                <li className="text-neutral-500 italic">None listed</li>
              )}
            </ul>
          </div>
        </div>

        {/* Footer with Metadata (spans full width of the card) */}
        <div className="lg:col-span-5 border-t border-neutral-800 pt-4 mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-neutral-400">
          <p><strong className="font-medium text-neutral-300">Country:</strong> {doc.country || "N/A"}</p>
          <p><strong className="font-medium text-neutral-300">Provider:</strong> {doc.provider_company || "N/A"}</p>
          <p><strong className="font-medium text-neutral-300">Date:</strong> {publishedDate}</p>
          <p><strong className="font-medium text-neutral-300">Funding:</strong> {doc.funding_details || "N/A"}</p>
        </div>
      </div>
    </div>
  );
}

export default DocumentRow;