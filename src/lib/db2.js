import { sql } from "@vercel/postgres";

export default async function checkDatabaseConnection() {
  try {
    // Attempt to execute a simple query to check the connection
    await sql`SELECT 1`;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return "faliure";
  }
}
