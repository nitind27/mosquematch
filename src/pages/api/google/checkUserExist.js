import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

export default async function CheckUserExist(req, res) {
  console.log("CHECKING");
  try {
    const content = req.body.email;



    if (!content) {
      console.log("content empty");
      res.status(400).json({
        error: "Content cannot be empty on Check user exist.",
      });
      return;
    }

    const email = content;
  

    //Removed the Gender Data from result due to NULL Errors
    const result = await sql`SELECT * FROM createAcc WHERE email = ${email};`;


    if (result["rows"].length > 0) {
      res.json({ user: true });
    } else {
      res.json({ user: false });
    }
  } catch (error) {
    console.log("Error cought on creating token /getToken.js: ", error);
    res.status(500).json({
      error: "Internal server error related to /getToken.js",
    });
  }
}
