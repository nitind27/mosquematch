import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function getProfileImgBulk(req, res) {
  try {
    const resultArray = [];
    const { data } = req.body;
    try {
   
      for (const email1 of data) {
        const email = email1;
  
        // Query the database to retrieve the picture based on the email
        const result =
          await sql`SELECT picture FROM picture WHERE email = ${email};`;

        if (result.rows.length > 0 && result.rows[0].picture !== null) {
          // Decode the picture
          let imageBase64 = Buffer.from(result.rows[0].picture);
          imageBase64 = imageBase64.toString("utf-8");
          imageBase64 = Buffer.from(JSON.parse(imageBase64).data);
          imageBase64 = imageBase64.toString("base64");
          // Store the decoded image in the result array
          resultArray.push({ email, image: imageBase64 });
        } else {
          //No pictures found for the email and continue
        }
      }
      res.json({ image: resultArray });
    } catch (error) {
      return res.status(500).json({ error: "Error in adding Profile Photo" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
