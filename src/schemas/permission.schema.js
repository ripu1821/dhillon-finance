/**
 * Permission Master Schema
 */

import Joi from "joi";

export const createPermissionSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Permission name is required",
  }),
  description: Joi.string().allow(null, "").optional(),
  status: Joi.string().valid("Active", "Inactive"),
});

export const updatePermissionSchema = Joi.object({
  name: Joi.string().trim().optional(),
  description: Joi.string().allow(null, "").optional(),
  status: Joi.string().valid("Active", "Inactive").optional(),
});

export const updatePermissionStatusSchema = Joi.object({
  status: Joi.string().valid("Active", "Inactive").required(),
});
