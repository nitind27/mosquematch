import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function HeartedByMe(req, res) {
  try {
    //Get email from body
    const email = req.body.email;

    //Check if email is valid
    if (!email || email === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    //Get All emails that the user has hearted
    try {
      //       const getEmails = await sql`
      //       SELECT ca.*,
      //       CONCAT('[', STRING_AGG(CONCAT('[', m.latitude, ',', m.longitude, ',\"', m.type, '\"]'), ','), ']') AS locations,
      //       ARRAY_AGG(m.type) AS types
      // FROM heart h
      // JOIN createAcc ca ON h.hearted_email = ca.email
      // JOIN mosques m ON ca.email = m.email
      // WHERE h.hearter_email = ${email}
      // GROUP BY ca.email;
      // `;
      //       const getEmails = await sql`
      //       SELECT ca.*,
      //       CONCAT('[', STRING_AGG(CONCAT('[', m.latitude, ',', m.longitude, ',\"', m.type, '\"]'), ','), ']') AS locations,
      //       ARRAY_AGG(m.type) AS types
      // FROM heart h
      // JOIN createAcc ca ON h.hearted_email = ca.email
      // JOIN mosques m ON ca.email = m.email
      // WHERE h.hearter_email = ${email}
      // GROUP BY ca.email;
      // `;
      const getEmails = await sql`
      SELECT ca.*, 
             CONCAT('[', STRING_AGG(CONCAT('[', m.latitude, ',', m.longitude, ',\"', m.type, '\"]'), ','), ']') AS locations, 
             ARRAY_AGG(m.type) AS types,
             at.active_since
      FROM heart h
      JOIN createAcc ca ON h.hearted_email = ca.email
      JOIN mosques m ON ca.email = m.email
      LEFT JOIN activetime at ON ca.email = at.email
      LEFT JOIN block b ON (b.sender_email = ${email} AND b.receiver_email = ca.email) 
                       OR (b.receiver_email = ${email} AND b.sender_email = ca.email)
      WHERE h.hearter_email =${email}
        AND b.sender_email IS NULL
        AND b.receiver_email IS NULL
      GROUP BY ca.email, at.active_since;
`;
      res.json({ data: getEmails.rows });
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
