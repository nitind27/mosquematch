import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function To get mosques user selected
export default async function GetUser(req, res) {
  try {
    const email = req.body;
    if (!email) {
      console.log("no email found on get user data mosques");
      res.status(400).json({ error: "Content cannot be empty on addInfoAcc." });
      return;
    }

    try {
      const result = await sql`SELECT * FROM mosques WHERE email=${email}`;
  
      if (result) {
        const array1 = result.rows; //Converting to another format

        const newArray = array1.map(({ email, latitude, longitude, type }) => ({
          location: {
            lat: parseFloat(latitude),
            lng: parseFloat(longitude),
          },
          name: type, // You can modify this field as needed s
          type: "mosque2", // Hardcoded as "mosque" for icon
        }));

        res.json(newArray); //Now we have same format for user selected array and closest mosques array
      }
    } catch (error) {
      return res.status(500).json({ error: "Error in query addview" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
