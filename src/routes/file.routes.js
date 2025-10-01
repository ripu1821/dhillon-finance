/**
 * File routes
 */
import express from "express";
import fileUploadController from "../controllers/file.controller.js";
import { uploadImage } from "../middlewares/multer.middleware.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: File
 *   description: File Management API
 */

/**
 * @swagger
 * /file:
 *   post:
 *     summary: Upload a image
 *     tags: [File]
 *     security:
 *      - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
router.post(
  "/",
  authenticateUser,
  uploadImage("file"),
  fileUploadController.uploadFile
);

/**
 * @swagger
 * /file/{id}:
 *   get:
 *     summary: Get a file by Id
 *     tags: [File]
 *     security:
 *      - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: File retrieved successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *           image/png:
 *             schema:
 *               type: string
 *               format: binary
 *           image/jpeg:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: File not found
 *       500:
 *         description: Internal Server Error
 */

router.get("/:id", authenticateUser, fileUploadController.getFileById);

/**
 * @swagger
 * /file/url/all:
 *   get:
 *     summary: Get all uploaded files
 *     tags: [File]
 *     security:
 *      - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of all files
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   image:
 *                     type: string
 *                   imageKey:
 *                     type: string
 *                   isActive:
 *                     type: boolean
 *                   createdAt:
 *                     type: string
 *                   updatedAt:
 *                     type: string
 *       500:
 *         description: Internal Server Error
 */
router.get("/url/all", authenticateUser, fileUploadController.getAllFiles);

export default router;
