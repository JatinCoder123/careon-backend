import { db } from "../config/db.js";
import { verifyGoogleToken } from "../services/googleAuth.service.js";
import { generateToken } from "../services/token.service.js";
import admin from "../config/firebase.js";

/**
 * GOOGLE LOGIN
 */
export const handleGoogleLogin = async (req, res) => {
  try {
    const { idToken } = req.body;

    // 🔐 Verify Google token
    const googleUser = await verifyGoogleToken(idToken);
    console.log("GOOGLE USER", googleUser)

    // 🔍 Find user by email
    const [rows] = await db.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1",
      [googleUser.email]
    );

    let user = rows[0];
    console.log(user)

    // ➕ Create user if not exists
    if (!user) {
      const [result] = await db.query(
        `
        INSERT INTO users 
        (name, email, photo, auth_provider, is_verified, last_login)
        VALUES (?, ?, ?, 'google', ?, NOW())
        `,
        [
          googleUser.name,
          googleUser.email,
          googleUser.picture,
          googleUser.emailVerified,
        ]
      );

      user = {
        id: result.insertId,
        name: googleUser.name,
        email: googleUser.email,
        photo: googleUser.picture,
        auth_provider: "google",
        is_verified: googleUser.emailVerified,
      };
    } else {
      // 🕒 Update last login
      await db.query(
        "UPDATE users SET last_login = NOW() WHERE id = ?",
        [user.id]
      );
    }

    // 🔑 Generate JWT
    const token = generateToken(user.id);

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Google auth error:", error);
    res.status(401).json({
      message: error.message || "Authentication failed",
    });
  }
};

/**
 * FIREBASE PHONE LOGIN
 */
export const handleFirebaseLogin = async (req, res) => {
  try {
    const { firebaseToken } = req.body;

    if (!firebaseToken) {
      return res.status(400).json({
        message: "Firebase token required",
      });
    }

    // 🔐 Verify Firebase token
    const decodedToken = await admin.auth().verifyIdToken(firebaseToken);
    const phoneNumber = decodedToken.phone_number;

    if (!phoneNumber) {
      return res.status(401).json({
        message: "Invalid Firebase token",
      });
    }

    // 🔍 Find user by phone
    const [rows] = await db.query(
      "SELECT * FROM users WHERE phone = ? LIMIT 1",
      [phoneNumber]
    );

    let user = rows[0];

    // ➕ Create user if not exists
    if (!user) {
      const [result] = await db.query(
        `
        INSERT INTO users
        (phone, auth_provider, is_verified, last_login)
        VALUES (?, 'phone', true, NOW())
        `,
        [phoneNumber]
      );

      user = {
        id: result.insertId,
        phone: phoneNumber,
        auth_provider: "phone",
        is_verified: true,
      };
    } else {
      // 🕒 Update last login
      await db.query(
        "UPDATE users SET last_login = NOW() WHERE id = ?",
        [user.id]
      );
    }

    // 🔑 Generate JWT
    const token = generateToken(user.id);

    res.status(200).json({ token, user });
  } catch (error) {
    console.error("Firebase login error:", error);
    res.status(401).json({
      message: "Authentication failed",
    });
  }
};

/**
 * VERIFY SESSION
 * (req.user is set by JWT middleware)
 */
export const verifySession = async (req, res) => {
  try {
    res.status(200).json({
      authenticated: true,
      user: req.user,
    });
  } catch {
    res.status(401).json({ authenticated: false });
  }
};
