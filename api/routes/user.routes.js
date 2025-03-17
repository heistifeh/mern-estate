import express, { Router } from "express";
import { testLogic } from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { updateUserLogic } from "../controller/user.controller.js";

// import userController from "../controllers/user.controller";

const router = express.Router();

router.get("/test", testLogic);
router.post("/update/:id", verifyToken, updateUserLogic);
// router.get("/sign-up", signupLogic);

export default router;
