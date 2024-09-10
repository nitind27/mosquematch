import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function to update name
export default async function UpdateName(req, res) {
  try {
    console.log("Function Started");
    const email = req.body.email;
    const data = req.body.data;

    if (!email || !data) {
      console.log("content empty no email or fullname on username.js edit");
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }

    console.log("data", data);
    const result = await sql`UPDATE createAcc 
    SET 
        aboutme_location = ${data.location},
        aboutme_country = ${data.country},
        aboutme_day = ${data.day},
        aboutme_month = ${data.month},
        aboutme_year = ${data.year},
        aboutme_tag = ${data.tag}, 
        aboutme_about = ${data.about},
        aboutme_looking = ${data.looking}
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
