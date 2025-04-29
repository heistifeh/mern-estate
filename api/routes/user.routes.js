import express, { Router } from "express";
import { updateUserLogic,deleteUserLogic, testLogic, getUserListings, getUser } from "../controller/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

// import userController from "../controllers/user.controller";

const router = express.Router();

router.get("/test", testLogic);
router.post("/update/:id", verifyToken, updateUserLogic);
router.delete("/delete/:id", verifyToken, deleteUserLogic);
router.get("/listings/:id", verifyToken, getUserListings);
router.get('/:id', verifyToken, getUser)
// router.get("/sign-up", signupLogic);

export default router;
