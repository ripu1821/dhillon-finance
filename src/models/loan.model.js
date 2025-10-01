/**
 * Loan model
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import CustomerModel from "./customer.model.js";
import { LOAN_STATUS_ENUM } from "../utils/constants/index.js";

const LoanModel = sequelize.define(
  "Loan",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: CustomerModel,
        key: "id",
      },
    },

    amount: {
      type: DataTypes.DECIMAL(12, 2), // loan amount
      allowNull: false,
    },

    interestRate: {
      type: DataTypes.DECIMAL(5, 2), // e.g. 12.50 %
      allowNull: false,
    },

    tenureMonths: {
      type: DataTypes.INTEGER, // total EMI months
      allowNull: false,
    },

    emiAmount: {
      type: DataTypes.DECIMAL(12, 2), // EMI per month
      allowNull: true,
    },

    totalPayableAmount: {
      type: DataTypes.DECIMAL(12, 2), // principal + interest (total repayment)
      allowNull: false,
    },

    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    endDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(...LOAN_STATUS_ENUM),
      allowNull: true,
      defaultValue: "Active",
    },
    installmentDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    nextEmiAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },

    pendingEmis: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    paidEmis: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "loans",
  }
);

export default LoanModel;
