/**
 * Application-wide constants
 * Centralized configuration to avoid hard-coded values
 */

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: "https://tungkalilir.rlradius.app",
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
} as const;

/**
 * Database Configuration
 */
export const DB_CONFIG = {
  NAME: "extensionadminaksent.db",
  VERSION: 1,
  ENCRYPTION_KEY: "1234567890123456",
} as const;

/**
 * Pagination & List Configuration
 */
export const LIST_CONFIG = {
  DEFAULT_PAGE_SIZE: 25,
  INITIAL_LOAD_ITEMS: 5,
  LOAD_MORE_ITEMS: 5,
  SCROLL_THRESHOLD_PX: 750,
} as const;

/**
 * UI/UX Configuration
 */
export const UI_CONFIG = {
  MODAL_BREAKPOINTS: [0, 0.5, 0.8, 1],
  MODAL_INITIAL_BREAKPOINT: 0.6,
  BORDER_RADIUS_ROUNDED: "20px",
  DEFAULT_ANIMATION_DURATION: 300,
} as const;

/**
 * Account/Customer Configuration
 */
export const ACCOUNT_CONFIG = {
  ACCOUNT_NUMBER: "7975 0100 0814 504",
  ACCOUNT_NAME: "Extension Admin",
  BANK_CODE: "7975",
} as const;

/**
 * Status/Filter Types
 */
export const STATUS_FILTERS = {
  UNPAID: "UNPAID",
  PAID: "PAID",
  PAID_NO_SYNC: "PAID_NO_SYNC",
  ISOLIR: "ISOLIR",
  NEW: "NEW",
  ALL: "ALL",
} as const;

/**
 * HTTP Headers
 */
export const HTTP_HEADERS = {
  CONTENT_TYPE_JSON: "application/json",
  ACCEPT_JSON: "application/json",
} as const;

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: "Network request failed",
  INVALID_RESPONSE: "Invalid response from server",
  NO_DATA: "No data available",
  SYNC_FAILED: "Failed to synchronize data",
  VALIDATION_ERROR: "Validation failed",
} as const;

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  SYNC_SUCCESS: "Data synchronized successfully",
  SAVE_SUCCESS: "Data saved successfully",
  DELETE_SUCCESS: "Data deleted successfully",
} as const;
