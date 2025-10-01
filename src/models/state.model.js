/**
 * State model
 */
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import UserModel from "./user.model.js";
import CountryModel from "./country.model.js";

const StateModel = sequelize.define(
  "State",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    countryId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "countries", key: "id" },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stateCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    latitude: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitude: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
    updatedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
    deletedBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
  },
  {
    tableName: "states",
    timestamps: true,
    paranoid: true,
  }
);

/**
 * Associations
 */
StateModel.belongsTo(CountryModel, { foreignKey: "countryId", as: "country" });
StateModel.belongsTo(UserModel, {
  foreignKey: "createdBy",
  as: "createdByUser",
});
StateModel.belongsTo(UserModel, {
  foreignKey: "updatedBy",
  as: "updatedByUser",
});
StateModel.belongsTo(UserModel, {
  foreignKey: "deletedBy",
  as: "deletedByUser",
});

export default StateModel;
