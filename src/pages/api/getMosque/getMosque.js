import axios from "axios";

export default async (req, res) => {
  const { latitude, longitude } = req.query;
  const apiKey = "AIzaSyDWxhNp15n52e7kPQkfTTumYZT9E20cMHg";

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=mosque&key=${apiKey}`
    );
   

    res.status(response.status).json(response.data);
  } catch (error) {
    res
      .status(error.response?.status || 500)
      .json(error.response?.data || { error: "Internal Server Error" });
  }
};
