/**
 * Generate Verification Token Middleware
 */
import jwt from "jsonwebtoken";

const generateVerificationToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_VERIFY_SECRET_KEY, {
    expiresIn: process.env.JWT_VERIFY_EXPIRE_IN_TIME,
  });
};

export { generateVerificationToken };
