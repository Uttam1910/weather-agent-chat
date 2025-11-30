/**
 * API Configuration Utility
 * Validates and exports API configuration from environment variables
 */

export const API_ENDPOINT = import.meta.env.VITE_API_ENDPOINT;
export const THREAD_ID = import.meta.env.VITE_THREAD_ID;

/**
 * Validates that all required environment variables are set
 * @returns {string[]} Array of missing environment variable names
 */
export const validateEnvVars = () => {
  const missing = [];
  if (!API_ENDPOINT) missing.push('VITE_API_ENDPOINT');
  if (!THREAD_ID) missing.push('VITE_THREAD_ID');
  return missing;
};

/**
 * Checks if API is properly configured
 * @returns {boolean} True if all required env vars are set
 */
export const isApiConfigured = () => {
  return validateEnvVars().length === 0;
};

/**
 * Gets a user-friendly error message for missing configuration
 * @returns {string|null} Error message or null if configured
 */
export const getConfigError = () => {
  const missing = validateEnvVars();
  if (missing.length === 0) return null;
  return `Missing environment variables: ${missing.join(', ')}. Please check your .env file.`;
};

