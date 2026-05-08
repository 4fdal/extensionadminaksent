/**
 * String Manipulation and Formatting Utilities
 * Common string operations to avoid code duplication
 */

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert to title case (capitalize each word)
 */
export const titleCase = (str: string): string => {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * Convert to camelCase
 */
export const toCamelCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[-_\s](.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toLowerCase());
};

/**
 * Convert to snake_case
 */
export const toSnakeCase = (str: string): string => {
  return str
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .replace(/[\s-]+/g, "_")
    .toLowerCase();
};

/**
 * Truncate string with ellipsis
 */
export const truncate = (str: string, length: number): string => {
  return str.length > length ? str.substring(0, length) + "..." : str;
};

/**
 * Replace all occurrences (works like replace with 'g' flag)
 */
export const replaceAll = (str: string, search: string, replace: string): string => {
  return str.split(search).join(replace);
};

/**
 * Mask sensitive information (e.g., phone numbers, emails)
 */
export const maskEmail = (email: string): string => {
  const [local, domain] = email.split("@");
  const maskedLocal = local.substring(0, 2) + "*".repeat(Math.max(0, local.length - 4));
  return `${maskedLocal}@${domain}`;
};

/**
 * Format phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length < 10) return phone;

  return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
};

/**
 * Remove all whitespace
 */
export const removeWhitespace = (str: string): string => {
  return str.replace(/\s+/g, "");
};

/**
 * Check if string is numeric
 */
export const isNumeric = (str: string): boolean => {
  return /^\d+$/.test(str);
};

/**
 * Pad string with character (useful for formatting)
 */
export const padString = (str: string, length: number, padChar: string = " "): string => {
  return str.padStart(length, padChar);
};

/**
 * Generate random string
 */
export const randomString = (length: number = 10): string => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};
