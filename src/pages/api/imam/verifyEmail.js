import { sql } from "@vercel/postgres";
import axios from "axios";

const dotenv = require("dotenv");
dotenv.config();

//Function to insert into verify table
export default async function VerifyEmail(req, res) {
  try {
    //Get email from body
    const email1 = req.body.email1;

    const email2 = req.body.email2;

    const number = req.body.number;

    let check = "";

    if (number === 0) {
      check = "Verified";
    } else {
      check = "Denied";
    }

    //Check if email is valid
    if (!email1 || email2 === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    //Check if email is already in use
    try {
      console.log("Inserting");
      const checkEmail =
        await sql`INSERT INTO verify (user_email, imam_email, verification) VALUES
      (${email1}, ${email2}, ${check})`;
      res.json({ message: "Email sent" });
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
