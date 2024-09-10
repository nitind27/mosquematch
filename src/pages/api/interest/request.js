import { sql } from "@vercel/postgres";
const dotenv = require("dotenv");
dotenv.config();
const messageText = "Hi, I am requesting to see your profile pictures, please kindly share them";

export default async function Request(req, res) {
  try {
    // Get email from body
    const requested = req.body.viewed;
    const request = req.body.viewer;

    // Check if email is valid
    if (!request || requested === "") {
      return res.status(400).json({ error: "Email is required" });
    }

    try {
      // Insert request into the requests table
      const view = await sql`
        INSERT INTO requests (sender_email, receiver_email, status)
        SELECT ${request}, ${requested}, null
        WHERE NOT EXISTS (
          SELECT 1 FROM requests
          WHERE sender_email = ${request} AND receiver_email = ${requested}
        )
      `;

      // Insert message into the messages table if status is NULL
      const insertMessage = await sql`
        INSERT INTO messages (sender_email, receiver_email, message_text)
        SELECT ${request}, ${requested}, ${messageText}
        WHERE EXISTS (
          SELECT 1 FROM requests
          WHERE sender_email = ${request} AND receiver_email = ${requested} AND status IS NULL
        )
      `;

      res.json("Requested");
    } catch (error) {
      console.log("Error while inserting into verify table", error);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error on imam/verifyEmail" });
  }
}