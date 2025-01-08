import express from "express";
import dotenv from "dotenv";
import pkg from "pg";
const { Pool } =pkg;
import authRoute from "./routes/auth.js";
import userRoute from "./routes/users.js";

dotenv.config();
const app = express();

app.use(express.json());

//POSTGRESQL CONNECTION
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

pool
  .connect()
  .then(() => console.log("Database connected successfully."))
  .catch((error) => console.log("Error connecting to database", error));

//Auth Route
app.use("/pern/auth", authRoute);

//Users Route
app.use("/pern/users", userRoute);

//SERVER CONNECTION  
app.listen("5700", () => {
  console.log("Backend up and running.");
});

export { pool };

