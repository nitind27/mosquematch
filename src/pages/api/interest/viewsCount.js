import { sql } from "@vercel/postgres";
import dotenv from "dotenv";
dotenv.config();

export default async function ViewsCount(req, res) {
  try {
    const { email } = req.body; // Retrieve email from request body

    const result = await sql`
    SELECT * FROM views 
    WHERE views = 0 AND viewed_email = ${email}
    
    UNION
    
    SELECT * FROM heart 
    WHERE views = 0 AND hearted_email = ${email}    
`;

    if (result.rows.length === 0) {
      console.log("No data found in the 'requests' table");
      return res.status(404).json({ error: "No data found" });
    }
    
    console.log('data', result.rows);
    return res.json(result.rows);
  } catch (error) {
    console.error("Database error:", error.message);
    return res.status(500).json({ error: "Internal server error" });
  }
}
