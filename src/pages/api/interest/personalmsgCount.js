import { sql } from "@vercel/postgres";
import dotenv from "dotenv";
dotenv.config();

export default async function PersonalMsgCount(req, res) {
  try {
    const { email } = req.body; // Retrieve email from request body

    const result = await sql`
    SELECT * FROM messages 
    WHERE status = 0 AND receiver_email = ${email}
       
`;

    if (result.rows.length === 0) {
      console.log("No data found in the 'messages' table");
      return res.status(404).json({ error: "No data found" });
    }

    console.log("data", result.rows);
    return res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
