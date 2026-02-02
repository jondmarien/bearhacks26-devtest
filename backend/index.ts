import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db";
import authRoutes from "./routes/authRoutes";
import appRoutes from "./routes/appRoutes";

dotenv.config();

const app = express();
app.set("trust proxy", 1); // Trust Render's proxy for secure cookies

const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Database Connection
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("BearHacks 2026 API is running!");
});

app.use("/auth", authRoutes);
app.use("/api", appRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
