/**
 * Audit model
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import UserModel from "./user.model.js";

const ActivityPermissionModel = sequelize.define(
  "ActivityPermission",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    activityId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "activities",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
    permissionIds: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    roleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "roles",
        key: "id",
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
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
    tableName: "activityPermissions",
  }
);

/**
 * Associations
 */
ActivityPermissionModel.belongsTo(UserModel, {
  foreignKey: "createdBy",
  as: "createdByUser",
});

ActivityPermissionModel.belongsTo(UserModel, {
  foreignKey: "updatedBy",
  as: "updatedByUser",
});

ActivityPermissionModel.belongsTo(UserModel, {
  foreignKey: "deletedBy",
  as: "deletedByUser",
});

export default ActivityPermissionModel;
