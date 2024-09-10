import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function ViewedMe(req, res) {
  try {
    //Get email from body
    const email = req.body.email;
    console.log("email", email.email);
    
    //Check if email is valid
    if (!email || email === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    //Check if email is already in use
    try {
      //     const result = await sql`
      // SELECT ca.*,
      //        CONCAT('[', STRING_AGG(CONCAT('[', m.latitude, ',', m.longitude, ',\"', m.type, '\"]'), ','), ']') AS locations,
      //        ARRAY_AGG(m.type) AS types
      // FROM views v
      // JOIN createAcc ca ON v.viewer_email = ca.email
      // JOIN mosques m ON ca.email = m.email
      // WHERE v.viewed_email = ${email}
      // GROUP BY ca.email;
      // `;
      const result = await sql`
   SELECT ca.*, 
       CONCAT('[', STRING_AGG(CONCAT('[', m.latitude, ',', m.longitude, ',\"', m.type, '\"]'), ','), ']') AS locations, 
       ARRAY_AGG(m.type) AS types,
       at.active_since
FROM views v
JOIN createAcc ca ON v.viewer_email = ca.email
JOIN mosques m ON ca.email = m.email
LEFT JOIN activetime at ON ca.email = at.email
WHERE v.viewed_email = ${email}
  AND NOT EXISTS (
    SELECT 1
    FROM block b
    WHERE (b.sender_email = ${email} AND b.receiver_email = ca.email) 
       OR (b.receiver_email = ${email} AND b.sender_email = ca.email)
  )
GROUP BY ca.email, at.active_since;

  `;

      console.log("result 4234234324", result);
      res.json({ data: result.rows });
    } catch (error) {
      console.log("Error while inserting into verify table", error);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal server error on imam/verifyEmail" });
  }
}
