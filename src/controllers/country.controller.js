/**
 * Country Controller
 */

import { Op } from "sequelize";
import sequelize from "../config/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { trimRequestBody } from "../utils/trimRequestBody.js";
import CountryModel from "../models/country.model.js";
import { responseMessage } from "../utils/responseMessage.js";

// Create Country
const createCountry = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    req.body = trimRequestBody(req.body);
    const { name } = req.body;

    const existing = await CountryModel.findOne({ where: { name } });
    if (existing) {
      await transaction.rollback();
      return next(new ApiError(400, responseMessage.alreadyExists("Country")));
    }

    const createdBy = req.user?.id || null;
    const country = await CountryModel.create(
      { ...req.body, createdBy },
      { transaction }
    );

    await transaction.commit();
    return res
      .status(201)
      .json(new ApiResponse(201, country, responseMessage.created("Country")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

// Get Country List (pagination + search)
const getCountryList = asyncHandler(async (req, res, next) => {
  try {
    const {
      page,
      limit,
      sortBy = "name",
      sortOrder = "ASC",
      name = "",
    } = req.query;

    const where = {};
    if (name) {
      where[Op.or] = [{ name: { [Op.like]: `%${name}%` } }];
    }

    let countries, totalItems, totalPages;

    if (page && limit) {
      const pageNumber = parseInt(page, 10);
      const pageSize = parseInt(limit, 10);

      totalItems = await CountryModel.count({ where });
      countries = await CountryModel.findAll({
        where,
        offset: (pageNumber - 1) * pageSize,
        limit: pageSize,
        order: [[sortBy, sortOrder]],
      });

      totalPages = Math.ceil(totalItems / pageSize);
    } else {
      countries = await CountryModel.findAll({
        where,
        order: [[sortBy, sortOrder]],
      });
      totalItems = countries.length;
      totalPages = 1;
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          countries,
          page: page ? parseInt(page, 10) : null,
          limit: limit ? parseInt(limit, 10) : null,
          totalItems,
          totalPages,
        },
        responseMessage.fetched("Countries")
      )
    );
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

// Get Country By ID
const getCountryById = asyncHandler(async (req, res, next) => {
  try {
    const country = await CountryModel.findByPk(req.params.id);
    if (!country) {
      return next(new ApiError(404, responseMessage.notFound("Country")));
    }
    return res
      .status(200)
      .json(new ApiResponse(200, country, responseMessage.fetched("Country")));
  } catch (err) {
    next(new ApiError(500, err.message));
  }
});

// Update Country
const updateCountry = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const country = await CountryModel.findByPk(req.params.id);
    if (!country) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("Country")));
    }

    req.body = trimRequestBody(req.body);
    const updatedBy = req.user?.id || null;
    await country.update({ ...req.body, updatedBy }, { transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(new ApiResponse(200, country, responseMessage.updated("Country")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

// Update Country Status
const updateCountryStatus = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const country = await CountryModel.findByPk(req.params.id);
    if (!country) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("Country")));
    }

    country.isActive = req.body.isActive;
    country.updatedBy = req.user?.id || null;
    await country.save({ transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(
        new ApiResponse(200, country, responseMessage.statusUpdated("Country"))
      );
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

// Delete Country
const deleteCountry = asyncHandler(async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const country = await CountryModel.findByPk(req.params.id);
    if (!country) {
      await transaction.rollback();
      return next(new ApiError(404, responseMessage.notFound("Country")));
    }

    await country.destroy({ force: true, transaction });

    await transaction.commit();
    return res
      .status(200)
      .json(new ApiResponse(200, null, responseMessage.deleted("Country")));
  } catch (err) {
    await transaction.rollback();
    next(new ApiError(500, err.message));
  }
});

export default {
  createCountry,
  getCountryList,
  getCountryById,
  updateCountry,
  updateCountryStatus,
  deleteCountry,
};
