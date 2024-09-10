import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function to update name
export default async function UpdateName(req, res) {
  try {
    const email = req.body.email;
    const fullName = req.body.name;

    if (!email || !fullName) {
      console.log("content empty no email or fullname on username.js edit");
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }

    const result = await sql`UPDATE createAcc
      SET username = ${fullName}
      WHERE email = ${email};`;

    if (result.error) {
      console.log("Database Error:", result.error);
      return { error: "Database error" };
    }

    res.json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
