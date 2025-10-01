/**
 * District validation Schema
 */
import Joi from "joi";

export const createDistrictSchema = Joi.object({
  stateId: Joi.string().uuid().required(),
  countryId: Joi.string().uuid().required(),
  name: Joi.string().trim().required(),
  latitude: Joi.number().precision(8).optional(),
  longitude: Joi.number().precision(8).optional(),
  isActive: Joi.boolean().optional(),
});

export const updateDistrictSchema = Joi.object({
  stateId: Joi.string().uuid().optional(),
  countryId: Joi.string().uuid().optional(),
  name: Joi.string().trim().optional(),
  latitude: Joi.number().precision(8).optional(),
  longitude: Joi.number().precision(8).optional(),
  isActive: Joi.boolean().optional(),
});
