/**
 * District model
 */
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import UserModel from "./user.model.js";
import StateModel from "./state.model.js";
import CountryModel from "./country.model.js";

const DistrictModel = sequelize.define(
  "District",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    stateId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "states", key: "id" },
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
    tableName: "districts",
    timestamps: true,
    paranoid: true,
  }
);

/**
 * Associations
 */
DistrictModel.belongsTo(CountryModel, {
  foreignKey: "countryId",
  as: "country",
});
DistrictModel.belongsTo(StateModel, { foreignKey: "stateId", as: "state" });
DistrictModel.belongsTo(UserModel, {
  foreignKey: "createdBy",
  as: "createdByUser",
});
DistrictModel.belongsTo(UserModel, {
  foreignKey: "updatedBy",
  as: "updatedByUser",
});
DistrictModel.belongsTo(UserModel, {
  foreignKey: "deletedBy",
  as: "deletedByUser",
});

export default DistrictModel;
