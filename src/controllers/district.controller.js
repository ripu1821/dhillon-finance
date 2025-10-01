/**
 * District Controller
 */

import { Op } from "sequelize";
import sequelize from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { trimRequestBody } from "../utils/trimRequestBody.js";
import DistrictModel from "../models/district.model.js";
import { responseMessage } from "../utils/responseMessage.js";

// Create District
const createDistrict = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    req.body = trimRequestBody(req.body);

    const { name, stateId, countryId } = req.body;

    const existing = await DistrictModel.findOne({
      where: { name, stateId, countryId },
    });
    if (existing) {
      await transaction.rollback();
      return next(new ApiError(400, responseMessage.alreadyExists("District")));
    }

    const createdBy = req.user?.id || null;
    const district = await DistrictModel.create(
      { ...req.body, createdBy },
      { transaction }
    );

    await transaction.commit();
    return res
      .status(201)
      .json(
        new ApiResponse(201, district, responseMessage.created("District"))
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

// Get District List
const getDistrictList = asyncHandler(async (req, res, next) => {
  try {
    const {
      page,
      limit,
      sortBy = "name",
      sortOrder = "ASC",
      name = "",
      stateId,
      countryId,
    } = req.query;

    const where = {};
    if (name) where.name = { [Op.like]: `%${name}%` };
    if (stateId) where.stateId = stateId;
    if (countryId) where.countryId = countryId;

    let districts, totalItems, totalPages;

    if (page && limit) {
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      totalItems = await DistrictModel.count({ where });
      districts = await DistrictModel.findAll({
        where,
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
        order: [[sortBy, sortOrder]],
      });

      totalPages = Math.ceil(totalItems / pageSize);
    } else {
      districts = await DistrictModel.findAll({
        where,
        order: [[sortBy, sortOrder]],
      });
      totalItems = districts.length;
      totalPages = 1;
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          {
            districts,
            page: page ? +page : null,
            limit: limit ? +limit : null,
            totalItems,
            totalPages,
          },
          responseMessage.fetched("Districts")
        )
      );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

// Get District by ID
const getDistrictById = asyncHandler(async (req, res, next) => {
  try {
    const district = await DistrictModel.findByPk(req.params.id);
    if (!district) {
      return next(new ApiError(404, responseMessage.notFound("District")));
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, district, responseMessage.fetched("District"))
      );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

// Update District
const updateDistrict = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const district = await DistrictModel.findByPk(req.params.id);
    if (!district) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("District")));
    }

    req.body = trimRequestBody(req.body);
    const updatedBy = req.user?.id || null;
    await district.update({ ...req.body, updatedBy }, { transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(
        new ApiResponse(200, district, responseMessage.updated("District"))
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

// Delete District
const deleteDistrict = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const district = await DistrictModel.findByPk(req.params.id);
    if (!district) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("District")));
    }

    await district.destroy({ force: true, transaction });
    await transaction.commit();

    return res
      .status(200)
      .json(new ApiResponse(200, null, responseMessage.deleted("District")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

export default {
  createDistrict,
  getDistrictList,
  getDistrictById,
  updateDistrict,
  deleteDistrict,
};
