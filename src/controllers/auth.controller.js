/**
 * auth Controller
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sequelize from "../config/db.js";
import UserModel from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
// import sendMail from "../services/mail.service.js";
import RoleModel from "../models/role.model.js";
import { generateVerificationToken } from "../utils/verificationToken.js";
import { trimRequestBody } from "../utils/trimRequestBody.js";
import ActivityPermissionModel from "../models/activityPermission.model.js";
import PermissionModel from "../models/permission.model.js";
import ActivityMasterModel from "../models/activityMaster.model.js";
import { encryptData } from "../utils/encryptDecrypt.js";
import { Op } from "sequelize";
import FileController from "./file.controller.js";
import { EMAIL_TEMPLATE } from "../utils/constants/index.js";
import sendMail from "../services/mail.service.js";

export const BASE_URL = process.env.BASE_URL;

/**
 * Generate JWT Token
 */
const generateToken = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      mobileNumber: user.mobileNumber,
      roles: user.role?.name,
    },
    process.env.JWT_TOKEN_SECRET_KEY,
    { expiresIn: process.env.JWT_TOKEN_EXPIRE_IN_TIME }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE_IN_TIME }
  );

  return { accessToken, refreshToken };
};

/**
 * Verify User
 */
const verifyUser = asyncHandler(async (req, res, next) => {
  const { token } = req.body;

  try {
    const { id } = jwt.verify(token, process.env.JWT_VERIFY_SECRET_KEY);

    await UserModel.update(
      { isVerified: true, updatedAt: Date.now() },
      {
        where: { id },
      }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, null, "User verified successfully"));
  } catch (error) {
    throw new ApiError(400, "Link is invalid or expired");
  }
});

/**
 * Login User (by email or mobile number)
 */
const loginUser = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find user by email or mobile number
    const user = await UserModel.scope("withPassword").findOne({
      where: {
        [Op.or]: [{ email: email }, { mobileNumber: email }],
      },
      include: [
        {
          model: RoleModel,
          attributes: ["id", "name"],
          as: "role",
        },
      ],
    });

    if (!user) {
      throw new ApiError(400, "Invalid credentials");
    }

    if (!user.isActive) {
      throw new ApiError(400, "User is not active");
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new ApiError(400, "Invalid credentials");
    }

    // **Update lastLoginAt**
    user.lastLoginAt = new Date();
    await user.save();

    // Fetch and enrich permissions (same as your original code)
    const activityPermsRaw = await ActivityPermissionModel.findAll({
      where: { roleId: user.roleId },
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

    const allPermissionIds = activityPermsRaw.flatMap((item) =>
      Array.isArray(item.permissionIds) ? item.permissionIds : []
    );
    const uniquePermissionIds = [...new Set(allPermissionIds)];

    const permissionRecords = await PermissionModel.findAll({
      where: { id: uniquePermissionIds },
      attributes: ["id", "name"],
    });

    const idToNameMap = {};
    permissionRecords.forEach(({ id, name }) => {
      idToNameMap[id] = name;
    });

    const enrichedPermissions = activityPermsRaw.map((item) => {
      const permIds = Array.isArray(item.permissionIds)
        ? item.permissionIds
        : [];
      const permissionNames = permIds
        .map((id) => idToNameMap[id])
        .filter(Boolean);

      return {
        id: item.id,
        role: item.role,
        activity: item.activity,
        permissionNames,
      };
    });

    // Generate JWT token
    const token = generateToken(user);
    console.log({ token });

    // Save refresh token
    user.refreshToken = token.refreshToken;
    await user.save();

    const userPlain = user.get({ plain: true });
    delete userPlain.password;
    delete userPlain.refreshToken;

    const data = encryptData({
      token,
      user: userPlain,
      permissions: enrichedPermissions,
    });
    // Refresh all customer files and clean up unused S3 files
    await FileController.getAllFilesInternal();

    return res.status(200).json(new ApiResponse(200, data, "Login successful"));
  } catch (err) {
    next(err);
  }
});

/**
 * Forgot Password
 */
const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await UserModel.findOne({
    where: { email, isActive: true },
  });

  if (!user) {
    throw new ApiError(400, "Invalid Email");
  }

  const verificationToken = generateVerificationToken(user);

  await sendMail({
    to: email,
    subject: EMAIL_TEMPLATE.FORGOT_PASSWORD.SUBJECT,
    template: EMAIL_TEMPLATE.FORGOT_PASSWORD.TEMPLATE,
    context: {
      link: `http://localhost:3000/forgotPassword?token=${verificationToken}`,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Reset Password email sent successfully"));
});

/**
 * Reset Password
 */
const resetPassword = asyncHandler(async (req, res, next) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id; // Assuming authenticateUser sets req.user

  // Fetch user with password
  const user = await UserModel.scope("withPassword").findOne({
    where: { id: userId },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Check if old password matches
  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Old password is incorrect");
  }

  // Hash new password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password and remove refresh token
  await UserModel.update(
    { password: hashedPassword, refreshToken: null, updatedAt: new Date() },
    { where: { id: userId } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});

/**
 * Forgot  Password
 */
const resetForgotPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    throw new ApiError(400, "Token and new password are required");
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_VERIFY_SECRET_KEY);
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }

  // Fetch user along with role
  const user = await UserModel.findByPk(decoded.id, {
    include: [
      {
        model: RoleModel,
        as: "role",
        attributes: ["id", "name"],
      },
    ],
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update and clear refresh token
  await UserModel.update(
    {
      password: hashedPassword,
      refreshToken: null,
      updatedAt: new Date(),
    },
    { where: { id: user.id } }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});

/**
 * Refresh Token
 */

const refreshToken = asyncHandler(async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new ApiError(400, "Refresh token is required");
    }

    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_TOKEN_SECRET_KEY
    );

    // User ke sath role bhi fetch kare
    const user = await UserModel.findByPk(decoded.id, {
      include: [
        {
          model: RoleModel,
          as: "role",
          attributes: ["id", "name"],
        },
      ],
    });

    if (!user || user.refreshToken !== refreshToken) {
      throw new ApiError(400, "Invalid or expired refresh token");
    }

    // Generate new access token with roleId and roleName
    const tokens = generateToken(user);

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          { accessToken: tokens?.accessToken },
          "Access token refreshed"
        )
      );
  } catch (err) {
    if (err.name === "TokenExpiredError" || err.name === "JsonWebTokenError") {
      throw new ApiError(400, "Token is expired");
    }
    next(err);
  }
});

export const logoutUser = asyncHandler(async (req, res) => {
  try {
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
      return res
        .status(400)
        .json(new ApiResponse(false, null, "Token missing in request"));
    }

    // Optional: agar blacklist maintain karna hai
    // await TokenBlacklist.create({ token });

    // Client ko bolenge cookie clear kare ya token ignore kare
    return res
      .status(200)
      .json(new ApiResponse(true, null, "Logout successful"));
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json(new ApiResponse(false, null, "Logout failed"));
  }
});

export default {
  verifyUser,
  loginUser,
  refreshToken,
  forgotPassword,
  resetPassword,
  logoutUser,
  resetForgotPassword,
};
