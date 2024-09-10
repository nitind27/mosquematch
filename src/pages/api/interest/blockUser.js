//Retrieving Blocked users

import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function BlockUser(req, res) {
  try {
    //Get email from body
    const reciver = req.body.blocked;
    const sender = req.body.blocker;

    //Check if email is valid
    if (!reciver || reciver === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    //Get All emails that the user has hearted
    try {
      const getEmails =
        await sql`INSERT INTO block (sender_email, receiver_email)
      VALUES (${sender}, ${reciver});`;

      res.json({ data: "success block" });
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
