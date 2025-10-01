/**
 * Role Controller
 */

import { Op } from "sequelize";
import sequelize from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { trimRequestBody } from "../utils/trimRequestBody.js";
import RoleModel from "../models/role.model.js";
import { responseMessage } from "../utils/responseMessage.js";

/**
 * Helper: get roleId by role name
 */
const getRoleIdByName = async (roleName) => {
  const role = await RoleModel.findOne({ where: { name: roleName } });
  if (!role) throw new Error(`Role not found: ${roleName}`);
  return role.id;
};

// Create Role
const createRole = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    req.body = trimRequestBody(req.body);
    const { name } = req.body;

    const existing = await RoleModel.findOne({ where: { name } });
    if (existing) {
      await transaction.rollback();
      return next(new ApiError(400, responseMessage.alreadyExists("Role")));
    }

    const createdBy = req.user?.id || null;
    const role = await RoleModel.create(
      { ...req.body, createdBy },
      { transaction }
    );

    await transaction.commit();
    return res
      .status(201)
      .json(new ApiResponse(201, role, responseMessage.created("Role")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

// Get Role List (pagination + search)
const getRoleList = asyncHandler(async (req, res, next) => {
  try {
    const {
      page,
      limit,
      sortBy = "createdAt",
      sortOrder = "DESC",
      name = "",
    } = req.query;

    const where = {};
    if (name) {
      where[Op.or] = [{ name: { [Op.like]: `%${name}%` } }];
    }

    let roles, totalItems, totalPages;

    if (page && limit) {
      // Pagination case
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      totalItems = await RoleModel.count({ where });
      roles = await RoleModel.findAll({
        where,
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
        order: [[sortBy, sortOrder]],
      });

      totalPages = Math.ceil(totalItems / pageSize);
    } else {
      // No pagination → return all records
      roles = await RoleModel.findAll({
        where,
        order: [[sortBy, sortOrder]],
      });
      totalItems = roles.length;
      totalPages = 1;
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          roles,
          page: page ? parseInt(page, 10) : null,
          limit: limit ? parseInt(limit, 10) : null,
          totalItems,
          totalPages,
        },
        responseMessage.fetched("Roles")
      )
    );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

// Get Role By ID
const getRoleById = asyncHandler(async (req, res, next) => {
  try {
    const role = await RoleModel.findByPk(req.params.id);
    if (!role) {
      return next(new ApiError(404, responseMessage.notFound("Role")));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, role, responseMessage.fetched("Role")));
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

// Update Role
const updateRole = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const role = await RoleModel.findByPk(req.params.id);
    if (!role) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("Role")));
    }

    req.body = trimRequestBody(req.body);
    const updatedBy = req.user?.id || null;
    await role.update({ ...req.body, updatedBy }, { transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(new ApiResponse(200, role, responseMessage.updated("Role")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

// Update Role Status
const updateRoleStatus = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const role = await RoleModel.findByPk(req.params.id);
    if (!role) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("Role")));
    }

    role.status = req.body.status;
    role.updatedBy = req.user?.id || null;
    await role.save({ transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(new ApiResponse(200, role, responseMessage.statusUpdated("Role")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

// Delete Role
const deleteRole = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const role = await RoleModel.findByPk(req.params.id);
    if (!role) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("Role")));
    }

    await role.destroy({ force: true, transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(new ApiResponse(200, null, responseMessage.deleted("Role")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

export default {
  createRole,
  getRoleList,
  getRoleById,
  updateRole,
  updateRoleStatus,
  deleteRole,
  getRoleIdByName,
};
