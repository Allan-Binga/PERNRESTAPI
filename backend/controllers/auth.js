import { pool } from "../index.js";
import bcrypt from "bcrypt";

//USER REGISTRATION
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    //CHECKING IF USER EXISTS
    const checkUserQuery = "SELECT * FROM users WHERE email = $1";
    const user = await pool.query(checkUserQuery, [email]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exists.");
    }

    //PASSWORD HASHING
    const hashedPassword = await bcrypt.hash(password, 10);

    //INSERTING USER INTO DATABASE
    const insertUserQuery =
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *";

    const newUser = await pool.query(insertUserQuery, [
      username,
      email,
      hashedPassword,
    ]);

    res.status(201).json({
      message: "User registered successfully.",
      user: newUser.rows[0],
    });
  } catch (error) {
    res.status(500).json("Internal server error.");
  }
};

//USER LOGIN
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    //CHECKING IF USER EXISTS
    const checkUserQuery = "SELECT * FROM users WHERE email = $1";
    const user = await pool.query(checkUserQuery, [email]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid credentials.");
    }

    //CHECKING PASSWORD
    const isPasswordValid = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!isPasswordValid) {
      return res.status(401).json("Invalid credentials.");
    }

    //COOKIE FOR ENABLING LOGOUT
    res.cookie("perntoken", user.rows[0].id, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json("Login successful.");
  } catch (error) {
    res.status(500).json("Internal server error.");
  }
};

//USER LOGOUT
export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("perntoken");
    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    res.status(500).json({ error: "Error logging out." });
  }
};
