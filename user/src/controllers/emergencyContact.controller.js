import EmergencyContact from "../models/EmergencyContact.model.js";
import User from "../models/User.model.js";

export const getAllEmergencyContacts = async (req, res) => {
  try {
    const contacts = await EmergencyContact.find({
      user: req.user.id,
      isActive: true,
    }).sort({ priority: 1 });

    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
export const addEmergencyContact = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware
    const { name, phone, relationship } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: "Name and phone are required" });
    }

    // 1️⃣ Create contact
    const contact = await EmergencyContact.create({
      user: userId,
      name,
      phone,
      relationship,
    });

    // 2️⃣ Push contact ID into user
    await User.findByIdAndUpdate(userId, {
      $push: { emergencyContacts: contact._id },
    });

    res.status(201).json({
      message: "Emergency contact added",
      contact,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "This contact already exists for this user",
      });
    }
    res.status(500).json({ message: "Server error" });
  }
};

export const removeEmergencyContact = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const contact = await EmergencyContact.findOneAndDelete({
      _id: id,
      user: userId,
    });

    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }

    await User.findByIdAndUpdate(userId, {
      $pull: { emergencyContacts: id },
    });

    res.json({ message: "Contact deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
  