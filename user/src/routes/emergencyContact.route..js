import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import {
    getAllEmergencyContacts,
    addEmergencyContact,
    removeEmergencyContact
} from "../controllers/emergencyContact.controller.js";

const router = express.Router();
router.get("/getAll", protect, getAllEmergencyContacts);
router.post("/add", protect, addEmergencyContact);
router.delete("/remove/:id", protect, removeEmergencyContact  );

export default router;
// AIzaSyAhBGnIyTLuRzdWppKBJNW9bqLh9Odpp_A