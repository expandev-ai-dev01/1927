/**
 * @summary
 * Utility functions for standardized API responses
 *
 * @module response
 */

/**
 * @interface SuccessResponse
 * @description Standard success response format
 *
 * @property {boolean} success - Always true for success responses
 * @property {any} data - Response data
 */
export interface SuccessResponse<T = any> {
  success: true;
  data: T;
}

/**
 * @interface ErrorResponse
 * @description Standard error response format
 *
 * @property {boolean} success - Always false for error responses
 * @property {string} error - Error message
 * @property {any} details - Additional error details
 */
export interface ErrorResponse {
  success: false;
  error: string;
  details?: any;
}

/**
 * @summary
 * Creates a standardized success response
 *
 * @function successResponse
 * @module response
 *
 * @param {T} data - Response data
 *
 * @returns {SuccessResponse<T>} Standardized success response
 */
export function successResponse<T>(data: T): SuccessResponse<T> {
  return {
    success: true,
    data,
  };
}

/**
 * @summary
 * Creates a standardized error response
 *
 * @function errorResponse
 * @module response
 *
 * @param {string} error - Error message
 * @param {any} details - Additional error details
 *
 * @returns {ErrorResponse} Standardized error response
 */
export function errorResponse(error: string, details?: any): ErrorResponse {
  return {
    success: false,
    error,
    details,
  };
}
