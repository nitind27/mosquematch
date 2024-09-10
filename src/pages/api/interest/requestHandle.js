import { sql } from "@vercel/postgres";
const dotenv = require("dotenv");
dotenv.config();

export default async function RequestMe(req, res) {
  try {
    //Get email from body
    const sender = req.body.sender;
    const receiver = req.body.receiver;
    const status = req.body.approve;

    console.log("Status: ", status);
    console.log("Sender: ", sender);
    console.log("Receiver: ", receiver);

    let messageText;

    // Check if status is 'approved'
    if (status === "approved") {
      messageText = "You can now view my pictures.";
    } else {
      messageText = "I am not interested in sharing my pictures at the moment.";
    }

    // Update request status
    await sql`
      UPDATE requests
      SET status = ${status}
      WHERE sender_email = ${sender} AND receiver_email = ${receiver};
    `;

    // Insert message into messages table
    await sql`
      INSERT INTO messages (sender_email, receiver_email, message_text)
      VALUES (${receiver}, ${sender}, ${messageText});
    `;

    res.json("Request updated and message sent");
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
