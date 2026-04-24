import { db } from "../config/db.js";
import { verifyToken } from "../services/token.service.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // 🔐 Verify JWT
    const decoded = verifyToken(token); // { userId }

    // 🔍 Fetch user from MySQL
    const [rows] = await db.query(
      `
      SELECT id, name, email, phone,photo, auth_provider, is_verified, is_active
      FROM users
      WHERE id = ?
      LIMIT 1
      `,
      [decoded.userId]
    );

    const user = rows[0];

    if (!user || !user.is_active) {
      return res.status(401).json({
        message: "User not found or inactive",
      });
    }

    // Attach user to request
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
