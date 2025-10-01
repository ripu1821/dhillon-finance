/**
 * Country Validation Schema
 */

import Joi from "joi";

export const createCountrySchema = Joi.object({
  name: Joi.string().trim().required(),
  iso2: Joi.string().length(2).optional(),
  iso3: Joi.string().length(3).optional(),
  phonecode: Joi.string().optional(),
  capital: Joi.string().optional(),
  currency: Joi.string().optional(),
  currencySymbol: Joi.string().optional(),
  region: Joi.string().optional(),
  subregion: Joi.string().optional(),
  latitude: Joi.number().precision(8).optional(),
  longitude: Joi.number().precision(8).optional(),
  isActive: Joi.boolean().optional(),
});

export const updateCountrySchema = Joi.object({
  name: Joi.string().trim().optional(),
  iso2: Joi.string().length(2).optional(),
  iso3: Joi.string().length(3).optional(),
  phonecode: Joi.string().optional(),
  capital: Joi.string().optional(),
  currency: Joi.string().optional(),
  currencySymbol: Joi.string().optional(),
  region: Joi.string().optional(),
  subregion: Joi.string().optional(),
  latitude: Joi.number().precision(8).optional(),
  longitude: Joi.number().precision(8).optional(),
  isActive: Joi.boolean().optional(),
});

export const updateCountryStatusSchema = Joi.object({
  isActive: Joi.boolean().required(),
});
