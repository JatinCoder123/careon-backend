import User from "../models/User.model.js";
import { verifyGoogleToken } from "../services/googleAuth.service.js";
import { generateToken } from "../services/token.service.js";

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
export const verifySession = async (req, res) => {
  try {
    // req.user comes from protect middleware
    // console.log("Authenticated user:", req.user);
    res.status(200).json({
      authenticated: true,
      user: req.user,
    });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
};

