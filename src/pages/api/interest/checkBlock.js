

import { sql } from "@vercel/postgres";
import dotenv from "dotenv";
dotenv.config();

export default async function CheckBlock(req, res) {
  try {
    const result = await sql`SELECT * FROM block`;


    if (result.rows.length === 0) {
      console.log("No data found in the 'requests' table");
      return res.status(404).json({ error: "No data found" });
    }

    return res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
