/**
 * Permission Master Controller
 */

import { Op } from "sequelize";
import sequelize from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { trimRequestBody } from "../utils/trimRequestBody.js";
import PermissionModel from "../models/permission.model.js";
import { responseMessage } from "../utils/responseMessage.js";

/**
 * Create Permission
 */
const createPermission = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    req.body = trimRequestBody(req.body);
    const { name, description, status } = req.body;

    const existing = await PermissionModel.findOne({ where: { name } });
    if (existing) {
      await transaction.rollback();
      return next(
        new ApiError(400, responseMessage.alreadyExists("Permissions"))
      );
    }

    // const createdBy = req.user.id;
    const permission = await PermissionModel.create(
      { name, description, status },
      { transaction }
    );

    await transaction.commit();
    return res
      .status(201)
      .json(
        new ApiResponse(201, permission, responseMessage.created("Permissions"))
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

/**
 * Get Permission List
 */
const getPermissionList = asyncHandler(async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "DESC",
      name = "",
    } = req.query;

    const pageNumber = parseInt(page, 10);
    const pageSize = parseInt(limit, 10);

    const where = {};
    if (name) {
      where[Op.or] = [
        { name: { [Op.like]: `%${name}%` } },
        { description: { [Op.like]: `%${name}%` } },
      ];
    }

    const count = await PermissionModel.count({ where });

    const permissions = await PermissionModel.findAll({
      where,
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize,
      order: [[sortBy, sortOrder]],
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          permissions,
          page: pageNumber,
          limit: pageSize,
          currentPageItems: permissions.length,
          totalPages: Math.ceil(count / pageSize),
          totalItems: count,
          previousPage: pageNumber > 1,
          nextPage: pageNumber * pageSize < count,
        },
        responseMessage.fetched("Permissions")
      )
    );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

/**
 * Get Permission By ID
 */
const getPermissionById = asyncHandler(async (req, res, next) => {
  try {
    const permission = await PermissionModel.findByPk(req.params.id);
    if (!permission) {
      return next(new ApiError(404, responseMessage.notFound("Permission")));
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, permission, responseMessage.fetched("Permissions"))
      );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

/**
 * Update Permission
 */
const updatePermission = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const permission = await PermissionModel.findByPk(id);

    if (!permission) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("Permission")));
    }

    req.body = trimRequestBody(req.body);
    const updatedData = {
      ...req.body,
      // updatedBy: req.user.id
    };

    await permission.update(updatedData, { transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(
        new ApiResponse(200, permission, responseMessage.updated("Permissions"))
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

/**
 * Update Permission Status
 */
const updatePermissionStatus = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    const { status } = req.body;

    const permission = await PermissionModel.findByPk(id);
    if (!permission) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("Permission")));
    }

    permission.status = status;
    permission.updatedBy = req.user.id;
    await permission.save({ transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          permission,
          responseMessage.statusUpdated("Permissions")
        )
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

/**
 * Delete Permission
 */
const deletePermission = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const permission = await PermissionModel.findByPk(req.params.id);
    if (!permission) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("Permission")));
    }

    await permission.destroy({ force: true, transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(new ApiResponse(200, null, responseMessage.deleted("Permissions")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

export default {
  createPermission,
  getPermissionList,
  getPermissionById,
  updatePermission,
  updatePermissionStatus,
  deletePermission,
};
