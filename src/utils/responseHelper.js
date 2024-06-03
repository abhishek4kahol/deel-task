import { STATUS_CODES } from "./statusCodes.js";

/**
 * Utility function to handle errors in API responses.
 *
 * @param {Object} res - The response object.
 * @param {Error} error - The error object.
 */
const handleErrorResponse = (res, error) => {
  return res
    .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
    .json({ error: error.message })
    .end();
};

/**
 * Sends a JSON response with the specified status code and data.
 *
 * @param {Object} res - The response object.
 * @param {number} statusCode - The HTTP status code to be sent in the response.
 * @param {Object} data - The data to be sent as a JSON response.
 */
const sendResponse = (res, statusCode, data) => {
  res.status(statusCode).json(data).end();
};

export { handleErrorResponse, sendResponse };
