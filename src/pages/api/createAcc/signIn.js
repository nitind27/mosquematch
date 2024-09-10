import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");

const KEY = "safasfgasgasasvasdfva";

//-------------------Aes Encryption-------------------------->

const crypto = require("crypto");

const secretKey = Buffer.from(process.env.SECRET_KEY, "hex");

const keyBuffer = Buffer.from(process.env.SECRET_KEY, "hex");

const iv = Buffer.from(process.env.SECRET_IV, "hex");

// Function to decrypt data using AES (Advanced Encryption Standard)
function decryptData(encryptedData, key, iv) {
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);

  let decryptedData =
    decipher.update(encryptedData, "base64", "utf8") + decipher.final("utf8");
  return decryptedData;
}

//----------------^^^^^^^^^^^^^^^^^^^^^^^^^----------------->

//---------------SignIn Account-------------------------->
export default async function SignIn(req, res) {
  try {
    const content = req.body;


    if (!content) {
      console.log("content empty");
      res.status(400).json({ error: "Content cannot be empty on sign in." });
      return;
    }
    const email = content.email;
    const password = content.password;

    try {
      //checking if gender is set to confirm user is signedUp
      const check = await sql`
      SELECT gender FROM createAcc WHERE email = ${email};`;

      const gender = check.rows[0].gender;

      if (gender === null) {
        res.status(400).json({ error: "User is not signed up." });
      } else {
        console.log("User is signed up");
      }
    } catch (error) {
      console.log("Error on sign in backend ./signIn.js", error);
    }

    const result = await sql`SELECT * FROM createAcc WHERE email = ${email} AND user_status=1`;
    if (result.error || result.length === 0 || !result) {
    
      return { error: "Database error" };
    }
  
    const user = result.rows[0];

    if (!user) {
      res.status(400).json({ error: "User does not exist." });
    }

    console.log("Username: ", user.username);

    const decryptedPassword = decryptData(user.password, keyBuffer, iv);

    if (password !== decryptedPassword) {
      console.log("Wrong password");
      res.status(400).json({ error: "Wrong password." });
    }
    try {
      const result2 = await sql`INSERT INTO activeTime (email, active_since) 
      VALUES (${email}, CURRENT_TIMESTAMP) 
      ON CONFLICT (email) DO UPDATE SET active_since = EXCLUDED.active_since;`;
    } catch (error) {
      console.error("Error on updating timestamp on signin", error);
    }

    const token = jwt.sign({ id: user.id }, KEY);
    console.log("Token: ", token);

    res.json({
      token,
      email: user.email,
      name: user.username,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
