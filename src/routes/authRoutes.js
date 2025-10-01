/**
 * Auth Router
 */

import express from "express";
import validateSchema from "../middlewares/validationMiddleware.js";
import { loginUser, resetPassword } from "../schemas/auth.schema.js";
import authController from "../controllers/auth.controller.js";
import { decryptRequestBody } from "../utils/encryptDecrypt.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const authRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Auth management API
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *           example:
 *               email: "test@gmail.com"
 *               password: "Test@1234"
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 *       500:
 *         description: Internal Server Error
 */
authRouter
  .route("/login")
  .post(
    decryptRequestBody,
    validateSchema(loginUser),
    authController.loginUser
  );

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Verify registered user
 *     tags: [Auth]
 *     requestBody:
 *       required:
 *        - token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3NDAxNDQ3MDAsImV4cCI6MTc0MDE1NTUwMH0.MJXdK8H2yacy5U_IrdlW9CQZTYQf0BixsijWgLfjnBt"
 *     responses:
 *       200:
 *         description: User verified successfully
 *       401:
 *         description: Link is invalid or expired
 *       500:
 *         description: Internal Server Error
 */
authRouter.route("/verify").post(authController.verifyUser);

/**
 * @swagger
 * /auth/forgotPassword:
 *   post:
 *     summary: send forgot password email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "test@gmail.com"
 *     responses:
 *       200:
 *         description: Reset password email sent successfully
 *       400:
 *         description: Invalid email
 *       500:
 *         description: Internal Server Error
 */
authRouter.route("/forgotPassword").post(authController.forgotPassword);

/**
 * @swagger
 * /auth/resetPassword:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 format: password
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       401:
 *         description: Link is invalid or expired
 *       500:
 *         description: Internal Server Error
 */
authRouter.route("/resetPassword").post(
  authenticateUser,
  // validateSchema(resetPassword),
  authController.resetPassword
);
/**
 * @swagger
 * /auth/resetForgotPassword:
 *   post:
 *     summary: Reset password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 format: string
 *               newPassword:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       401:
 *         description: Link is invalid or expired
 *       500:
 *         description: Internal Server Error
 */
authRouter.route("/resetForgotPassword").post(
  // validateSchema(resetPassword),
  authController.resetForgotPassword
);

/**
 * @swagger
 * /auth/refreshToken:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     description: Generates a new access token using a valid refresh token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: "your-refresh-token"
 *     responses:
 *       200:
 *         description: New access token generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   example: "new-access-token"
 *       400:
 *         description: Bad request (Invalid or missing refresh token)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 400
 *                 message:
 *                   type: string
 *                   example: "Invalid refresh token"
 *       401:
 *         description: Unauthorized (Refresh token expired or invalid)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 401
 *                 message:
 *                   type: string
 *                   example: "Refresh token expired"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 500
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
authRouter.route("/refreshToken").post(authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     description: Logs out the authenticated user by invalidating their JWT (client should delete token).
 *     tags: [Auth]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Logout successful
 *       400:
 *         description: Missing token in request
 *       401:
 *         description: Invalid or expired token
 *       500:
 *         description: Logout failed (server error)
 */
authRouter.post("/logout", authenticateUser, authController.logoutUser);

export default authRouter;
