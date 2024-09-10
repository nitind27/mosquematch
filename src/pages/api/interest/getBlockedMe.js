//Retrieving Blocked users

import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function BlockedMe(req, res) {
  try {
    //Get email from body
    const email = req.body.user;

    //Check if email is valid
    if (!email || email === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    //Get All emails that the user has hearted
    try {
      const getEmails = await sql`SELECT sender_email
      FROM block
      WHERE receiver_email = ${email};`;

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
