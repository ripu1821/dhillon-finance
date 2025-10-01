/**
 * State Router
 */

import express from "express";
import StateController from "../controllers/state.controller.js";
import {
  createStateSchema,
  updateStateSchema,
} from "../schemas/state.schema.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import {
  authenticateUser,
  authorizeUser,
} from "../middlewares/authMiddleware.js";

const stateRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: States
 *   description: State management APIs
 */

/**
 * @swagger
 * /state:
 *   get:
 *     summary: Get all states
 *     tags: [States]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: countryId
 *         schema:
 *           type: string
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
 *         description: States fetched successfully
 */
stateRouter.get("/", authenticateUser, StateController.getStateList);

/**
 * @swagger
 * /state/{id}:
 *   get:
 *     summary: Get state by ID
 *     tags: [States]
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
 *         description: State fetched successfully
 */
stateRouter.get("/:id", authenticateUser, StateController.getStateById);

/**
 * @swagger
 * /state:
 *   post:
 *     summary: Create new state
 *     tags: [States]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateState'
 *     responses:
 *       201:
 *         description: State created successfully
 */
stateRouter.post(
  "/",
  authenticateUser,
  validateSchema(createStateSchema),
  StateController.createState
);

/**
 * @swagger
 * /state/{id}:
 *   put:
 *     summary: Update state
 *     tags: [States]
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
 *             $ref: '#/components/schemas/UpdateState'
 *     responses:
 *       200:
 *         description: State updated successfully
 */
stateRouter.put(
  "/:id",
  authenticateUser,
  validateSchema(updateStateSchema),
  StateController.updateState
);

/**
 * @swagger
 * /state/{id}:
 *   delete:
 *     summary: Delete state by ID
 *     tags: [States]
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
 *         description: State deleted successfully
 *       404:
 *         description: State not found
 */
stateRouter.delete("/:id", authenticateUser, StateController.deleteState);

export default stateRouter;
