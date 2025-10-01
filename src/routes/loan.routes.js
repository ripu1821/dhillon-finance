import express from "express";
import loanController from "../controllers/loan.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
// import { createLoanSchema, updateLoanSchema } from "../schemas/loan.schema.js";
// import validateSchema from "../middlewares/validationMiddleware.js";

const loanRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Loans
 *   description: Loan management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Loan:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         customerId:
 *           type: string
 *           format: uuid
 *         amount:
 *           type: number
 *         interestRate:
 *           type: number
 *         tenureMonths:
 *           type: integer
 *         emiAmount:
 *           type: number
 *         totalPayableAmount:
 *           type: number
 *         startDate:
 *           type: string
 *           format: date
 *         endDate:
 *           type: string
 *           format: date
 *         description:
 *           type: string
 *         status:
 *           type: string
 *         installmentDate:
 *           type: string
 *           format: date
 *         nextEmiAmount:
 *           type: number
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /loan:
 *   post:
 *     summary: Create a new loan
 *     tags: [Loans]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/Loan" }
 *     responses:
 *       201:
 *         description: Loan created
 */
loanRouter.post(
  "/",
  authenticateUser,
  // validateSchema(createLoanSchema),
  loanController.createLoan
);

/**
 * @swagger
 * /loan:
 *   get:
 *     summary: Get list of loans with pagination, search, and filters
 *     tags: [Loans]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema: { type: string }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: sortBy
 *         schema: { type: string, default: "createdAt" }
 *       - in: query
 *         name: order
 *         schema: { type: string, default: "DESC" }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: List of loans
 */
loanRouter.get("/", authenticateUser, loanController.getLoans);

/**
 * @swagger
 * /loan/{id}:
 *   get:
 *     summary: Get loan by ID
 *     tags: [Loans]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Loan fetched
 */
loanRouter.get("/:id", authenticateUser, loanController.getLoanById);

/**
 * @swagger
 * /loan/{id}:
 *   put:
 *     summary: Update loan
 *     tags: [Loans]
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
 *           schema: { $ref: "#/components/schemas/Loan" }
 *     responses:
 *       200:
 *         description: Loan updated
 */
loanRouter.put(
  "/:id",
  authenticateUser,
  // validateSchema(updateLoanSchema),
  loanController.updateLoan
);

/**
 * @swagger
 * /loan/{id}:
 *   delete:
 *     summary: Delete loan
 *     tags: [Loans]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Loan deleted
 */
loanRouter.delete("/:id", authenticateUser, loanController.deleteLoan);

export default loanRouter;
