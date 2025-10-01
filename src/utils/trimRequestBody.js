/**
 * trimRequestBody
 *
 * Utility to trim all string values in a request body:
 * - Removes leading/trailing whitespace
 * - Preserves single spaces between words
 * - Converts multiple internal spaces into a single space
 */

export const trimRequestBody = (obj) => {
  if (typeof obj !== "object" || obj === null) return obj;

  const cleaned = Array.isArray(obj) ? [] : {};

  for (const key in obj) {
    const value = obj[key];

    if (typeof value === "string") {
      // Remove leading/trailing whitespace and reduce multiple spaces inside to one
      cleaned[key] = value.trim().replace(/\s+/g, " ");
    } else if (typeof value === "object" && value !== null) {
      // Recursively clean nested objects or arrays
      cleaned[key] = trimRequestBody(value);
    } else {
      // Keep non-string values as-is
      cleaned[key] = value;
    }
  }

  return cleaned;
};
