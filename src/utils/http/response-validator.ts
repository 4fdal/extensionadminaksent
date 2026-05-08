import { CapacitorHttpResponse } from "@capacitor/core";

/**
 * Custom error for HTTP validation failures
 */
export class HttpValidationError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: CapacitorHttpResponse
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
  response: CapacitorHttpResponse,
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
  const contentType = response.headers["Content-Type"] || "";
  if (!contentType.includes("application/json")) {
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
