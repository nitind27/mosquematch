import { sql } from "@vercel/postgres";

const dotenv = require("dotenv");
dotenv.config();

//Function to update name
export default async function UpdatePersonal(req, res) {
  try {
    console.log("Function Started");
    const email = req.body.email;
    const data = req.body.data;

    if (!email || !data) {
      console.log("content empty no email or fullname on username.js edit");
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }

    console.log("data", data);
    const result = await sql`UPDATE createAcc 
    SET 
        personal_citizen = ${data.citizen},
        personal_origin = ${data.origin},
        personal_relocate = ${data.relocate},
        personal_income = ${data.income},
        personal_marriage = ${data.marriage},
        personal_marital = ${data.marital}, 
        personal_children1 = ${data.children1},
        personal_children2 = ${data.children2},
        personal_living = ${data.living},
        personal_height = ${data.height},
        personal_build = ${data.build},
        personal_smoke = ${data.smoke},
        personal_drink = ${data.drink},
        personal_disability = ${data.disability},
        personal_long = ${data.long},
        personal_ethnicity = ${data.ethniciting}
    WHERE 
        email = ${email};`;

    if (result.error) {
      console.log("Database Error:", result.error);
      return { error: "Database error" };
    }

    res.json({ message: "success" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
