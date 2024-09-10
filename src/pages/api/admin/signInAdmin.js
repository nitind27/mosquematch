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

    console.log("content: ", content);
    if (!content) {
      console.log("content empty");
      res
        .status(400)
        .json({ error: "Content cannot be empty on sign in admin." });
      return;
    }
    const email = content.email;
    const password = content.password;

    const result = await sql`SELECT * FROM admin WHERE email = ${email};`;

    if (result.error || result.length === 0 || !result) {
      console.log("Database Error:", result.error);
      return { error: "Database error" };
    }
    const user = result.rows[0];
    console.log("User: ", user);

    if (!user) {
      res.status(400).json({ error: "User does not exist." });
    }

    console.log("Username: ", user.username);

    console.log("Decrypting password: ", user.password);
    const decryptedPassword = decryptData(user.password, keyBuffer, iv);

    if (password !== decryptedPassword) {
      console.log("Wrong password");
      res.status(400).json({ error: "Wrong password." });
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
