import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function to check if email exists
export default async function CheckEmail(req, res) {
  try {
    const content = req.body.email;
    console.log("content forgot: ", content);

    if (!content) {
      console.log("content empty no email");
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }
    const email = content;

    const result = await sql`SELECT * FROM createAcc WHERE email = ${email};`;

    if (result.error) {
      console.log("Database Error CheckEmail forgot:", result.error);
      return { error: "Database error" };
    }
    console.log("Result recieved from db: ", result);
    if (result.rowCount === 0) {
      console.log("Email not found");
      res.json({ check: false });
      return;
    }

    res.json({ check: true });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
