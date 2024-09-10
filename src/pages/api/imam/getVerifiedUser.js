import { sql } from "@vercel/postgres";
import axios from "axios";

const dotenv = require("dotenv");
dotenv.config();

export default async function VerifiedUserGET(req, res) {
  try {
    console.log("function start");
    //Get email from body
    const email1 = req.body;

    //Check if email is valid
    if (!email1 || email1 === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    //Check if email is present in verify table as well
    try {
      const imamMosque = await sql`
  SELECT type
  FROM mosques
  WHERE email = ${email1};
`;
const checkEmail4 = await sql`
    SELECT 
        createAcc.*, 
        CONCAT('[', STRING_AGG(CONCAT('[', m.latitude, ',', m.longitude, ',\"', m.type, '\"]'), ','), ']') AS locations, 
        ARRAY_AGG(m.type) AS types
    FROM 
        createAcc
    JOIN 
        mosques m ON createAcc.email = m.email
    LEFT JOIN 
        verify v ON createAcc.email = v.user_email
    WHERE 
        createAcc.gender = 'male'
        AND createAcc.email != ${email1} 
        AND v.imam_email = ${email1}
        AND v.verification = 'Verified'
        AND m.type = ANY (${imamMosque.rows.map((imam) => imam.type)})
        AND NOT EXISTS (
            SELECT 1
            FROM block
            WHERE block.receiver_email = createAcc.email
        )
    GROUP BY 
        createAcc.email;
`;


      const uniqueFilteredUsers = Array.from(
        new Set(checkEmail4.rows.map((user) => user.email))
      ).map((email) => checkEmail4.rows.find((user) => user.email === email));

      res.json({ data: uniqueFilteredUsers });

      if (checkEmail4.rows.length === 0) {
        return res.status(400).json({ error: "Email is not verified" });
      }
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
