/**
 * @format
 * AWS S3 Configuration
 */

import {
  PutObjectCommand,
  S3Client,
  GetObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import fs from "fs";

/**
 * Upload file to S3 bucket
 * @param {Object} file
 * @param {string} folderName
 * @returns {Promise<{presignedUrl: string, fileName: string}>}
 */
async function s3UploadFile(file, folderName) {
  try {
    const s3Client = new S3Client({
      credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      },
      region: process.env.AWS_REGION,
    });

    const fileName = `${uuidv4()}-${file.originalname}`;
    const fileKey = `${folderName}/${fileName}`;

    // Use fs.createReadStream for diskStorage files
    const fileStream = fs.createReadStream(file.path);

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
      Body: fileStream,
      ContentType: file.mimetype,
    };

    // Upload to S3
    await s3Client.send(new PutObjectCommand(params));

    // Delete the local file after successful upload
    fs.unlink(file.path, (err) => {
      if (err) console.error("Failed to delete local file:", err);
      else console.log("Local file deleted:", file.path);
    });

    // Generate presigned URL
    const getObjectCommand = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: fileKey,
    });

    const presignedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 604800, // 7 days
    });

    return { presignedUrl, fileName };
  } catch (error) {
    console.error("S3 Upload Error:", error);
    throw error;
  }
}

/**
 * Regenerate path of image which already saved
 * @param {string} fileName
 * @param {string} folderName
 * @returns {Promise<string>}
 */
async function s3getUploadedFile(fileName, folderName) {
  try {
    const filePath = `${folderName}/${fileName}`;
    const s3Client = new S3Client({
      credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      },
      region: process.env.AWS_REGION,
    });

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: filePath,
    };

    const getObjectCommand = new GetObjectCommand(params);

    // Generate the signed URL
    const presignedUrl = await getSignedUrl(s3Client, getObjectCommand, {
      expiresIn: 604800, // 7 days
    });

    return presignedUrl;
  } catch (error) {
    console.error("S3 Get File Error:", error);
    throw error;
  }
}

/**
 * Check image url expire or not
 * @param {string} presignedUrl
 * @returns {boolean}
 */
function checkImageUrlExpired(presignedUrl) {
  const urlComponents = presignedUrl.match(/X-Amz-Expires=(\d+)/);
  if (!urlComponents) {
    return true;
  }

  const expirationInSeconds = parseInt(urlComponents[1], 10);
  const queryString = presignedUrl.split("?")[1];

  // Parse the query string into an object
  const queryParams = new URLSearchParams(queryString);
  // Get the value of the X-Amz-Date parameter
  const amzDate = queryParams.get("X-Amz-Date");

  if (!amzDate) return true;

  const convertedTimestamp = amzDate.replace(
    /(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/,
    "$1-$2-$3T$4:$5:$6Z"
  );

  const expirationTime = new Date(convertedTimestamp);
  expirationTime.setSeconds(expirationTime.getSeconds() + expirationInSeconds);

  const currentTime = new Date();
  return currentTime > expirationTime;
}

/**
 * List all files from S3 bucket (console.log all)
 */
async function listAllS3Files(folderName = "uploads") {
  try {
    const s3Client = new S3Client({
      credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      },
      region: process.env.AWS_REGION,
    });

    const command = new ListObjectsV2Command({
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Prefix: folderName + "/",
    });

    const response = await s3Client.send(command);

    if (response.Contents) {
      response.Contents.forEach((file, index) => {
        console.log(
          `AWS File ${index + 1}: ${file.Key} (Size: ${file.Size} bytes)`
        );
      });
      return response.Contents; // return array of S3 files
    } else {
      console.log("No files found in S3 bucket.");
      return [];
    }
  } catch (error) {
    console.error("Error listing S3 files:", error);
    return [];
  }
}

/**
 * Delete a file from S3 bucket
 * @param {string} key - file name or key
 * @param {string} folderName
 */

/**
 * Delete file from S3 bucket
 */
async function s3DeleteFile(key, folderName) {
  try {
    const s3Client = new S3Client({
      credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      },
      region: process.env.AWS_REGION,
    });

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `${folderName}/${key}`,
      })
    );

  } catch (error) {
    console.error(`Error deleting S3 file ${folderName}/${key}:`, error);
    throw error;
  }
}

export {
  s3UploadFile,
  s3getUploadedFile,
  checkImageUrlExpired,
  listAllS3Files,
  s3DeleteFile,
};
