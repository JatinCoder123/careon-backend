import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/user.route.js";
import contactRoutes from "./src/routes/emergencyContact.route..js";

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use("/api/v1/user", userRoutes);
app.use("/api/v1/emergency-contact", contactRoutes);

export default app;
