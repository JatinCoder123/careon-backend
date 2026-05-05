import express from "express";
import { sendSOSMail } from "../services/emailService.js";
import sendWhatsApp from "../services/whatsapp.service.js";

const router = express.Router();

router.post("/send", async (req, res) => {
  try {
    const { contacts, userName, latitude, longitude, battery } = req.body;
    console.log("SEND REQUEST !")

    const locationUrl = `https://maps.google.com/?q=${latitude},${longitude}`;
    for (const contact of contacts) {
      if (contact?.phone) {
        await sendWhatsApp({
          to: contact.phone,
          userName,
          locationUrl,
          battery,
        });
      }
    }

    for (const contact of contacts) {
      if (contact.email) {
        await sendSOSMail({
          to: contact.email,
          userName,
          locationUrl,
          battery,
        });
      }
    }

    res.json({
      success: true,
      message: "SOS Emails sent",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to send emails",
    });
  }
});

export default router;
