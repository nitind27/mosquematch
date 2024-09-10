import { sql } from "@vercel/postgres";
import axios from "axios";

const dotenv = require("dotenv");
dotenv.config();

export default async function AwaitingUserGET(req, res) {
  try {
    console.log("function start");
    //Get email from body
    const email1 = req.body;

    //Check if email is valid
    if (!email1 || email1 === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    //Check if email is already in use
    try {
      console.log("Retrievieng");

      //Getting the current imam's mosque names
      const imamMosque = await sql`SELECT type
        FROM mosques
        WHERE email = ${email1};`;

      const checkEmail4 = await sql`
        SELECT 
            createAcc.*,
            (
            SELECT 
                STRING_AGG(CONCAT('[', mosques.latitude, ',', mosques.longitude, ',\"', mosques.type, '\"]'), ',')
            FROM 
                mosques
            WHERE 
                mosques.email = createAcc.email
            ) AS locations,
            (
            SELECT 
                ARRAY_AGG(mosques.type)
            FROM 
                mosques
            WHERE 
                mosques.email = createAcc.email
            ) AS types
        FROM 
            createAcc
        JOIN 
            mosques ON createAcc.email = mosques.email
        LEFT JOIN 
            verify v ON createAcc.email = v.user_email
        WHERE 
            createAcc.gender = 'male'
            AND createAcc.email != ${email1}
            AND v.imam_email = ${email1}
            AND v.verification IS NULL
            AND mosques.type = ANY (${imamMosque.rows.map((imam) => imam.type)})
              AND NOT EXISTS (
            SELECT 1
            FROM block
            WHERE block.receiver_email = createAcc.email
        )
        GROUP BY 
            createAcc.email;
    `;

      const uniqueEmails = new Set();

      // Filtering users in the same mosque as the imam and removing duplicates based on email
      const uniqueFilteredUsers = checkEmail4.rows.filter((user) => {
        if (!uniqueEmails.has(user.email)) {
          uniqueEmails.add(user.email);
          return true;
        }
        return false;
      });

      res.json({ user: uniqueFilteredUsers });

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
