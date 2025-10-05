// src/utils/colorUtils.js

/**
 * Returns Tailwind CSS background and text color classes based on the TRL value.
 * @param {number | null} trl The Technology Readiness Level.
 * @returns {string} A string of Tailwind classes.
 */
export const getTRLClasses = (trl) => {
  if (!trl && trl !== 0) {
    return "bg-neutral-600 text-neutral-100"; // Gray for N/A
  }
  if (trl >= 7) {
    return "bg-green-700 text-green-100"; // Green for high TRL
  }
  if (trl >= 4) {
    return "bg-yellow-600 text-yellow-100"; // Yellow for medium TRL
  }
  return "bg-red-700 text-red-100"; // Red for low TRL
};