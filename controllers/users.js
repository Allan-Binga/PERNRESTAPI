import { pool } from "../index.js";

//GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");

    res.status(200).json(allUsers.rows);
  } catch (error) {
    res.status(500).json("Internal server error.");
  }
};

//GET SINGLE USER
export const getUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (user.rows.length === 0) {
      return res.status(404).json("User not found.");
    }

    res.status(200).json(user.rows[0]);
  } catch (error) {
    res.status(500).json("Internal server error.");
  }
};

//UPDATE USER
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (user.rows.length === 0) {
      return res.status(404).json("User not found.");
    }

    const updateUserQuery =
      "UPDATE users SET username = $1, email = $2 WHERE id = $3 RETURNING *";
    const updatedUser = await pool.query(updateUserQuery, [
      username,
      email,
      id,
    ]);

    res.status(200).json(updatedUser.rows[0]);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json("Internal server error.");
  }
};

//DELETE USER
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (user.rows.length === 0) {
      return res.status(404).json("User not found.");
    }

    await pool.query("DELETE FROM users WHERE id = $1", [id]);

    res.status(200).json("User deleted successfully.");
  } catch (error) {
    res.status(500).json("Internal server error.");
  }
};
