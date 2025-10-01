/**
 * Customer model
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import UploadFileModel from "./uploadFile.model.js";
import { CUSTOMER_STATUS_ENUM } from "../utils/constants/index.js";

const CustomerModel = sequelize.define(
  "Customer",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    mobileNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    pinCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    aadharNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    panCardNumber: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    vehicleNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    aadharImage: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: UploadFileModel,
      },
    },
    panCardImage: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: UploadFileModel,
      },
    },
    agreementImage: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: UploadFileModel,
      },
    },
    profileImage: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: UploadFileModel,
      },
    },
    otherImage: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: UploadFileModel,
      },
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    status: {
      type: DataTypes.ENUM(...CUSTOMER_STATUS_ENUM),
      allowNull: true,
      defaultValue: "Active",
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "customers",
  }
);

export default CustomerModel;
