import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function to retrieve email address by username
export default async function GetInfoAcc(req, res) {
  try {
    const user = req.body.user;

    if (!user) {
      console.log("content empty no email on getUsername.js");
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }

    const result =
      await sql`SELECT email FROM createAcc WHERE username = ${user} UNION SELECT email FROM admin WHERE username = ${user};`;
    console.log("result for request:", result.rows[0].email);
    if (result.error) {
      console.log("Database Error:", result.error);
      return { error: "Database error" };
    }

    res.json({ email: result.rows[0].email });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
