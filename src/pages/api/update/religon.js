import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function to update name
export default async function UpdateReligon(req, res) {
  try {
    console.log("Function Started");
    const email = req.body.email;
    const data = req.body.data;

    if (!email || !data) {
      console.log("content empty no email or fullname on religon.js edit");
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }

    console.log("data", data);
    const result = await sql`UPDATE createAcc 
    SET 
        religion_religious = ${data.religious},
        religion_sector = ${data.sector},
        religion_hijab = ${data.hijab},
        religion_beard = ${data.bread},
        religion_revert = ${data.revert},
        religion_halal = ${data.halal},
        religion_pray = ${data.pray},
        religon_quran = ${data.quran}
    WHERE 
        email = ${email};`;

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
