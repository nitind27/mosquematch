import excuteQuery from "@/lib/db";

const dotenv = require("dotenv");
dotenv.config();

export default async function Check(req, res) {
  try {
    res.json({ message: "Success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
