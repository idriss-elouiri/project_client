import express from "express";
import * as authController from "./auth.controller.js";
import { registerShcema, loginShcema } from "./auth.schema.js";
import { validateZod } from "../../middlewares/validate-zod.js";

const router = express.Router();

router.post(
  "/register",
  validateZod(registerShcema),
  authController.registerHandler
);
router.post("/login", validateZod(loginShcema), authController.loginHandler);

export default router;