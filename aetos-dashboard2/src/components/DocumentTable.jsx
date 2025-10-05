// src/components/DocumentTable.jsx
import React from "react";
import DocumentRow from "./DocumentRow";

// This component now just renders a list of DocumentRow cards.
// The outer container styling is handled by the parent Dashboard.jsx.
function DocumentTable({ documents }) {
  if (!documents || documents.length === 0) {
    return (
      <div className="p-4 text-center text-neutral-400">
        No documents to display.
      </div>
    );
  }

  return (
    // This div creates vertical spacing between each document card.
    <div className="space-y-4">
      {documents.map((doc) => (
        <DocumentRow key={doc.id?.$oid || doc._id?.$oid} doc={doc} />
      ))}
    </div>
  );
}

export default DocumentTable;