import { sql } from "@vercel/postgres";
import checkDatabaseConnection from "@/lib/db2";

export default async function setMosqueStatus(req, res) {
  try {
    // Establish database connection
    await checkDatabaseConnection();

    // Extract data from request body
    const { email, mosque_status, mosque_type } = req.body;

    // Validate request body
    if (!email ) {
      return res
        .status(400)
        .json({ error: "Email and user_status are required." });
    }

    // Update views table
    const updateViewsResult = await sql`
      UPDATE mosques
      SET status = ${mosque_status}
      WHERE email = ${email} AND type = ${mosque_type}
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
