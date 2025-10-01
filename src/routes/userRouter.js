import express from "express";
import userController from "../controllers/user.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema.js";
import validateSchema from "../middlewares/validationMiddleware.js";

const userRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         userName:
 *           type: string
 *         email:
 *           type: string
 *         mobileNumber:
 *           type: string
 *         password:
 *           type: string
 *         profileImage:
 *           type: string
 *         address:
 *           type: string
 *         gender:
 *           type: Male
 *         description:
 *           type: string
 *         lastLoginAt:
 *           type: date
 *         dob:
 *           type: date
 *         roleId:
 *           type: string
 *           format: uuid
 *         refreshToken:
 *           type: string
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/User" }
 *     responses:
 *       201:
 *         description: User created
 */
userRouter.post(
  "/",
  authenticateUser,
  validateSchema(createUserSchema),
  userController.createUser
);

/**
 * @swagger
 * /user:
 *   get:
 *     summary: Get list of users
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of users
 */
userRouter.get("/", authenticateUser, userController.getUsers);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User fetched
 */
userRouter.get("/:id", authenticateUser, userController.getUserById);

/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/User" }
 *     responses:
 *       200:
 *         description: User updated
 */
userRouter.put(
  "/:id",
  authenticateUser,
  validateSchema(updateUserSchema),
  userController.updateUser
);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete user
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User deleted
 */
userRouter.delete("/:id", authenticateUser, userController.deleteUser);

export default userRouter;
