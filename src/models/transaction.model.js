/**
 * Transaction model
 */

import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";
import LoanModel from "./loan.model.js";
import CustomerModel from "./customer.model.js";
import {
  TRANSACTION_PAYMENT_MODE_ENUM,
  TRANSACTION_TYPE_ENUM,
} from "../utils/constants/index.js";

const TransactionModel = sequelize.define(
  "Transaction",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },

    loanId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: LoanModel,
        key: "id",
      },
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
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },

    transactionType: {
      type: DataTypes.ENUM(...TRANSACTION_TYPE_ENUM), // Loan given / Client paid
      allowNull: false,
    },

    paymentMode: {
      type: DataTypes.ENUM(...TRANSACTION_PAYMENT_MODE_ENUM),
      allowNull: true,
    },

    transactionDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    paranoid: true,
    tableName: "transactions",
  }
);

export default TransactionModel;
