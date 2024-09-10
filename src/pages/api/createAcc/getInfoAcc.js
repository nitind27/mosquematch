// import { sql } from "@vercel/postgres";

// const dotenv = require("dotenv");
// dotenv.config();

// //Function to retrieve all data on email match
// export default async function GetInfoAcc(req, res) {
//   try {
//     const content = req.body;

//     if (!content) {
//       console.log("content empty no email");
//       res.status(400).json({ error: "Content cannot be empty." });
//       return;
//     }
//     const email = content;

//     const result =
//       await sql`SELECT createAcc.*, CONCAT('[', STRING_AGG(CONCAT('[', mosques.latitude, ',', mosques.longitude, ',\"', mosques.type, '\"]'), ','), ']') AS locations, ARRAY_AGG(mosques.type) AS types FROM createAcc JOIN mosques ON createAcc.email = mosques.email WHERE createAcc.email != ${email} GROUP BY createAcc.email;`;
//     console.log("DATA RETRIEVED");
//     if (result.error) {
//       console.log("Database Error:", result.error);
//       return { error: "Database error" };
//     }

//     res.json({ user: result });
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// }

import { sql } from "@vercel/postgres";
const dotenv = require("dotenv");
dotenv.config();

// Function to retrieve all data on email match
export default async function GetInfoAcc(req, res) {
  try {
    const content = req.body;

    if (!content) {
      console.log("Content empty, no email");
      res.status(400).json({ error: "Content cannot be empty." });
      return;
    }

    const email = content.email;
    const mosqueType = content.mosqueType || [];

    // Adjusted query to handle empty mosqueType
    const query = sql`SELECT 
      createAcc.*, 
      CONCAT(
          '[', 
          STRING_AGG(CONCAT('[', mosques.latitude, ',', mosques.longitude, ',\"', mosques.type, '\"]'), ','), 
          ']'
      ) AS locations, 
      ARRAY_AGG(mosques.type) AS types 
    FROM 
      createAcc 
    JOIN 
      mosques 
    ON 
      createAcc.email = mosques.email 
    WHERE 
      createAcc.email != ${email}
    GROUP BY 
      createAcc.email
    HAVING 
      (${mosqueType.length === 0} OR BOOL_OR(mosques.type = ANY(${mosqueType})));
    `;

    const result = await query;


    if (result.error) {
      console.log("Database Error:", result.error);
      res.status(500).json({ error: "Database error" });
      return;
    }

    res.json({ user: result });
  } catch (error) {
    console.log("Internal Server Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
