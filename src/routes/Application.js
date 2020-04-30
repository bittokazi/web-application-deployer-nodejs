import express from "express";
import {
  addApplication,
  getAllApplicationController,
  updateApplicationController,
  deployApplicationCon,
  showApplicationCon,
  selfDeployerServiceController,
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
router.get("/:id", showApplicationCon);

export default router;
