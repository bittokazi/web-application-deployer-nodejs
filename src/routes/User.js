import express from "express";
import {
  UserList,
  whoAmI,
  checkUserExist,
  addUserController,
  getChatServerToken,
  getUserController,
  updatePasswordController,
  updateUserController,
} from "./../controllers/UserController";
import FormValidator from "./../middlewares/FormValidator";
import Config from "../config/Config";

const router = express.Router();

router.get("/whoami", whoAmI);
if (!Config()._SSO_LOGIN_ENABLED) {
  router.get("/", UserList);
  router.post("/", FormValidator("createUser"), addUserController);
  router.get("/chat/token", getChatServerToken);
  router.get("/:id", getUserController);
  router.put("/change-password", updatePasswordController);
  router.put("/:id", updateUserController);
}

export default router;
