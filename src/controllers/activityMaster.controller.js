/**
 * ActivityMaster Controller
 */

import { Op } from "sequelize";
import sequelize from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { trimRequestBody } from "../utils/trimRequestBody.js";
import ActivityMasterModel from "../models/activityMaster.model.js";
import { responseMessage } from "../utils/responseMessage.js";

// Create Activity
const createActivity = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    req.body = trimRequestBody(req.body);
    const { name } = req.body;

    const existing = await ActivityMasterModel.findOne({ where: { name } });
    if (existing) {
      await transaction.rollback();
      return next(new ApiError(400, responseMessage.alreadyExists("Activity")));
    }

    const createdBy = req.user?.id || null;
    const activity = await ActivityMasterModel.create(
      { ...req.body, createdBy },
      { transaction }
    );

    await transaction.commit();
    return res
      .status(201)
      .json(
        new ApiResponse(201, activity, responseMessage.created("Activity"))
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

// Get Activity List (pagination + search)
const getActivityList = asyncHandler(async (req, res, next) => {
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
      where[Op.or] = [{ name: { [Op.like]: `%${name}%` } }];
    }

    const totalItems = await ActivityMasterModel.count({ where });
    const activities = await ActivityMasterModel.findAll({
      where,
      offset: (pageNumber - 1) * pageSize,
      limit: pageSize,
      order: [[sortBy, sortOrder]],
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          activities,
          page: pageNumber,
          limit: pageSize,
          totalItems,
          totalPages: Math.ceil(totalItems / pageSize),
        },
        responseMessage.fetched("Activities")
      )
    );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

// Get Activity By ID
const getActivityById = asyncHandler(async (req, res, next) => {
  try {
    const activity = await ActivityMasterModel.findByPk(req.params.id);
    if (!activity) {
      return next(new ApiError(404, responseMessage.notFound("Activity")));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, activity, responseMessage.fetched("Activity"))
      );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

// Update Activity
const updateActivity = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const activity = await ActivityMasterModel.findByPk(req.params.id);
    if (!activity) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("Activity")));
    }

    req.body = trimRequestBody(req.body);
    const updatedBy = req.user?.id || null;
    await activity.update({ ...req.body, updatedBy }, { transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(
        new ApiResponse(200, activity, responseMessage.updated("Activity"))
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

// Update Activity Status
const updateActivityStatus = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const activity = await ActivityMasterModel.findByPk(req.params.id);
    if (!activity) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("Activity")));
    }

    activity.status = req.body.status;
    activity.updatedBy = req.user?.id || null;
    await activity.save({ transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          activity,
          responseMessage.statusUpdated("Activity")
        )
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

// Delete Activity
const deleteActivity = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const activity = await ActivityMasterModel.findByPk(req.params.id);
    if (!activity) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("Activity")));
    }

    await activity.destroy({ force: true, transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(new ApiResponse(200, null, responseMessage.deleted("Activity")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

export default {
  createActivity,
  getActivityList,
  getActivityById,
  updateActivity,
  updateActivityStatus,
  deleteActivity,
};
