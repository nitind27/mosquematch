import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function To  profile
export default async function setProfileImgPublic(req, res) {
  try {
    const imagesData = req.body;

    for (const imageData of imagesData.image) {
      // Check if the email has less than 6 entries in the publicpicture table
      const check = await sql`
        SELECT COUNT(*) AS email_count 
        FROM publicpicture 
        WHERE email = ${req.body.email};
      `;

      if (check.rows[0].email_count < 6) {
        // Insert the image into the database
        const push = await sql`
          INSERT INTO publicpicture (email, type, privacy, picture, backup) 
          VALUES (${imagesData.email}, ${imagesData.type}, ${imageData.privacy}, ${imageData.picture}, ${imageData.backup});
        `;
      } else {
        res.json({ message: "Profile Photos Limit Reached" });
      }
    }

    res.json({ message: "Profile Photos Added" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
