import User from "../models/User.model.js";
import { verifyGoogleToken } from "../services/googleAuth.service.js";
import { generateToken } from "../services/token.service.js";
import admin from "../config/firebase.js";

// import { redis } from "../config/redis.js";
// import { generateOTP, hashOTP, verifyOTP } from "../services/otp.service.js";
// import { sendSMS } from "../services/sms.service.js";
// const OTP_TTL = 300;
// const MAX_ATTEMPTS = 3;
// const RESEND_TTL = 30;
export const handleGoogleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;
    // 🔐 Verify with Google
    const googleUser = await verifyGoogleToken(idToken);

    // 🔍 Find user
    let user = await User.findOne({ email: googleUser.email });

    // ➕ Create if not exists
    if (!user) {
      user = await User.create({
        name: googleUser.name,
        email: googleUser.email,
        photo: googleUser.picture,
        authProvider: "google",
        isVerified: googleUser.emailVerified,
      });
    }

    // 🕒 Update last login
    user.lastLogin = new Date();
    await user.save();

    // 🔑 Generate app JWT
    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    console.error("Google auth error:", error.message);
    res.status(401).json({ message: error.message || "Authentication failed" });
  }
};

export const handleFirebaseLogin = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      return res.status(400).json({
        message: "Firebase token required",
      });
    }

    // 1️⃣ Verify Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);

    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      return res.status(401).json({
        message: "Invalid Firebase token",
      });
    }
    // 🔍 Find user
    let user = await User.findOne({ phone: phoneNumber });

    // ➕ Create if not exists
    if (!user) {
      user = await User.create({
        phone: phoneNumber,
        authProvider: "phone",
        isVerified: true,
      });
    }

    // 🕒 Update last login
    user.lastLogin = new Date();
    await user.save();

    // 🔑 Generate app JWT
    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    console.error("Firebase login error:", error);
    res.status(401).json({
      message: "Authentication failed",
    });
  }
};

export const verifySession = async (req, res) => {
  try {
    res.status(200).json({
      authenticated: true,
      user: req.user,
    });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
};

// export const handlePhoneLogin = async (req, res) => {
//   const { phone } = req.body;

//   const exists = await redis.exists(`otp:${phone}`);
//   if (exists) return res.status(429).json({ message: "OTP already sent" });

//   const otp = generateOTP();
//   const otpHash = await hashOTP(otp);

//   await redis.setEx(`otp:${phone}`, OTP_TTL, otpHash);
//   await redis.setEx(`otp_attempt:${phone}`, OTP_TTL, 0);
//   await redis.setEx(`otp_resend:${phone}`, RESEND_TTL, 1);
//   try {
//     await sendSMS(phone, `Your CareOn OTP is ${otp}`);
//   } catch (error) {
//     await redis.del(`otp:${phone}`, `otp_attempt:${phone}`);
//     return res.status(500).json({ message: "SMS failed" });
//   }

//   res.json({ message: "OTP sent successfully" });
// };

// export const verifyOTP = async (req, res) => {
//   const { phone, otp } = req.body;

//   const attempts = Number(await redis.get(`otp_attempt:${phone}`));
//   if (attempts >= MAX_ATTEMPTS)
//     return res.status(403).json({ message: "Too many attempts" });

//   const hash = await redis.get(`otp:${phone}`);
//   if (!hash) return res.status(410).json({ message: "OTP expired" });

//   await redis.incr(`otp_attempt:${phone}`);

//   const isValid = await verifyOTP(otp, hash);
//   if (!isValid) return res.status(401).json({ message: "Invalid OTP" });

//   await redis.del(
//     `otp:${phone}`,
//     `otp_attempt:${phone}`,
//     `otp_resend:${phone}`,
//   );

//   const token = generateToken(phone);
//   res.json({
//     message: "Login successful",
//     token,
//     user: { phone },
//   });
// };
