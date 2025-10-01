/**
 * Role Joi Validation
 */
import Joi from "joi";

export const createRoleSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  description: Joi.string().allow("", null),
  status: Joi.string().valid("Active", "Inactive").required(),
});

export const updateRoleSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),
  description: Joi.string().allow("", null),
  status: Joi.string().valid("Active", "Inactive").optional(),
});

export const updateRoleStatusSchema = Joi.object({
  status: Joi.string().valid("Active", "Inactive").required(),
});
