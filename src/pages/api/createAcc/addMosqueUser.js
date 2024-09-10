import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function To increase views when clicking view bio  button
export default async function AddMosqueUser(req, res) {
  try {

    const content = req.body;

    try {
      const result =
        await sql`INSERT INTO mosques (email, latitude, longitude, type, status) VALUES (${content.email}, ${content.lat}, ${content.lng}, ${content.mosque}, 1);`;
      res.json({ message: "Success" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error in query adding MosqueData" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
