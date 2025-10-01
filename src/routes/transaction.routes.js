import express from "express";
import transactionController from "../controllers/transaction.controller.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management APIs
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
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
 *         transactionType:
 *           type: string
 *           enum: ["Disbursement", "Repayment"]
 *         paymentMode:
 *           type: string
 *           enum: ["Cash", "Bank", "UPI", "Cheque"]
 *         transactionDate:
 *           type: string
 *           format: date
 *         description:
 *           type: string
 *         isActive:
 *           type: boolean
 */

/**
 * @swagger
 * /transaction:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: "#/components/schemas/Transaction" }
 *     responses:
 *       201:
 *         description: Transaction created
 */
router.post("/", authenticateUser, transactionController.createTransaction);

/**
 * @swagger
 * /transaction:
 *   get:
 *     summary: Get list of transactions with pagination, search, and filters
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: customerId
 *         schema: { type: string }
 *       - in: query
 *         name: loanId
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
 *         name: transactionType
 *         schema: { type: string, enum: ["Disbursement", "Repayment"] }
 *       - in: query
 *         name: paymentMode
 *         schema: { type: string, enum: ["Cash", "Bank", "UPI", "Cheque"] }
 *       - in: query
 *         name: startDate
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: endDate
 *         schema: { type: string, format: date }
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get("/", authenticateUser, transactionController.getTransactions);

/**
 * @swagger
 * /transaction/{id}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Transaction fetched
 */
router.get("/:id", authenticateUser, transactionController.getTransactionById);

/**
 * @swagger
 * /transaction/{id}:
 *   put:
 *     summary: Update transaction
 *     tags: [Transactions]
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
 *           schema: { $ref: "#/components/schemas/Transaction" }
 *     responses:
 *       200:
 *         description: Transaction updated
 */
router.put("/:id", authenticateUser, transactionController.updateTransaction);

/**
 * @swagger
 * /transaction/{id}:
 *   delete:
 *     summary: Delete transaction
 *     tags: [Transactions]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Transaction deleted
 */
router.delete(
  "/:id",
  authenticateUser,
  transactionController.deleteTransaction
);

export default router;
