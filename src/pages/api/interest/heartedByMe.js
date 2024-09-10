import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function HeartedByMe(req, res) {
  try {
    //Get email from body
    const emails = req.body.data;
    const hearter = req.body.user;

    //Check if email is valid
    if (!emails || emails === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    //Get All emails that the user has hearted
    try {
      const getEmails = await sql`SELECT hearted_email
      FROM heart
      WHERE hearter_email = ${hearter} AND hearted_email = ANY(${emails})`;

      const heartedEmails = getEmails.rows.map((row) => row.hearted_email);

      res.json({ data: heartedEmails });
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
