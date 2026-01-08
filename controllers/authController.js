// controllers/auth.controller.js
import { sql } from "../config/db.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const password_hash = await hashPassword(password);

    const [user] = await sql`
      INSERT INTO users (name, email, password_hash)
      VALUES (${name}, ${email}, ${password_hash})
      RETURNING id, name, email
    `;

    const token = generateToken(user.id);

    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ message: "Registration failed" });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const users = await sql`
      SELECT id, name, email, password_hash
      FROM users
      WHERE email = ${email}
    `;

    if (!users.length) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const user = users[0];
    const isMatch = await comparePassword(password, user.password_hash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id);

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed" });
  }
};
