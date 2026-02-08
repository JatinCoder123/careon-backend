import  "dotenv/config";           // ✅ FIRST
import app from "./app.js";
import connectDB from "./src/config/db.js";
// import { connectRedis } from "./src/config/redis.js";

const PORT = process.env.PORT || 5000;

await connectDB();
// await connectRedis();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});
