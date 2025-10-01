/**
 * Upload File model
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const UploadFileModel = sequelize.define(
  "UploadFile",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageKey: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    updatedAt: false,
    paranoid: true,
    tableName: "uploadFiles",
  }
);
export default UploadFileModel;

/**
 * @swagger
 * components:
 *   schemas:
 *     UploadFile:
 *       type: object
 *       required:
 *         - fileName
 *         - type
 *         - originalName
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier of the Upload File
 *         image:
 *           type: string
 *         imageKey:
 *           type: string
 *         isActive:
 *           type: boolean
 *
 */
