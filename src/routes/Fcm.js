import express from "express";
import { subscribeFcm, unSubscribeFcm } from "../controllers/AuthController";

const router = express.Router();

router.post("/subscribe", subscribeFcm);
router.post("/unsubscribe", unSubscribeFcm);

export default router;
