import express from "express";
import RoleController from "../controllers/role.controller.js";
import {
  createRoleSchema,
  updateRoleSchema,
  updateRoleStatusSchema,
} from "../schemas/role.schema.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import {
  authenticateUser,
  authorizeUser,
} from "../middlewares/authMiddleware.js";

const roleRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Role management APIs
 */

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Roles fetched successfully
 */
roleRouter.get(
  "/",
  authenticateUser,
  authorizeUser("VIEW LIST", "ROLE"),
  RoleController.getRoleList
);

/**
 * @swagger
 * /role/{id}:
 *   get:
 *     summary: Get role by ID
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Role fetched successfully
 */
roleRouter.get("/:id", authenticateUser, RoleController.getRoleById);

/**
 * @swagger
 * /role:
 *   post:
 *     summary: Create new role
 *     tags: [Roles]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRole'
 *     responses:
 *       201:
 *         description: Role created successfully
 */
roleRouter.post(
  "/",
  authenticateUser,
  validateSchema(createRoleSchema),
  RoleController.createRole
);

/**
 * @swagger
 * /role/{id}:
 *   put:
 *     summary: Update role
 *     tags: [Roles]
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
 *             $ref: '#/components/schemas/UpdateRole'
 *     responses:
 *       200:
 *         description: Role updated successfully
 */
roleRouter.put(
  "/:id",
  authenticateUser,
  validateSchema(updateRoleSchema),
  RoleController.updateRole
);

/**
 * @swagger
 * /role/{id}/status:
 *   patch:
 *     summary: Update role status
 *     tags: [Roles]
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
 *             $ref: '#/components/schemas/UpdateRoleStatus'
 *     responses:
 *       200:
 *         description: Role status updated successfully
 */
roleRouter.patch(
  "/:id/status",
  authenticateUser,
  validateSchema(updateRoleStatusSchema),
  RoleController.updateRoleStatus
);

/**
 * @swagger
 * /role/{id}:
 *   delete:
 *     summary: Delete role by ID
 *     tags: [Roles]
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
 *         description: Role deleted successfully
 *       404:
 *         description: Role not found
 */
roleRouter.delete("/:id", authenticateUser, RoleController.deleteRole);

export default roleRouter;
