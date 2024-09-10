import { sql } from "@vercel/postgres";
import axios from "axios";

const dotenv = require("dotenv");
dotenv.config();

//Function to add all info after account is created
export default async function AddInfoAcc(req, res) {
  try {
    const content = req.body;
    if (!content) {
      console.log("content empty");
      res.status(400).json({ error: "Content cannot be empty on addInfoAcc." });
      return;
    }
    //Now adding mosques
    const apiKey = process.env.MAP_API; // Replace with your API key
    const formattedData = [];

    // Iterate through each place ID and fetch details

    for (const place of content.mosque) {
      const apiUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place.id}&key=${apiKey}`;

      try {
        const response = await axios.get(apiUrl);

        if (response.status === 200) {
          const result = response.data.result;
          const placeData = {
            location: {
              lat: result.geometry.location.lat,
              lng: result.geometry.location.lng,
            },
            name: result.name,
            type: "mosque", // You can customize the type as needed
          };

          // Add the formatted data to the array
          formattedData.push(placeData);
        } else {
          console.error(
            `Error getting place details for ${place.name}:`,
            response.data
          );
        }
      } catch (error) {
        console.error(`Error making API request for ${place.name}:`, error);
      }
    }
  

    for (const mosque of formattedData) {
      const result =
        await sql`INSERT INTO mosques (email, latitude, longitude, type)
   VALUES
   (${content.email}, ${mosque.location.lat}, ${mosque.location.lng}, ${mosque.name});`;
    
    }

    res.json({
      username: "Info Added successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
}
