import sequelize from "../config/db.js";
import { Op } from "sequelize";
import { asyncHandler } from "../utils/asyncHandler.js";
import ActivityPermissionModel from "../models/activityPermission.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { responseMessage } from "../utils/responseMessage.js";
import ActivityMasterModel from "../models/activityMaster.model.js";
import { emitSocketEvent } from "../socket/index.js";
import { ChatEventEnum } from "../utils/constants/index.js";
import RoleModel from "../models/role.model.js";
import PermissionModel from "../models/permission.model.js";

/**
 * Assign Role Permissions to Activities
 */
const createORupdateActivityPermission = asyncHandler(
  async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
      const { roleId, activities } = req.body;

      if (!roleId || !activities || !Array.isArray(activities)) {
        await transaction.rollback();
        return res
          .status(400)
          .json(
            new ApiResponse(
              400,
              null,
              responseMessage.required("roleId and activities are")
            )
          );
      }

      // 1. Remove all existing mappings for this role
      await ActivityPermissionModel.destroy({
        where: { roleId },
        transaction,
      });

      // 2. Prepare new records (skip empty permissions)
      const records = activities
        .filter(
          (act) =>
            Array.isArray(act.permissionIds) && act.permissionIds.length > 0
        )
        .map((act) => ({
          roleId,
          activityId: act.activityId,
          permissionIds: act.permissionIds,
        }));

      // 3. Insert fresh
      if (records.length > 0) {
        await ActivityPermissionModel.bulkCreate(records, { transaction });
      }

      // Emit socket event to all clients (broadcast)
      emitSocketEvent(req, ChatEventEnum.ACTIVITY_PERMISSION_UPDATED_EVENT, {
        message: "Permission updated",
      });
      await transaction.commit();
      return res
        .status(200)
        .json(
          new ApiResponse(200, null, responseMessage.updated("Permissions"))
        );
    } catch (err) {
      await transaction.rollback();
      next(new ApiError(500, err.message));
    }
  }
);

/**
 * Get Role Permissions (all activities + permissions for role)
 */
const getRolePermissions = asyncHandler(async (req, res, next) => {
  try {
    const { roleId } = req.params;

    if (!roleId) {
      return res
        .status(400)
        .json(
          new ApiResponse(400, null, responseMessage.required("roleId is"))
        );
    }

    // 1. Fetch raw activity-permission records with role and activity info
    const activityPermsRaw = await ActivityPermissionModel.findAll({
      where: { roleId: roleId },
      include: [
        { model: RoleModel, as: "role", attributes: ["id", "name"] },
        {
          model: ActivityMasterModel,
          as: "activity",
          attributes: ["id", "name"],
        },
      ],
      raw: true,
      nest: true,
    });

    // 2. Aggregate all permission ID arrays into a unique list
    const allPermissionIds = activityPermsRaw.flatMap((item) =>
      Array.isArray(item.permissionIds) ? item.permissionIds : []
    );
    const uniquePermissionIds = [...new Set(allPermissionIds)];

    // 3. Fetch permission records from permission master table
    const permissionRecords = await PermissionModel.findAll({
      where: { id: uniquePermissionIds },
      attributes: ["id", "name"],
    });

    // 4. Build a lookup map: permission ID → permission name
    const idToNameMap = {};
    permissionRecords.forEach(({ id, name }) => {
      idToNameMap[id] = name;
    });

    // 5. Transform original array: replace IDs with names
    const permissions = activityPermsRaw.map((item) => {
      const permIds = Array.isArray(item.permissionIds)
        ? item.permissionIds
        : [];
      const permissionNames = permIds
        .map((id) => idToNameMap[id])
        .filter(Boolean);

      return {
        id: item.id,
        activity: item.activity,
        permissionNames,
      };
    });

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          permissions,
          responseMessage.fetched("Permissions")
        )
      );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

const getActivityPermissionsByRoleId = asyncHandler(async (req, res, next) => {
  const { roleId } = req.params;

  if (!roleId) {
    return next(new ApiError(400, responseMessage.required("roleId is")));
  }

  const rows = await ActivityPermissionModel.findAll({
    where: { roleId },
    attributes: ["id", "activityId", "permissionIds"],
    include: [
      {
        model: ActivityMasterModel,
        as: "activity",
        attributes: ["id", "name", "status"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        roleId,
        activities: rows.map((r) => ({
          id: r.id,
          activityId: r.activityId,
          // activityName: r.activity?.name ?? null,
          status: r.activity?.status ?? null,
          permissionIds: r.permissionIds ?? [],
        })),
      },
      responseMessage.fetched("Activity permissions")
    )
  );
});

export default {
  createORupdateActivityPermission,
  getRolePermissions,
  getActivityPermissionsByRoleId,
};
