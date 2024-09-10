import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");

const KEY = "safasfgasgasasvasdfva";

export default async function GetToken(req, res) {
  try {
    const { id } = req.body;

    const expiresIn = 30 * 60;
    console.log("id", id);

    const token = jwt.sign({ id }, KEY, { expiresIn });

    const decodedToken = jwt.decode(token);

    const decode = new Date(decodedToken.exp * 1000);

    // const result =
    //   await sql`INSERT INTO resetpassword(email, reset_token, expiration_time) VALUES(${id}, ${token}, ${decode});`;
    // if(!result) {
    //   res.status(500).json({ error: "Server sql error, user exitsts" });
    //   return;
    // }

    res.json({ token });
  } catch (error) {
    console.log("Error cought on creating token /getToken.js: ", error);
    res
      .status(500)
      .json({ error: "Internal server error related to /getToken.js" });
  }
}
