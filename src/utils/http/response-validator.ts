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
export const validateHttpResponse = (
  response: HttpResponse,
  context?: string
): any => {
  // Validate status code
  if (response.status !== 200) {
    throw new HttpValidationError(
      `HTTP ${response.status}: ${context ? `(${context}) ` : ""}${JSON.stringify(response)}`,
      response.status,
      response
    );
  }

  // Validate content type
  const contentType =
    response.headers["Content-Type"] || response.headers["content-type"] || "";
  if (contentType.toLowerCase().includes("text/html")) {
    const isLoginPage =
      typeof response.data === "string" &&
      (response.data.toLowerCase().includes("login") ||
        response.data.toLowerCase().includes("username") ||
        response.data.toLowerCase().includes("password"));

    throw new HttpValidationError(
      isLoginPage
        ? "Session expired or authentication required"
        : `Expected JSON response, got HTML. Status: ${response.status}`,
      response.status,
      response
    );
  }

  if (!contentType.toLowerCase().includes("application/json")) {
    throw new HttpValidationError(
      `Expected JSON response, got: ${contentType}`,
      response.status,
      response
    );
  }

  // Parse JSON data
  try {
    return typeof response.data === "string"
      ? JSON.parse(response.data)
      : response.data;
  } catch (parseError) {
    throw new HttpValidationError(
      `Failed to parse JSON: ${parseError instanceof Error ? parseError.message : "Unknown error"}`,
      response.status,
      response
    );
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
