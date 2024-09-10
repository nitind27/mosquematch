import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function GetAccessImage(req, res) {
  try {
    //Get email from body
    const viewer = req.body.viewer;
    const viewed = req.body.viewed;

    //Check if email is valid
    if (!viewer || viewer === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    //Check if email is already in use
    try {
      const result = await sql`SELECT status
      FROM requests
      WHERE sender_email = ${viewer}
      AND receiver_email = ${viewed};`;

      res.json({ access: result.rows });
    } catch (error) {
      console.log("Error in getAccess", error);
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Internal server error on imam/verifyEmail" });
  }
}
