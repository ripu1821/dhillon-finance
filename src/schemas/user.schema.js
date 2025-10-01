import Joi from "joi";

// Create User schema
export const createUserSchema = Joi.object({
  userName: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().required(),
  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required()
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
    }),
  password: Joi.string().min(6).required(),
  roleId: Joi.string().uuid().required(),
  refreshToken: Joi.string().optional().allow(null, ""),
  isActive: Joi.boolean().optional(),
  profileImage: Joi.string().uuid().optional().allow(null, ""),
  address: Joi.string().optional().allow(null, ""),
  description: Joi.string().optional().allow(null, ""),
  lastLoginAt: Joi.date().optional().allow(null),
  dob: Joi.date().optional().allow(null),
  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .optional()
    .allow(null, ""),
});

// Update User schema
export const updateUserSchema = Joi.object({
  userName: Joi.string().min(3).max(50).optional(),
  email: Joi.string().email().optional(),
  mobileNumber: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .optional()
    .messages({
      "string.pattern.base": "Mobile number must be 10 digits",
    }),
  password: Joi.string().min(6).optional(),
  roleId: Joi.string().uuid().optional(),
  refreshToken: Joi.string().optional().allow(null, ""),
  isActive: Joi.boolean().optional(),
  profileImage: Joi.string().uuid().optional().allow(null, ""),
  address: Joi.string().optional().allow(null, ""),
  description: Joi.string().optional().allow(null, ""),
  lastLoginAt: Joi.date().optional().allow(null),
  dob: Joi.date().optional().allow(null),
  gender: Joi.string()
    .valid("Male", "Female", "Other")
    .optional()
    .allow(null, ""),
});
