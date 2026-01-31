import mongoose from "mongoose";
const dbURI = process.env.MONGO_URI 
const connectDB = async () => {
  try {
    await mongoose.connect(dbURI);
    console.log("✅ MongoDB connected (local) with Mongoose");
  } catch (err) {
    console.error("❌ MongoDB connection failed");
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
