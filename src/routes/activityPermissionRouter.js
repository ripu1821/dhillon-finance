// routes/rolePermission.routes.js
import express from "express";
import activityPermissionsController from "../controllers/activityPermission.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const activityPermissionRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: ActivityPermissions
 *   description: Role to Activity permission mapping APIs
 */

/**
 * @swagger
 * /activityPermission/{roleId}:
 *   get:
 *     summary: Get all activity-permissions for a role
 *     description: Returns all activity-permission records for a given roleId
 *     tags: [ActivityPermissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the role
 *     responses:
 *       200:
 *         description: Successfully fetched role activities with permissions
 */
activityPermissionRouter.get(
  "/:roleId",
  authenticateUser,
  activityPermissionsController.getActivityPermissionsByRoleId
);

/**
 * @swagger
 * /activityPermission/permission/{role}:
 *   get:
 *     summary: Get all activity-permissions for a role
 *     description: Returns all activity-permission records for a given roleId
 *     tags: [ActivityPermissions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roleId
 *         required: true
 *         schema:
 *           type: string
 *         description: UUID of the role
 *     responses:
 *       200:
 *         description: Successfully fetched role activities with permissions
 */
activityPermissionRouter.get(
  "/permission/:roleId",
  authenticateUser,
  activityPermissionsController.getRolePermissions
);

/**
 * @swagger
 * /activityPermission:
 *   post:
 *     summary: Assign or update activity permissions for a role
 *     description: Replaces all existing activity-permission mappings for a given role with the provided ones.
 *     tags: [ActivityPermissions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roleId
 *               - activities
 *             properties:
 *               roleId:
 *                 type: string
 *                 description: UUID of the role
 *                 example: "c914b293-6eca-4b77-814d-f32c4fe7cb24"
 *               activities:
 *                 type: array
 *                 description: List of activities and their permissionIds
 *                 items:
 *                   type: object
 *                   required:
 *                     - activityId
 *                     - permissionIds
 *                   properties:
 *                     activityId:
 *                       type: string
 *                       description: UUID of the activity
 *                       example: "f56e95af-7d43-4a23-90b3-9d94882a4c55"
 *                     permissionIds:
 *                       type: array
 *                       description: List of permission UUIDs for this activity
 *                       items:
 *                         type: string
 *                       example: ["p1", "p2"]
 *     responses:
 *       200:
 *         description: Permissions successfully assigned/updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 data:
 *                   type: null
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: Permissions updated successfully
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
activityPermissionRouter.post(
  "/",
  authenticateUser,
  activityPermissionsController.createORupdateActivityPermission
);

export default activityPermissionRouter;
