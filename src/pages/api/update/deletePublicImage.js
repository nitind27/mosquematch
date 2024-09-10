import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function To  profile
export default async function deletePublicImage(req, res) {
  try {
    const imageData = req.body;
    console.log("Function starsedase");

    // Delete the image from the database
    try {
      const push = await sql`
        DELETE FROM publicpicture 
        WHERE email = ${imageData.email} AND picture = ${imageData.image};
      `;
      console.log("deleted");
      res.json({ message: "Deleted" });
    } catch (error) {
      console.log("ERROR: ", error);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
