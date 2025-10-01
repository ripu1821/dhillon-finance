/**
 * State Validation Schema
 */
import Joi from "joi";

export const createStateSchema = Joi.object({
  countryId: Joi.string().uuid().required(),
  name: Joi.string().trim().required(),
  stateCode: Joi.string().optional(),
  latitude: Joi.number().precision(8).optional(),
  longitude: Joi.number().precision(8).optional(),
  isActive: Joi.boolean().optional(),
});

export const updateStateSchema = Joi.object({
  countryId: Joi.string().uuid().optional(),
  name: Joi.string().trim().optional(),
  stateCode: Joi.string().optional(),
  latitude: Joi.number().precision(8).optional(),
  longitude: Joi.number().precision(8).optional(),
  isActive: Joi.boolean().optional(),
});
