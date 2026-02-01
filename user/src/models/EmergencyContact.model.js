import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    relationship: {
      type: String,
      trim: true,
    },

    priority: {
      type: Number,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

/* 🔐 Ensure same user cannot add same phone twice */
emergencyContactSchema.index(
  { user: 1, phone: 1 },
  { unique: true }
);

export default mongoose.model("EmergencyContact", emergencyContactSchema);
