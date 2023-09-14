import express from "express";
import {
  authorizeUserController,
  login,
  refreshTokenController,
  ssoLogin,
} from "./../controllers/AuthController";
import Config from "../config/Config";

const router = express.Router();

if (!Config()._SSO_LOGIN_ENABLED) {
  router.post("/", login);
} else {
  router.get("/sso", ssoLogin);
  router.get("/authorize_user", authorizeUserController);
  router.post("/oauth2/refresh/token", refreshTokenController);
}

export default router;
