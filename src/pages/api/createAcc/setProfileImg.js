import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function To  profile
export default async function setProfileImg(req, res) {
  try {
    console.log("First try started");
    const content = req.body;

    const decodedImage = Buffer.from(req.body.image, "base64");
    const email = req.body.email;
    const type = req.body.type;
    const privacy = req.body.privacy;
    const backup = req.body.backup;

    try {
      const result = await sql`
      INSERT INTO picture (email, type, privacy, picture, backup) 
      VALUES (${email}, ${type}, ${privacy}, ${decodedImage}, ${backup})
      ON CONFLICT (email) DO UPDATE SET
          type = excluded.type,
          privacy = excluded.privacy,
          picture = excluded.picture,
          backup = excluded.backup;
  `;
      res.json({ message: "Profile Photo Added" });
    } catch (error) {
      console.log("Error: ", error);
      return res.status(500).json({ error: "Error in adding Profile Photo" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
