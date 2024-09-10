import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function to retrieve all data on email match
export default async function GetBlocked(req, res) {
  try {
    const content = req.body;

    if (!content) {
      console.log("content empty no email");
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }
    const email = content;

    const result = await sql`
      SELECT createAcc.*, 
             CONCAT('[', STRING_AGG(CONCAT('[', mosques.latitude, ',', mosques.longitude, ',\"', mosques.type, '\"]'), ','), ']') AS locations, 
             ARRAY_AGG(mosques.type) AS types 
      FROM createAcc 
      JOIN mosques ON createAcc.email = mosques.email 
      JOIN block ON createAcc.email = block.receiver_email 
      WHERE createAcc.email != ${email} 
      GROUP BY createAcc.email;
  `;

    if (result.error) {
 
      return { error: "Database error" };
    }

    res.json({ user: result });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
