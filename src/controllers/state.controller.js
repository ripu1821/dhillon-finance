/**
 * State Controller
 */

import { Op } from "sequelize";
import sequelize from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { trimRequestBody } from "../utils/trimRequestBody.js";
import StateModel from "../models/state.model.js";
import { responseMessage } from "../utils/responseMessage.js";

// Create State
const createState = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    req.body = trimRequestBody(req.body);

    const { name, countryId } = req.body;
    const existing = await StateModel.findOne({
      where: { name, countryId },
    });

    if (existing) {
      await transaction.rollback();
      return next(new ApiError(400, responseMessage.alreadyExists("State")));
    }

    const createdBy = req.user?.id || null;
    const state = await StateModel.create(
      { ...req.body, createdBy },
      { transaction }
    );

    await transaction.commit();
    return res
      .status(201)
      .json(new ApiResponse(201, state, responseMessage.created("State")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

// Get State List (with pagination + search)
const getStateList = asyncHandler(async (req, res, next) => {
  try {
    const {
      page,
      limit,
      sortBy = "name",
      sortOrder = "ASC",
      name = "",
      countryId,
    } = req.query;

    const where = {};
    if (name) {
      where[Op.or] = [{ name: { [Op.like]: `%${name}%` } }];
    }
    if (countryId) {
      where.countryId = countryId;
    }

    let states, totalItems, totalPages;

    if (page && limit) {
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      totalItems = await StateModel.count({ where });
      states = await StateModel.findAll({
        where,
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
        order: [[sortBy, sortOrder]],
      });

      totalPages = Math.ceil(totalItems / pageSize);
    } else {
      states = await StateModel.findAll({
        where,
        order: [[sortBy, sortOrder]],
      });
      totalItems = states.length;
      totalPages = 1;
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          states,
          page: page ? parseInt(page, 10) : null,
          limit: limit ? parseInt(limit, 10) : null,
          totalItems,
          totalPages,
        },
        responseMessage.fetched("States")
      )
    );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

// Get State by ID
const getStateById = asyncHandler(async (req, res, next) => {
  try {
    const state = await StateModel.findByPk(req.params.id);
    if (!state) {
      return next(new ApiError(404, responseMessage.notFound("State")));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, state, responseMessage.fetched("State")));
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

// Update State
const updateState = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const state = await StateModel.findByPk(req.params.id);
    if (!state) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("State")));
    }

    req.body = trimRequestBody(req.body);
    const updatedBy = req.user?.id || null;
    await state.update({ ...req.body, updatedBy }, { transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(new ApiResponse(200, state, responseMessage.updated("State")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

// Delete State
const deleteState = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const state = await StateModel.findByPk(req.params.id);
    if (!state) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("State")));
    }

    await state.destroy({ force: true, transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(new ApiResponse(200, null, responseMessage.deleted("State")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

export default {
  createState,
  getStateList,
  getStateById,
  updateState,
  deleteState,
};
