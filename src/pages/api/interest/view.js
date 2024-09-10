import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function Views(req, res) {
  try {
    //Get email from body
    const viewed = req.body.viewed;
    const viewer = req.body.viewer;

    //Check if email is valid
    if (!viewed || viewed === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    //Check if email is already in use
    try {
      const view = await sql`INSERT INTO views (viewer_email, viewed_email)
      VALUES (${viewer}, ${viewed});`;

      res.json({ msg: "Viewed" });
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
