import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function to retrieve all data on email match
export default async function GetInfoTime(req, res) {
  try {
    const content = req.body.user;

    if (!content) {
      console.log("content empty no email");
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }
    const email = content;

    const result = await sql`SELECT * from activetime`;

    if (result.error) {

      return { error: "Database error" };
    }

    res.json({ data: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
