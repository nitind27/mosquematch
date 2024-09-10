import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function getProfileImgPublic(req, res) {
  try {
    const email = req.body.email;
    try {
      const result =
        await sql`SELECT * FROM publicpicture WHERE email = ${email};`;

      // Initialize an array to store image strings
      const imageArray = [];
      console.log("FUNCTION STARTED", result.rowCount);

      // Iterate through the result set
      for (const row of result.rows) {
        try {

          const imageBase64 = row.picture.toString("base64");

          const backupBase64 = row.backup.toString("base64");

          const privacy = row.privacy;

          imageArray.push({
            image: imageBase64,
            privacy,
            backup: backupBase64,
          });
        } catch (error) {
          console.error("Error processing row:", error);
        }
      }
      res.json({ images: imageArray });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error in retrieving Profile Photos" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
