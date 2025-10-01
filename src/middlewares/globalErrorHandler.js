/**
 * Global Error Handler Middleware
 */

import { ApiResponse } from "../utils/ApiResponse.js";
import logger from "../utils/logger.js";

const globalErrorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  logger.error(`${statusCode} - ${message}`);

  return res
    .status(statusCode)
    .json(new ApiResponse(statusCode, null, message));
};

export { globalErrorHandler };
