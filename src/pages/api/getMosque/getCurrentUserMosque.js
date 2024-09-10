import axios from "axios";
import { sql } from "@vercel/postgres";

export default async function GetCurrentMosque(req, res) {
  const email = req.body.email;
  if (!email) {

    res.status(400).json({ error: "Content cannot be empty." });
    return;
  }

  try {
    const result = await sql`SELECT * from mosques where email = ${email}`;

    res.json({ mosques: result.rows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
