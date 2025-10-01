/**
 * Schema Validation Middleware
 */
import { ApiResponse } from "../utils/ApiResponse.js";

const validateSchema = (schema) => {
  return (req, res, next) => {
    if (schema.body) {
      const { error } = schema.body.validate(req.body);
      if (error) {
        return res.status(400).json(new ApiResponse(400, null, error.message));
      }
    }

    if (schema.query) {
      const { error } = schema.query.validate(req.query);
      if (error) {
        return res.status(400).json(new ApiResponse(400, null, error.message));
      }
    }

    next();
  };
};

export default validateSchema;
