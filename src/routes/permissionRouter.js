/**
 * Permission Master Router
 */

import express from "express";
import PermissionController from "../controllers/permission.controller.js";

import validateSchema from "../middlewares/validationMiddleware.js";
import {
  createPermissionSchema,
  updatePermissionSchema,
  updatePermissionStatusSchema,
} from "../schemas/permission.schema.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const permissionRouter = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Permission:
 *       type: object
 *       required:
 *         - name
 *         - status
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: "VIEW_DASHBOARD"
 *         description:
 *           type: string
 *           example: "Permission to view dashboard"
 *         status:
 *           type: string
 *           enum: [Active, Inactive]
 *           example: Active
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: API endpoints for managing permissions
 */

/**
 * @swagger
 * /permission:
 *   get:
 *     summary: Get list of permissions
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter by permissions name
 *     responses:
 *       200:
 *         description: List of permissions fetched successfully
 */
permissionRouter.get(
  "/",
  authenticateUser,
  PermissionController.getPermissionList
);

/**
 * @swagger
 * /permission/{id}:
 *   get:
 *     summary: Get permission by ID
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Permission fetched successfully
 *       404:
 *         description: Permission not found
 */
permissionRouter.get(
  "/:id",
  authenticateUser,
  PermissionController.getPermissionById
);

/**
 * @swagger
 * /permission:
 *   post:
 *     summary: Create new permission
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       201:
 *         description: Permission created successfully
 *       400:
 *         description: Permission already exists
 */
permissionRouter.post(
  "/",
  authenticateUser,
  validateSchema(createPermissionSchema),
  PermissionController.createPermission
);

/**
 * @swagger
 * /permission/{id}:
 *   put:
 *     summary: Update permission
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Permission'
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       404:
 *         description: Permission not found
 */
permissionRouter.put(
  "/:id",
  authenticateUser,
  validateSchema(updatePermissionSchema),
  PermissionController.updatePermission
);

/**
 * @swagger
 * /permission/{id}/status:
 *   patch:
 *     summary: Update permission status
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [Active, Inactive]
 *     responses:
 *       200:
 *         description: Permission status updated successfully
 *       404:
 *         description: Permission not found
 */
permissionRouter.patch(
  "/:id/status",
  authenticateUser,
  validateSchema(updatePermissionStatusSchema),
  PermissionController.updatePermissionStatus
);

/**
 * @swagger
 * /permission/{id}:
 *   delete:
 *     summary: Delete Permission by ID
 *     tags: [Permissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: spermission deleted successfully
 *       404:
 *         description: Permission not found
 */
permissionRouter.delete(
  "/:id",
  authenticateUser,
  PermissionController.deletePermission
);

export default permissionRouter;
