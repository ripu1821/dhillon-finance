/**
 * ActivityMaster Schema
 */

import Joi from "joi";

export const createActivitySchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  status: Joi.string().valid("ACTIVE", "INACTIVE").required(),
});

export const updateActivitySchema = Joi.object({
  name: Joi.string().min(3).max(100).optional(),
  status: Joi.string().valid("ACTIVE", "INACTIVE").optional(),
});

export const updateActivityStatusSchema = Joi.object({
  status: Joi.string().valid("ACTIVE", "INACTIVE").required(),
});
