import { pool } from "../index.js";

export const getUsers = async (req, res) => {
    try {
        const allUsers = await pool.query("SELECT * FROM users");

        res.status(200).json(allUsers.rows);
    } catch (error) {
        res.status(500).json("Internal server error.");
    }
}