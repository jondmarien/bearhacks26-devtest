import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "@/db";
import seedAdmin from "@/utils/seedAdmin";
import Logger from "@/utils/Logger";
import adminRoutes from "@/routes/adminRoutes";
import authRoutes from "@/routes/authRoutes";
import appRoutes from "@/routes/appRoutes";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.set("trust proxy", 1); // Trust Render's proxy for secure cookies

const PORT = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// Request Logger
app.use(Logger.httpLogger.bind(Logger));

// Database Connection
connectDB().then(() => {
  seedAdmin();
});

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, "../frontend/dist")));

// API Routes (Must come before SPA catch-all)
app.use("/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", appRoutes);

// Catch-all for SPA
// Express 5 requires regex for global wildcard
app.get(/.*/, (req, res) => {
  if (req.path.startsWith("/api") || req.path.startsWith("/auth")) {
    res.status(404).json({ message: "API endpoint not found" });
    return;
  }
  res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
});

app.listen(PORT, () => {
  Logger.info(`Server running on port ${PORT}`);
});
