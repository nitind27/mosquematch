import axios from "axios";
import { sql } from "@vercel/postgres";

export default async function RemoveMosque(req, res) {
  const email = req.body.email;
  const name = req.body.name;
  if (!email) {
    console.log("empty no email");
    res.status(400).json({ error: "Content cannot be empty." });
    return;
  }

  try {
    const result = await sql`DELETE FROM mosques
    WHERE type = ${name} AND email = ${email};`;

    res.json({ msg: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
