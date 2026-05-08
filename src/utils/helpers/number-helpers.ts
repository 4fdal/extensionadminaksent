/**
 * Number and Currency Formatting Utilities
 * Common number and currency operations
 */

/**
 * Format number as currency (Rupiah)
 * Usage: formatRupiah(15000) => "Rp 15.000"
 */
export const formatRupiah = (amount: number | string): string => {
  const num = typeof amount === "string" ? parseInt(amount, 10) : amount;

  if (isNaN(num)) return "Rp 0";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Parse Rupiah string to number
 * Usage: parseRupiah("Rp 15.000") => 15000
 */
export const parseRupiah = (rupiahString: string): number => {
  const cleaned = rupiahString.replace(/[^\d]/g, "");
  return parseInt(cleaned, 10) || 0;
};

/**
 * Format number with thousand separators
 * Usage: formatNumber(1234567.89, 2) => "1,234,567.89"
 */
export const formatNumber = (num: number, decimals: number = 0): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

/**
 * Format percentage
 * Usage: formatPercent(0.85) => "85%"
 */
export const formatPercent = (value: number, decimals: number = 0): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Round to specific decimal places
 */
export const round = (num: number, decimals: number = 0): number => {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

/**
 * Calculate percentage
 * Usage: calculatePercent(30, 100) => 30
 */
export const calculatePercent = (part: number, total: number): number => {
  if (total === 0) return 0;
  return (part / total) * 100;
};

/**
 * Calculate discount
 * Usage: calculateDiscount(100, 20) => 80 (20% off)
 */
export const calculateDiscount = (price: number, discountPercent: number): number => {
  return price - (price * discountPercent) / 100;
};

/**
 * Format file size to human readable
 * Usage: formatFileSize(1024000) => "1 MB"
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Clamp number between min and max
 */
export const clamp = (num: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, num));
};

/**
 * Check if number is even
 */
export const isEven = (num: number): boolean => {
  return num % 2 === 0;
};

/**
 * Check if number is odd
 */
export const isOdd = (num: number): boolean => {
  return num % 2 !== 0;
};

/**
 * Generate random number between min and max
 */
export const randomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
