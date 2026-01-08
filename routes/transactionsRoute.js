import express from "express";
import {
  getSummary,
  getTransactions,
  createTransaction,
  deleteTransaction,
} from "../controllers/transactionsController.js";

const router = express.Router();

/* -------- ROUTES -------- */
router.get("/summary/:userId", getSummary);
router.get("/:userId", getTransactions);
router.post("/", createTransaction);
router.delete("/:id", deleteTransaction);

export default router;
