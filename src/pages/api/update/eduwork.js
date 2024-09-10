import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function to update name
export default async function UpdateEduwork(req, res) {
  try {
    console.log("Function Started");
    const email = req.body.email;
    const data = req.body.data;

    if (!email || !data) {
      console.log("content empty no email or fullname on eduwork.js edit");
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }

    console.log("data", data);
    const result = await sql`UPDATE createAcc 
    SET 
        eduwork_education = ${data.edulevel},
        eduwork_subject = ${data.subject},
        eduwork_profession = ${data.profession},
        eduwork_job = ${data.job},
        eduwork_language1 = ${data.language1},
        eduwork_language2 = ${data.language2}
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
