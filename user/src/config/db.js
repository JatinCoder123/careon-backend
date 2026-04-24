import mysql from "mysql2/promise";

const db = mysql.createPool({
  host: process.env.DB_HOST,      // e.g. localhost
  user: process.env.DB_USER,      // e.g. root
  password: process.env.DB_PASS,  // your password
  database: process.env.DB_NAME,  // your db name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const connectDB = async () => {
  try {
    const connection = await db.getConnection();
    console.log("✅ MySQL connected successfully");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL connection failed");
    console.error(err.message);
    process.exit(1);
  }
};

export { db };
export default connectDB;
