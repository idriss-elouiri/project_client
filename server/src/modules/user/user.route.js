import express from "express";
import * as userController from "./user.controller.js";
import { verifyToken } from "../../utils/verifyToken.js";

const router = express.Router();

router.put("/update/:userId", verifyToken, userController.updateUser);
router.delete("/delete/:userId", verifyToken, userController.deleteUser);
router.post("/signout", userController.signout);
router.get("/getusers", verifyToken, userController.getUsers);
router.get("/:userId", userController.getUser);

export default router;