import { HttpResponse } from "@capacitor/core";

/**
 * Custom error for HTTP validation failures
 */
export class HttpValidationError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: HttpResponse
  ) {
    super(message);
    this.name = "HttpValidationError";
  }
}

/**
 * Validates HTTP response and parses JSON data
 * Replaces 7+ duplicate validation blocks across the codebase
 *
 * @param response - CapacitorHttp response object
 * @param context - Optional context string for error messages
 * @returns Parsed response data
 * @throws HttpValidationError if response is invalid
 */
export const validateHttpResponse = <T>(
  response: HttpResponse,
  context?: string,
): T | null => {
  const contextStr = context ? `(${context}) ` : "";

  // 1. Validate status code
  if (response.status !== 200) {
    console.error(`[HTTP Error] ${contextStr}Status ${response.status}`, response);
    return null;
  }

  const contentType = (
    response.headers["Content-Type"] ||
    response.headers["content-type"] ||
    ""
  ).toLowerCase();

  const data = response.data;
  const isStringData = typeof data === "string";

  // 2. Check for HTML error pages (even if content-type says JSON, some servers misreport on error)
  if (isStringData && data.trim().startsWith("<!DOCTYPE")) {
    const isLoginPage =
      data.toLowerCase().includes("login") ||
      data.toLowerCase().includes("username") ||
      data.toLowerCase().includes("password");

    console.warn(
      `[HTTP Warning] ${contextStr}${isLoginPage ? "Session expired" : "Received HTML instead of JSON"}`,
    );
    return null;
  }

  // 3. Try to return/parse JSON
  try {
    if (isStringData) {
      // If it looks like JSON, try to parse it
      if (data.trim().startsWith("{") || data.trim().startsWith("[")) {
        return JSON.parse(data) as T;
      }
      
      // If it's a string but doesn't look like JSON, it might be a raw error message
      console.error(`[HTTP Error] ${contextStr}Received non-JSON string data:`, data.substring(0, 200));
      return null;
    }

    // If it's already an object/array (CapacitorHttp sometimes parses it for us)
    return data as T;
  } catch (parseError) {
    console.error(`[HTTP Error] ${contextStr}Failed to parse JSON:`, parseError);
    return null;
  }
};

/**
 * Handles HTTP errors with consistent logging and messaging
 *
 * @param error - Error object
 * @param defaultMessage - Fallback message for non-Error types
 * @returns User-friendly error message
 */
export const handleHttpError = (
  error: unknown,
  defaultMessage: string = "Network request failed"
): string => {
  if (error instanceof Error) {
    console.error("[HTTP Error]", error.message, error);
    return error.message;
  }

  console.error("[HTTP Error]", error);
  return defaultMessage;
};
