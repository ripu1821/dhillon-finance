/**
 * District Router
 */

import express from "express";
import DistrictController from "../controllers/district.controller.js";
import {
  createDistrictSchema,
  updateDistrictSchema,
} from "../schemas/district.schema.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import {
  authenticateUser,
  authorizeUser,
} from "../middlewares/authMiddleware.js";

const districtRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Districts
 *   description: District management APIs
 */

/**
 * @swagger
 * /district:
 *   get:
 *     summary: Get all districts
 *     tags: [Districts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: name
 *         schema: { type: string }
 *       - in: query
 *         name: stateId
 *         schema: { type: string }
 *       - in: query
 *         name: countryId
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Districts fetched successfully
 */
districtRouter.get("/", authenticateUser, DistrictController.getDistrictList);

/**
 * @swagger
 * /district/{id}:
 *   get:
 *     summary: Get district by ID
 *     tags: [Districts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema: { type: string }
 *         required: true
 *     responses:
 *       200:
 *         description: District fetched successfully
 */
districtRouter.get(
  "/:id",
  authenticateUser,
  DistrictController.getDistrictById
);

/**
 * @swagger
 * /district:
 *   post:
 *     summary: Create new district
 *     tags: [Districts]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateDistrict'
 *     responses:
 *       201:
 *         description: District created successfully
 */
districtRouter.post(
  "/",
  authenticateUser,
  validateSchema(createDistrictSchema),
  DistrictController.createDistrict
);

/**
 * @swagger
 * /district/{id}:
 *   put:
 *     summary: Update district
 *     tags: [Districts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateDistrict'
 *     responses:
 *       200:
 *         description: District updated successfully
 */
districtRouter.put(
  "/:id",
  authenticateUser,
  validateSchema(updateDistrictSchema),
  DistrictController.updateDistrict
);

/**
 * @swagger
 * /district/{id}:
 *   delete:
 *     summary: Delete district by ID
 *     tags: [Districts]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: District deleted successfully
 */
districtRouter.delete(
  "/:id",
  authenticateUser,
  DistrictController.deleteDistrict
);

export default districtRouter;
