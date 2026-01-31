import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { handleGoogleLogin, verifySession } from "../controllers/user.controller.js";

const router = express.Router();
router.post("/login/google",  handleGoogleLogin);
router.get("/me", protect, verifySession);

export default router;
