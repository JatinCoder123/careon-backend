import User from "../models/User.model.js";
import { verifyToken } from "../services/token.service.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 🔐 Verify JWT
    const decoded = verifyToken(token);

    // 🔍 Fetch user
    const user = await User.findById(decoded.userId).select("-__v");

    if (!user || !user.isActive) {
      return res.status(401).json({ message: "User not found or inactive" });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
