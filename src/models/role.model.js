/**
 * Role model
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import UserModel from "./user.model.js";

const RoleModel = sequelize.define(
  "Role",
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
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    isSystemLogin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
  },
  {
    tableName: "roles",
    timestamps: true,
    paranoid: true,
  }
);

/**
 * Associations
 */
RoleModel.belongsTo(UserModel, {
  foreignKey: "createdBy",
  as: "createdByUser",
});

RoleModel.belongsTo(UserModel, {
  foreignKey: "updatedBy",
  as: "updatedByUser",
});

RoleModel.belongsTo(UserModel, {
  foreignKey: "deletedBy",
  as: "deletedByUser",
});

export default RoleModel;
