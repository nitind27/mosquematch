import { sql } from "@vercel/postgres";
const dotenv = require("dotenv");
dotenv.config();

export default async function getProfileImgPublicBulk(req, res) {
  try {
    const { data } = req.body;

    // Initialize an array to store image data
    const imageArray = [];

    // Loop through each email in the data array
    for (const email of data) {
      try {

        // Fetch profile images for the current email from the database
        const result = await sql`SELECT * FROM publicpicture WHERE email = ${email};`;

        // Iterate through the result set and push image data to the array
        for (const row of result.rows) {
          const imageBase64 = row.picture.toString("base64");
          const backupBase64 = row.backup.toString("base64");
          const privacy = row.privacy;

          imageArray.push({
            email: email,
            image: imageBase64,
            backup: backupBase64,
            privacy: privacy,
          });
        }
      } catch (error) {
        console.error("Error processing email:", email, "Error:", error);
      }
    }

    // Return the array of image data as JSON response
    res.json({ images: imageArray });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
