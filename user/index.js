import  "dotenv/config";           // ✅ FIRST
import app from "./app.js";
import connectDB from "./src/config/db.js";
await connectDB();
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
