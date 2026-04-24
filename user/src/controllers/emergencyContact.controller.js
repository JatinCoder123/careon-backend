import { db } from "../config/db.js";

/**
 * GET all active emergency contacts of logged-in user
 */
export const getAllEmergencyContacts = async (req, res) => {
  try {
    const userId = req.user.id;

    const [contacts] = await db.query(
      `
      SELECT id, name, phone, relationship, priority
      FROM emergency_contacts
      WHERE user_id = ? AND is_active = true
      ORDER BY priority ASC
      `,
      [userId]
    );

    res.json(contacts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADD emergency contact
 */
export const addEmergencyContact = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, relationship } = req.body;

    if (!name || !phone) {
      return res
        .status(400)
        .json({ message: "Name and phone are required" });
    }

    const [result] = await db.query(
      `
      INSERT INTO emergency_contacts (user_id, name, phone, relationship)
      VALUES (?, ?, ?, ?)
      `,
      [userId, name.trim(), phone.trim(), relationship || null]
    );

    res.status(201).json({
      message: "Emergency contact added",
      contact: {
        id: result.insertId,
        name,
        phone,
        relationship,
      },
    });
  } catch (error) {
    console.error(error);

    // Duplicate phone (UNIQUE constraint)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        message: "This phone number is already added as an emergency contact",
      });
    }

    res.status(500).json({ message: "Server error" });
  }
};

/**
 * REMOVE emergency contact (soft delete recommended)
 */
export const removeEmergencyContact = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const [result] = await db.query(
      `
      UPDATE emergency_contacts
      SET is_active = false
      WHERE id = ? AND user_id = ?
      `,
      [id, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }

    res.json({ message: "Contact removed" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
