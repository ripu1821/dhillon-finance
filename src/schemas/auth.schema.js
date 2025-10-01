/**
 * Auth Schema
 */

import Joi from "joi";

/**
 * Create register validation schema
 */
const registerUser = {
  body: Joi.object({
    firstName: Joi.string().allow(null, ""),
    lastName: Joi.string().allow(null, ""),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      .messages({
        "string.min": "Password must be at least {#limit} characters long",
        "string.max": "Password must not exceed {#limit} characters",
        "string.pattern.base": "Password must meet complexity requirements",
        "any.invalid": "Password must not contain emojis",
      })
      .required(),
    organization: Joi.string().trim().lowercase().required(),
    orgDescription: Joi.string().allow(null, "").max(150).optional(),
  }),
};

/**
 * Create login validation schema
 */
const loginUser = {
  body: Joi.object({
    email: Joi.string().required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      .messages({
        "string.min": "Password must be at least {#limit} characters long",
        "string.max": "Password must not exceed {#limit} characters",
        "string.pattern.base": "Password must meet complexity requirements",
        "any.invalid": "Password must not contain emojis",
      })
      .required(),
  }),
};

/**
 * Reset password validation schema
 */
const resetPassword = {
  body: Joi.object({
    oldPassword: Joi.string()
      .min(8)
      .max(30)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      .messages({
        "string.min": "Password must be at least {#limit} characters long",
        "string.max": "Password must not exceed {#limit} characters",
        "string.pattern.base": "Password must meet complexity requirements",
        "any.invalid": "Password must not contain emojis",
      })
      .required(),
    newPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
      }),
  }),
};

export { registerUser, loginUser, resetPassword };
