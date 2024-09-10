import checkDatabaseConnection from "@/lib/db2";
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

// Function to encrypt data using AES (Advanced Encryption Standard) encryption
function encryptData(data, key, iv) {
  const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);

  let encryptedData =
    cipher.update(data, "utf8", "base64") + cipher.final("base64");
  return encryptedData;
}

//----------------^^^^^^^^^^^^^^^^^^^^^^^^^----------------->

//---------------Create Account-------------------------->
export default async function CreateAccount(req, res) {
  try {
    const content = req.body;
   
    if (!content) {
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }

    const email = content.email;

    const password = content.password;

    const encryptedPassword = encryptData(password, secretKey, iv);
 
    const fullName = content.firstName + " " + content.lastName;

    const result =
      await sql`INSERT INTO createacc(email, password, username) VALUES(${email}, ${encryptedPassword}, ${fullName});`;

    try {
      const result2 = await sql`INSERT INTO activeTime (email, active_since) 
      VALUES (${email}, CURRENT_TIMESTAMP) 
      ON CONFLICT (email) DO UPDATE SET active_since = EXCLUDED.active_since;`;
    } catch (error) {
      console.error("Error inserting timestamp on signUp", error);
    }

    res.json({
      check: true,
      message: content.email,
      name: fullName,
      token: jwt.sign(
        {
          email: content.email,
          name: fullName,
        },
        KEY
      ),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
