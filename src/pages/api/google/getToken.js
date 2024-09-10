const dotenv = require("dotenv");
dotenv.config();

const jwt = require("jsonwebtoken");

const KEY = "safasfgasgasasvasdfva";

export default async function GetToken(req, res) {
  try {
    const { id } = req.body;

    const token = jwt.sign({ id }, KEY);

    res.json({ token });
  } catch (error) {
    console.log("Error cought on creating token /getToken.js: ", error);
    res
      .status(500)
      .json({ error: "Internal server error related to /getToken.js" });
  }
}
