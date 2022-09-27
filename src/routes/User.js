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

const router = express.Router();

router.get("/", UserList);
router.post("/", FormValidator("createUser"), addUserController);
router.get("/whoami", whoAmI);
router.get("/chat/token", getChatServerToken);
router.get("/:id", getUserController);
router.put("/change-password", updatePasswordController);
router.put("/:id", updateUserController);

export default router;
