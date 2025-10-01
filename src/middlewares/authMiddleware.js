/**
 * Auth Middleware
 */

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import hasPermission from "../utils/abac.js";

/**
 * Middleware to authenticate a user based on the JWT token provided in the
 * Authorization header. If the token is valid, the decoded user information
 * is attached to the request object. Otherwise, an error is thrown.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @throws {ApiError} If no token is provided or if the token is invalid or expired.
 */

export const authenticateUser = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    throw new ApiError(401, "Access denied. No token provided.");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN_SECRET_KEY);

    req.user = decoded;
    next();
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }
};

/**
 * Authorization middleware
 * @param {string} action - The action to check
 * @param {string} resource - The resource to check
 * @returns {function} - The middleware function
 * @throws {ApiError} - If the user does not have the required permission
 */
export const authorizeUser =
  (action, activityName) => async (req, res, next) => {
    try {
      (await hasPermission(req.user, action, activityName))
        ? next()
        : next(new ApiError(403, "Access denied"));
    } catch (err) {
      next(err);
    }
  };
