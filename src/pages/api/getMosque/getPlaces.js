import axios from "axios";

export default async function GetMosques(req, res) {
  const input = req.body.input;
  const apiKey = process.env.MAP_API;
  const apiUrl = "https://maps.googleapis.com/maps/api/place/autocomplete/json";

  try {
    const response = await axios.get(apiUrl, {
      params: {
        input: input,
        key: apiKey,
        location: "51.5074,-0.1278", // Latitude and Longitude of London
        radius: 100000, // Bias results within 100km radius of London
      },
    });

    // Fetch place details for each prediction to get latitude and longitude
    const placeDetailsPromises = response.data.predictions.map(
      async (prediction) => {
        const placeDetailsUrl =
          "https://maps.googleapis.com/maps/api/place/details/json";
        const placeDetailsResponse = await axios.get(placeDetailsUrl, {
          params: {
            place_id: prediction.place_id,
            key: apiKey,
            fields: "geometry",
          },
        });

        const location = placeDetailsResponse.data.result.geometry.location;
        return {
          id: prediction.place_id,
          name: prediction.description.replace(", UK", ""),
          lat: location.lat,
          lng: location.lng,
        };
      }
    );

    const placeDetails = await Promise.all(placeDetailsPromises);

    // Filter out any predictions that still include "UK" in the name
    const filteredPlaces = placeDetails.filter(
      (place) => !place.name.includes("UK")
    );

    // Sort places by name length
    filteredPlaces.sort((a, b) => a.name.length - b.name.length);

    res.json(filteredPlaces);
  } catch (error) {
    console.error("Error fetching autocomplete suggestions:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
