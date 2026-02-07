import { configDotenv } from "dotenv";
configDotenv(); // ✅ Load environment variables first

import express from "express";
import cors from "cors";
import helmet from "helmet";

import { initDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";
import { protect } from "./middleware/auth.js";

import authRoutes from "./routes/authRoute.js";
import transactionRoutes from "./routes/transactionsRoute.js";

const app = express();

/* -------- MIDDLEWARES -------- */
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(rateLimiter);

/* -------- BASE ROOT ENDPOINT -------- */
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Monetrix API is running",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

/* -------- HEALTH CHECK -------- */
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    uptime: process.uptime(),
  });
});

/* -------- ROUTES -------- */
app.use("/api/auth", authRoutes); // Public routes
app.use("/api/transactions", protect, transactionRoutes); // Protected routes

/* -------- 404 HANDLER -------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* -------- START SERVER -------- */
const PORT = process.env.PORT || 5000;

initDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  });
