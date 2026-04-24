import { db } from "../config/db.js";

/**
 * GET all active emergency contacts of logged-in user
 */
export const getAllEmergencyContacts = async (req, res) => {
  try {
    const userId = req.user.id;

    const [contacts] = await db.query(
      `
      SELECT id, name, phone, email, relationship, priority
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
    const { name, phone, email, relationship, priority } = req.body;

    // Name required
    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    // Either phone or email required
    if (!phone && !email) {
      return res.status(400).json({
        message: "Either phone or email is required",
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO emergency_contacts
      (user_id, name, phone, email, relationship, priority)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        userId,
        name.trim(),
        phone ? phone.trim() : null,
        email ? email.trim() : null,
        relationship || null,
        priority || 1,
      ]
    );

    res.status(201).json({
      message: "Emergency contact added",
      contact: {
        id: result.insertId,
        name,
        phone: phone || null,
        email: email || null,
        relationship,
        priority: priority || 1,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * REMOVE emergency contact (soft delete)
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