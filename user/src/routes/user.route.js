import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { handleGoogleLogin, verifySession, handleFirebaseLogin } from "../controllers/user.controller.js";

const router = express.Router();
router.post("/login/google",  handleGoogleLogin);
router.post("/login/phone",  handleFirebaseLogin);
// router.post("/verify-otp",  verifyOTP);
router.get("/me", protect, verifySession);

export default router;
