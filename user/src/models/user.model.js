import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
    },

    photo: {
      type: String,
    },

    authProvider: {
      type: String,
      enum: ["google", "phone"],
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    emergencyContacts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "EmergencyContact",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
