/**
 * multer Middleware for image/document upload (single folder)
 */

import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 } from "uuid";
import { ApiError } from "../utils/ApiError.js";

// Define the base uploads directory
const uploadBaseDir = path.join("uploads");

// Ensure the base directory exists
if (!fs.existsSync(uploadBaseDir)) {
  fs.mkdirSync(uploadBaseDir, { recursive: true });
}

// Storage configuration (all files go to the same folder)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadBaseDir);
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname).toLowerCase();
    const uniqueFilename = `${v4()}${fileExt}`;
    cb(null, uniqueFilename);
  },
});

// File validation
const imageFilter = (req, file, cb) => {
  const allowedImageTypes = /jpeg|jpg|png/;
  const extName = allowedImageTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedImageTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    return cb(new ApiError(400, "Only images (jpeg, jpg, png) are allowed"));
  }
};

const documentFilter = (req, file, cb) => {
  const allowedDocTypes = /pdf|msword|doc|docx/;
  const extName = allowedDocTypes.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimeType = allowedDocTypes.test(file.mimetype);

  if (extName && mimeType) {
    return cb(null, true);
  } else {
    return cb(new ApiError(400, "Only documents (pdf, doc, docx) are allowed"));
  }
};

// Multer configurations
const uploadImageConfig = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadDocumentConfig = multer({
  storage,
  fileFilter: documentFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Middleware
export const uploadImage = (fieldName) => (req, res, next) => {
  uploadImageConfig.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    else if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

export const uploadDocument = (fieldName) => (req, res, next) => {
  uploadDocumentConfig.single(fieldName)(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    else if (err) return res.status(400).json({ message: err.message });
    next();
  });
};

export const uploadMultiImage = (fieldName) => (req, res, next) => {
  uploadImageConfig.array(fieldName, 5)(req, res, (err) => {
    if (err instanceof multer.MulterError)
      return res.status(400).json({ message: `Multer error: ${err.message}` });
    else if (err) return res.status(400).json({ message: err.message });
    next();
  });
};
