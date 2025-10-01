/**
 * ActivityMaster model
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import UserModel from "./user.model.js";

const ActivityMasterModel = sequelize.define(
  "ActivityMaster",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    deletedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    // updatedAt: false,
    tableName: "activities",
  }
);

/**
 * Associations
 */
ActivityMasterModel.belongsTo(UserModel, {
  foreignKey: "createdBy",
  as: "createdByUser",
});

ActivityMasterModel.belongsTo(UserModel, {
  foreignKey: "updatedBy",
  as: "updatedByUser",
});

ActivityMasterModel.belongsTo(UserModel, {
  foreignKey: "deletedBy",
  as: "deletedByUser",
});

export default ActivityMasterModel;
