/**
 * Country Router
 */

import express from "express";
import CountryController from "../controllers/country.controller.js";
import {
  createCountrySchema,
  updateCountrySchema,
  updateCountryStatusSchema,
} from "../schemas/country.schema.js";
import validateSchema from "../middlewares/validationMiddleware.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const countryRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Countries
 *   description: Country management APIs
 */

/**
 * @swagger
 * /country:
 *   get:
 *     summary: Get all countries
 *     tags: [Countries]
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
 *         description: Countries fetched successfully
 */
countryRouter.get("/", authenticateUser, CountryController.getCountryList);

/**
 * @swagger
 * /country/{id}:
 *   get:
 *     summary: Get country by ID
 *     tags: [Countries]
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
 *         description: Country fetched successfully
 */
countryRouter.get("/:id", authenticateUser, CountryController.getCountryById);

/**
 * @swagger
 * /country:
 *   post:
 *     summary: Create new country
 *     tags: [Countries]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateCountry'
 *     responses:
 *       201:
 *         description: Country created successfully
 */
countryRouter.post(
  "/",
  authenticateUser,
  validateSchema(createCountrySchema),
  CountryController.createCountry
);

/**
 * @swagger
 * /country/{id}:
 *   put:
 *     summary: Update country
 *     tags: [Countries]
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
 *             $ref: '#/components/schemas/UpdateCountry'
 *     responses:
 *       200:
 *         description: Country updated successfully
 */
countryRouter.put(
  "/:id",
  authenticateUser,
  validateSchema(updateCountrySchema),
  CountryController.updateCountry
);

/**
 * @swagger
 * /country/{id}/status:
 *   patch:
 *     summary: Update country status
 *     tags: [Countries]
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
 *             $ref: '#/components/schemas/UpdateCountryStatus'
 *     responses:
 *       200:
 *         description: Country status updated successfully
 */
countryRouter.patch(
  "/:id/status",
  authenticateUser,
  validateSchema(updateCountryStatusSchema),
  CountryController.updateCountryStatus
);

/**
 * @swagger
 * /country/{id}:
 *   delete:
 *     summary: Delete country by ID
 *     tags: [Countries]
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
 *         description: Country deleted successfully
 *       404:
 *         description: Country not found
 */
countryRouter.delete("/:id", authenticateUser, CountryController.deleteCountry);

export default countryRouter;
