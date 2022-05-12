import express from "express";
import {
  addApplication,
  getAllApplicationController,
  updateApplicationController,
  deployApplicationCon,
  showApplicationCon,
  selfDeployerServiceController,
  getAllDeploymentsController,
  startApplicationCon,
  stopApplicationCon,
  getLogFile,
  getLogFileCon,
} from "./../controllers/ApplicationController";
import FormValidator from "../middlewares/FormValidator";
import InvalidFormResponse from "../middlewares/InvalidFormResponse";

const router = express.Router();

router.post(
  "/",
  FormValidator("createApplication"),
  InvalidFormResponse,
  addApplication
);
router.get("/", getAllApplicationController);
router.get("/self/deploy/app", selfDeployerServiceController);
router.put("/:id", updateApplicationController);
router.get("/:id/deploy", deployApplicationCon);
// router.get("/:id/deploy/start", startApplicationCon);
router.get("/:id/deploy/stop", stopApplicationCon);
router.get("/:id", showApplicationCon);
router.get("/:name/deployments", getAllDeploymentsController);
router.get("/:id/log", getLogFileCon);

export default router;
