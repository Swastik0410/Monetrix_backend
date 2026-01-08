import { sql } from "../config/db.js";

/* -------- SUMMARY -------- */
export const getSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const [balance] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS balance
      FROM transactions
      WHERE user_id = ${userId}
    `;

    const [income] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS income
      FROM transactions
      WHERE user_id = ${userId} AND amount > 0
    `;

    const [expense] = await sql`
      SELECT COALESCE(SUM(amount), 0) AS expense
      FROM transactions
      WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balance.balance,
      income: income.income,
      expenses: expense.expense,
    });
  } catch (error) {
    console.error("Error getting summary:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* -------- GET TRANSACTIONS -------- */
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user.id;

    const transactions = await sql`
      SELECT *
      FROM transactions
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* -------- CREATE TRANSACTION -------- */
export const createTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, amount, category } = req.body;

    if (!title || !category || typeof amount !== "number") {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const [transaction] = await sql`
      INSERT INTO transactions (user_id, title, amount, category)
      VALUES (${userId}, ${title}, ${amount}, ${category})
      RETURNING *
    `;

    res.status(201).json(transaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/* -------- DELETE TRANSACTION -------- */
export const deleteTransaction = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    if (isNaN(Number(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const result = await sql`
      DELETE FROM transactions
      WHERE id = ${id} AND user_id = ${userId}
      RETURNING *
    `;

    if (!result.length) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
