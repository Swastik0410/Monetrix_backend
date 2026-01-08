import { configDotenv } from "dotenv";
configDotenv(); // ✅ load env first

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

/* -------- ROUTES -------- */
app.use("/api/auth", authRoutes); // public
app.use("/api/transactions", protect, transactionRoutes); // 🔐 protected

/* -------- START SERVER -------- */
const PORT = process.env.PORT || 5000;

initDB().then(() => {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
