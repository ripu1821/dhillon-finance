/**
 * ActivityMaster Router
 */

import express from "express";
import ActivityMasterController from "../controllers/activityMaster.controller.js";
import {
  createActivitySchema,
  updateActivitySchema,
  updateActivityStatusSchema,
} from "../schemas/activityMaster.schema.js";
import validateSchema from "../middlewares/validationMiddleware.js";

const activityRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Activities
 *   description: Activity management APIs
 */

/**
 * @swagger
 * /activity:
 *   get:
 *     summary: Get all activities
 *     tags: [Activities]
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
 *         description: Activities fetched successfully
 */
activityRouter.get("/", ActivityMasterController.getActivityList);

/**
 * @swagger
 * /activity/{id}:
 *   get:
 *     summary: Get activity by ID
 *     tags: [Activities]
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
 *         description: Activity fetched successfully
 */
activityRouter.get("/:id", ActivityMasterController.getActivityById);

/**
 * @swagger
 * /activity:
 *   post:
 *     summary: Create new activity
 *     tags: [Activities]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateActivity'
 *     responses:
 *       201:
 *         description: Activity created successfully
 */
activityRouter.post(
  "/",
  validateSchema(createActivitySchema),
  ActivityMasterController.createActivity
);

/**
 * @swagger
 * /activity/{id}:
 *   put:
 *     summary: Update activity
 *     tags: [Activities]
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
 *             $ref: '#/components/schemas/UpdateActivity'
 *     responses:
 *       200:
 *         description: Activity updated successfully
 */
activityRouter.put(
  "/:id",
  validateSchema(updateActivitySchema),
  ActivityMasterController.updateActivity
);

/**
 * @swagger
 * /activity/{id}/status:
 *   patch:
 *     summary: Update activity status
 *     tags: [Activities]
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
 *             $ref: '#/components/schemas/UpdateActivityStatus'
 *     responses:
 *       200:
 *         description: Activity status updated successfully
 */
activityRouter.patch(
  "/:id/status",
  validateSchema(updateActivityStatusSchema),
  ActivityMasterController.updateActivityStatus
);

/**
 * @swagger
 * /activity/{id}:
 *   delete:
 *     summary: Delete activity by ID
 *     tags: [Activities]
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
 *         description: Activity deleted successfully
 *       404:
 *         description: Activity not found
 */
activityRouter.delete("/:id", ActivityMasterController.deleteActivity);

export default activityRouter;
