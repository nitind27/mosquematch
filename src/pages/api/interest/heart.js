import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function Heart(req, res) {
  try {
    //Get email from body
    const hearted = req.body.hearted;
    const hearter = req.body.hearter;

    //Check if email is valid
    if (!hearted || hearted === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    //Check if email is already in use
    try {
      const view = await sql`INSERT INTO heart (hearter_email, hearted_email)
      VALUES (${hearter}, ${hearted});`;

      res.json({ msg: "hearted" });
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
