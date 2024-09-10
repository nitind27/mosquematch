import axios from "axios";

export default async function GetMosques(req, res) {
  const input = req.body.input;
  const apiKey = process.env.MAP_API; // Replace with your actual API key
  const apiUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json";

  try {
    // Search for mosques
    const response = await axios.get(apiUrl, {
      params: {
        input: input,
        key: apiKey,
        types: "mosque",
        components: "country:uk", // Set the country to the UK
      },
    });

    // If there are predictions for mosques, return them
    if (response.data.predictions.length > 0) {
      const predictions = response.data.predictions.map((prediction) => ({
        id: prediction.place_id,
        name: prediction.description,
      }));
      return res.json(predictions);
    }

    // If there are no predictions for mosques, search by input to get place details
    const placeResponse = await axios.get(apiUrl, {
      params: {
        input: input,
        key: apiKey,
        components: "country:uk", // Set the country to the UK
      },
    });


    if (placeResponse.data.predictions.length > 0) {
      const placeName = placeResponse.data.predictions[0].description;

    
      // Extract the first word after the comma
      const secondCommaIndex = placeName.indexOf(
        ",",
        placeName.indexOf(",") + 1
      );
      const wordsAfterSecondComma = placeName
        .substring(secondCommaIndex + 1)
        .trim()
        .split(" ");
      const firstWordAfterComma = wordsAfterSecondComma.slice(0, 2).join(" ");

    
      // Search for mosques based on the first word after the comma
      if (firstWordAfterComma) {
        const response2 = await axios.get(apiUrl, {
          params: {
            input: firstWordAfterComma,
            key: apiKey,
            types: "mosque",
            components: "country:uk",
          },
        });

        // If there are predictions for mosques, return them
        if (response2.data.predictions.length > 0) {
          const mosques = response2.data.predictions.map((prediction) => ({
            id: prediction.place_id,
            name: prediction.description,
          }));
          return res.json(mosques);
        } else {
          console.log("None");
        }
      } else {
        console.log("None");
      }
    }

    // If no postcode is found or no predictions are available, return an empty array
    return res.json([]);
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
