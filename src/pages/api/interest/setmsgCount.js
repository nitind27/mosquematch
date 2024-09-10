import { sql } from "@vercel/postgres";
import checkDatabaseConnection from "@/lib/db2";

export default async function SetCount(req, res) {
  try {
    // Establish database connection
    await checkDatabaseConnection();

    // Extract data from request body
    const { email, user_status } = req.body;

    // Validate request body
    if (!email || !user_status) {
      return res
        .status(400)
        .json({ error: "Email and user_status are required." });
    }

    // Update views table
    const updateViewsResult = await sql`
      UPDATE messages
      SET status = ${user_status}
      WHERE receiver_email = ${email}
    `;

    // Send response
    res.json({
      success: true,
      message: "User status updated successfully",
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
