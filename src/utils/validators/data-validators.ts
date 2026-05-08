/**
 * Common Validation Functions
 * Centralized validators for data validation
 */

/**
 * Validates if a string is a valid phone number
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^(\+\d{1,3})?\d{9,12}$/;
  return phoneRegex.test(phone.replace(/[\s-()]/g, ""));
};

/**
 * Validates if a string is a valid email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates if a string is not empty
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates if a number is positive
 */
export const isPositive = (value: number): boolean => {
  return value > 0;
};

/**
 * Validates if a date is valid
 */
export const isValidDate = (date: any): boolean => {
  const parsedDate = new Date(date);
  return parsedDate instanceof Date && !isNaN(parsedDate.getTime());
};

/**
 * Validates if object has required fields
 */
export const hasRequiredFields = <T extends Record<string, any>>(
  obj: T,
  requiredFields: (keyof T)[]
): boolean => {
  return requiredFields.every(
    (field) => obj[field] !== null && obj[field] !== undefined && obj[field] !== ""
  );
};

/**
 * Deep comparison of two objects
 */
export const isDeepEqual = (obj1: any, obj2: any): boolean => {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
};

/**
 * Type guard: Check if value exists
 */
export const exists = <T>(value: T | null | undefined): value is T => {
  return value !== null && value !== undefined;
};
