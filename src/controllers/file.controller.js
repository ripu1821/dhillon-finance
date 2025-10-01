import UploadFileModel from "../models/uploadFile.model.js";
import {
  checkImageUrlExpired,
  listAllS3Files,
  s3DeleteFile,
  s3UploadFile,
  s3getUploadedFile,
} from "../services/aws/s3.config.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

/**
 * Upload File to S3 and save to DB
 */
const uploadFile = asyncHandler(async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const file = req.file;

    // Upload to S3
    const { presignedUrl, fileName } = await s3UploadFile(
      file,
      process.env.FOLDER_NAME || "uploads"
    );

    // Save file record in DB
    const uploadedFile = await UploadFileModel.create({
      image: presignedUrl,
      imageKey: fileName,
      isActive: true,
    });

    return res
      .status(201)
      .json(
        new ApiResponse(201, uploadedFile, "File uploaded to S3 successfully")
      );
  } catch (error) {
    console.error("Upload File Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * Get File URL by ID
 */
const getFileById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;

    const fileRecord = await UploadFileModel.findOne({ where: { id } });
    if (!fileRecord) {
      return res.status(404).json({ message: "File not found" });
    }

    // Regenerate presigned URL if needed
    const presignedUrl = await s3getUploadedFile(
      fileRecord.imageKey,
      process.env.FOLDER_NAME || "uploads"
    );

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { url: presignedUrl },
          "File URL fetched successfully"
        )
      );
  } catch (error) {
    console.error("Get File Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

/**
 * Get All Files with refreshed URLs and delete extra S3 files
 */
const getAllFiles = asyncHandler(async (req, res) => {
  const folderName = process.env.FOLDER_NAME || "uploads";

  // List S3 files keys only
  const s3Files = (await listAllS3Files(folderName)).map((file) =>
    file.Key.replace(`${folderName}/`, "")
  );

  // Get DB files
  const dbFiles = await UploadFileModel.findAll({ where: { isActive: true } });
  const dbFileKeys = dbFiles.map((file) => file.imageKey);

  // Delete S3 files not in DB
  const filesToDelete = s3Files.filter((key) => !dbFileKeys.includes(key));
  for (const key of filesToDelete) await s3DeleteFile(key, folderName);

  // Refresh expired URLs
  const refreshedFiles = await Promise.all(
    dbFiles.map(async (file) => {
      if (checkImageUrlExpired(file.image)) {
        file.image = await s3getUploadedFile(file.imageKey, folderName);
        await file.save();
      }
      return file;
    })
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, refreshedFiles, "All files fetched successfully")
    );
});

// Refresh all customer files and clean up unused S3 files
const getAllFilesInternal = async () => {

  const folderName = process.env.FOLDER_NAME || "uploads";

  // List S3 files keys only
  const s3Files = (await listAllS3Files(folderName)).map((file) =>
    file.Key.replace(`${folderName}/`, "")
  );

  // Get DB files
  const dbFiles = await UploadFileModel.findAll({ where: { isActive: true } });
  const dbFileKeys = dbFiles.map((file) => file.imageKey);

  // Delete S3 files not in DB
  const filesToDelete = s3Files.filter((key) => !dbFileKeys.includes(key));
  for (const key of filesToDelete) await s3DeleteFile(key, folderName);

  // Refresh expired URLs
  const refreshedFiles = await Promise.all(
    dbFiles.map(async (file) => {
      if (checkImageUrlExpired(file.image)) {
        file.image = await s3getUploadedFile(file.imageKey, folderName);
        await file.save();
      }
      return file;
    })
  );

  return refreshedFiles;
};

export default { uploadFile, getFileById, getAllFiles, getAllFilesInternal };
