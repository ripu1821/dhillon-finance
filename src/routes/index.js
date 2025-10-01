/**
 * Index routes
 */

import authRouter from "./authRoutes.js";
import express from "express";
import roleRouter from "./roleRouter.js";
import userRouter from "./userRouter.js";
import permissionRouter from "./permissionRouter.js";
import activityRouter from "./activityMasterRouter.js";
import activityPermissionRouter from "./activityPermissionRouter.js";
import countryRouter from "./countryRouter.js";
import stateRouter from "./stateRouter.js";
import districtRouter from "./districtRouter.js";
import customerRouter from "./customer.routes.js";
import fileRouter from "./file.routes.js";
import loanRouter from "./loan.routes.js";
import transactionRouter from "./transaction.routes.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/role", roleRouter);

router.use("/permission", permissionRouter);

router.use("/user", userRouter);
router.use("/activity", activityRouter);
router.use("/activityPermission", activityPermissionRouter);

router.use("/country", countryRouter);
router.use("/state", stateRouter);
router.use("/district", districtRouter);

router.use("/customer", customerRouter);

router.use("/file", fileRouter);

router.use("/loan", loanRouter);

router.use("/transaction", transactionRouter);

export default router;
