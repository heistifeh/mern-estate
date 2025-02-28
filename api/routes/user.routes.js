import express, { Router } from "express";
import { testLogic } from "../controller/user.controller.js";
// import userController from "../controllers/user.controller";

const router = express.Router();

router.get("/test", testLogic);
// router.get("/sign-up", signupLogic);

export default router;
