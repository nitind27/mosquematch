import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function To increase views when clicking view bio button
export default async function AddInfoAcc(req, res) {
  try {

    const content = req.body;
    if (!content) {
      console.log("content empty");
      res.status(400).json({ error: "Content cannot be empty on addInfoAcc." });
      return;
    }
    const username = content.username;
    try {
      const result =
        await sql`UPDATE createAcc SET views = COALESCE(views, 0) + 1 WHERE username = ${username};`;
    } catch (error) {
      return res.status(500).json({ error: "Error in query addview" });
    }

    res.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
