"use strict";
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

module.exports = {
  async up({ context: queryInterface, context: { sequelize } }) {
    await sequelize.transaction(async (transaction) => {
      /** Create Roles **/
      const roleNames = ["Admin", "Co Admin"];
      const roles = roleNames.map((name) => ({
        id: uuidv4(),
        name,
        description: name,
        isActive: true,
        isSystemLogin: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await queryInterface.bulkInsert("roles", roles, { transaction });

      /** Create Permissions **/
      const permissionNames = [
        "VIEW LIST",
        "CREATE",
        "EDIT",
        "DELETE",
        "VIEW DETAILS",
        "PRINT",
        "DOWNLOAD",
      ];

      const permissions = permissionNames.map((name) => ({
        id: uuidv4(),
        name,
        description: name,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await queryInterface.bulkInsert("permissions", permissions, {
        transaction,
      });

      /** Create Activities **/
      const activityNames = [
        "DASHBOARD",
        "CUSTOMER",
        "LOAN",
        "TRANSACTION",
        "USER",
      ];

      const activities = activityNames.map((name) => ({
        id: uuidv4(),
        name,
        status: "Active",
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await queryInterface.bulkInsert("activities", activities, {
        transaction,
      });

      /** Assign all permissions to Admin for all activities **/
      const adminRole = roles.find((r) => r.name === "Admin");

      const activityPermissions = activities.map((activity) => ({
        id: uuidv4(),
        activityId: activity.id,
        permissionIds: JSON.stringify(permissions.map((p) => p.id)),
        roleId: adminRole.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));

      await queryInterface.bulkInsert(
        "activityPermissions",
        activityPermissions,
        { transaction }
      );

      /** Create default Admin user **/
      const hashedPassword = await bcrypt.hash("Test@1234", 10);

      const users = [
        {
          id: uuidv4(),
          userName: "Admin User",
          email: "ravikumar62843@gmail.com",
          roleId: adminRole.id,
          mobileNumber: "9657643786",
          password: hashedPassword,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      await queryInterface.bulkInsert("users", users, { transaction });
    });
  },

  async down({ context: queryInterface, context: { sequelize } }) {
    await sequelize.transaction(async (transaction) => {
      await queryInterface.bulkDelete("users", null, { transaction });
      await queryInterface.bulkDelete("activityPermissions", null, {
        transaction,
      });
      await queryInterface.bulkDelete("activities", null, { transaction });
      await queryInterface.bulkDelete("permissions", null, { transaction });
      await queryInterface.bulkDelete("roles", null, { transaction });
    });
  },
};
