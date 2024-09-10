import { sql } from "@vercel/postgres";
import dotenv from "dotenv";

dotenv.config();

// Function To Send Message
export default async function SendMessage(req, res) {
  try {
    console.log("Message Content: ", req.body);
    const content = req.body;

    if (!content) {
      console.log("content empty");
      res
        .status(400)
        .json({ error: "Content cannot be empty on send message." });
      return;
    }

    const { senderEmail, receiverEmail, messageText } = content;
    const message =
      "Thanks for reporting the person, can you kindly share what the issue was";

    // Fetch admin email
    const adminResult = await sql`
      SELECT email FROM admin LIMIT 1;
    `;

    if (adminResult.rowCount === 0) {
      res.status(500).json({ error: "Admin email not found." });
      return;
    }

    const adminEmail = adminResult.rows[0].email;

    // Insert into reports table
    const reportResult = await sql`
      INSERT INTO reports (sender_email, reported_email, message_text, timestamp)
      VALUES (${senderEmail}, ${receiverEmail}, ${messageText}, CURRENT_TIMESTAMP);
    `;

    // Insert into messages table
    const messageResult = await sql`
      INSERT INTO messages (sender_email, receiver_email, message_text)
      VALUES (${adminEmail}, ${senderEmail}, ${message});
    `;

    res.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
