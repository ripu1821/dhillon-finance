/**
 * Permission Master model
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import UserModel from "./user.model.js";

const PermissionModel = sequelize.define(
  "Permission",
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
      unique: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
      allowNull: false,
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
    tableName: "permissions",
    timestamps: true,
    paranoid: true,
  }
);

/**
 * Associations
 */
PermissionModel.belongsTo(UserModel, {
  foreignKey: "createdBy",
  as: "createdByUser",
});

PermissionModel.belongsTo(UserModel, {
  foreignKey: "updatedBy",
  as: "updatedByUser",
});

PermissionModel.belongsTo(UserModel, {
  foreignKey: "deletedBy",
  as: "deletedByUser",
});

export default PermissionModel;
