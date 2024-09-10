import { useState, useEffect, useContext, use, useMemo } from "react";
import { useRouter } from "next/navigation";
import { AppContext } from "../../AppContext";
import { useLoadScript } from "@react-google-maps/api";
import Map from "./map";

import SearchUserData from "./searchuserdata";

export default function Search() {
  const [data] = useState([]);
  //Setting the Current User's Coordinates

  const { setcLocation } = useContext(AppContext);

  let locationSet = false;
  const [email] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const { filterContext, allmosquedata, rangeContext } = useContext(AppContext);
  //Context Range Variable

  const {} = useContext(AppContext);
  const [setLoadMap] = useState(false);
  const [locAccess, setLocAccess] = useState(true);
  const [mapData, setMapData] = useState([]);

  const [centerState, setCenterState] = useState({
    lat: 41.881832,
    lng: -87.623177,
  });
  const [zoom, setZoom] = useState(10);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDWxhNp15n52e7kPQkfTTumYZT9E20cMHg",
  });

  const { push } = useRouter();

  const [mapCenter, setMapCenter] = useState({
    lat: 41.881832,
    lng: -87.623177,
  });
  useEffect(() => {
    console.log("helo im mapcenter ", mapCenter);
  }, [mapCenter]);

  const changeLength = (length) => {
    const slicedData = filteredData.slice(0, length);
    setFilteredData(slicedData);
  };

  const showMap = async () => {
    let tempVar = 0;
    // let cords = null;
    let cords = null;

    const latitude = Number(allmosquedata.latitude);
    const longitude = Number(allmosquedata.longitude);

    // Check if latitude and longitude are valid numbers and not NaN
    if (
      !isNaN(latitude) &&
      !isNaN(longitude) &&
      latitude !== 0 &&
      longitude !== 0
    ) {
      cords = {
        lat: latitude,
        lng: longitude,
      };
    } else {
      cords = null;
    }

    const onPositionSuccess = async (position) => {
      const { latitude, longitude } = position.coords;
      cords = { lat: latitude, lng: longitude };
      localStorage.setItem(
        "cords_",
        JSON.stringify({ lat: latitude, lng: longitude })
      );
      tempVar = 1;
    };

    const onPositionError = (error) => {
      console.error("Error getting user's location:", error);
      setTimeout(() => {
        if (tempVar === 0) {
          reloadPage();
        }
      }, 3000); // Adjust the timeout duration as needed
    };

    try {
      navigator.geolocation.watchPosition(onPositionSuccess, onPositionError);
    } catch (error) {
      setTimeout(() => {
        if (tempVar === 0) {
          reloadPage();
        }
      }, 3000); // Adjust the timeout duration as needed
    }

    if (!cords) {
      console.log("here 1");
      const cords_ = localStorage.getItem("cords_");
      console.log("here 2", cords_);
      if (cords_) {
        console.log("here 3");
        cords = JSON.parse(cords_);
      } else {
        console.log("here 4");
        cords = null;
      }
    }

    if (cords) {
      setCenterState(cords);
      console.log("here 5");
      const latitude = cords.lat; // Changed from cords.latitude to cords.lat
      const longitude = cords.lng; // Changed from cords.longitude to cords.lng

      setcLocation([latitude, longitude]);
      setMapCenter({ lat: latitude, lng: longitude });

      let tempData = [
        {
          lat: latitude,
          lng: longitude,
          name: "You",
          type: "user",
        },
      ];

      setZoom(15);

      try {
        const mosquesData = await getMosqueData(latitude, longitude);
        const userData = await getUserData();

        const updatedMapData = mosquesData.map((mosque) => ({
          location: {
            lat: mosque.location.lat,
            lng: mosque.location.lng,
          },
          name: mosque.name,
          type: "mosque",
        }));

        let updatedMapData2 = [];
        try {
          updatedMapData2 = userData.map((data) => ({
            location: {
              lat: data.location.lat,
              lng: data.location.lng,
            },
            name: data.name,
            type: "mosque2",
          }));
        } catch (error) {
          console.error("Error mapping userData:", error);
          return;
        }

        tempData = tempData.concat(updatedMapData2);

        const tempcat = [];
        tempData.forEach((e) => {
          tempcat.push(e.name);
        });

        const filteredUpdatedMapData = updatedMapData.filter((e) => {
          if (!tempcat.includes(e.name)) {
            return e;
          }
        });

        tempData = tempData.concat(filteredUpdatedMapData);

        console.log("Final tempData:", tempData); // Debugging statement

        setMapData(tempData);
        setLoadMap(true);
        setLocAccess(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  useEffect(() => {
    showMap();
  }, []);

  const getMosqueData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `/api/getMosque/getMosque?latitude=${latitude}&longitude=${longitude}`
      );
      const data = await response.json();

      if (response.ok && data.status === "OK" && data.results.length > 0) {
        const mosquesData = data.results.slice(0, 10).map((result) => ({
          location: result.geometry.location,
          name: result.name,
        }));

        return mosquesData;
      } else {
        console.error("Error fetching data from Google Places API:", data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

  //-------------------Api to get user's mosque------------------------

  const getUserData = async () => {
    try {
      const email = localStorage.getItem("email");
      const res = await fetch("/api/getMosque/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      });
      const data = await res.json();

      if (res.ok) {
        return data;
      } else {
        console.error("Error fetching data of user selected mosque:", data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

  //-------------Checks for token----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (token === null && !token) {
      push("/Pagess/sign/signIn/signIn");
    }
  }, []);

  return (
    <div>
      <div className="top-container-search">
        <div className="top-left-search">
          {/* <div className="search-heading-search">Search Results</div> */}
          <div
            className="search-heading-search"
            style={{
              fontSize: "20px", // Increase the font size for prominence
              fontWeight: "bold", // Make the text bold
              color: "#333", // Set text color to dark gray
              padding: "10px 0", // Add some vertical padding for spacing
              borderBottom: "0", // Add a bottom border for emphasis
              marginBottom: "0px", // Add some space below the heading
              textAlign: "center", // Center-align the text
            }}
          >
            Add Mosques To Search For Profiles
          </div>

          {filterContext.location}
          {!locAccess && (
            <div className="map-error-search">Access to Location Denied :/</div>
          )}
        </div>
        <div className="top-right-search">
          <div className="select-container-right-search">
            <select
              className="select-top2-search"
              onChange={(e) => changeLength(Number(e.target.value))}
            >
              <option value="10">Per Page: 10</option>
              <option value="15">Per Page: 15</option>
              <option value="20">Per Page: 20</option>
            </select>
          </div>
        </div>
      </div>
      <div className="map-container-search">
        <div className="map-body-search">
          {console.log("IS LOADED: ", isLoaded)}

          {isLoaded && locAccess ? (
            <Map
              positions={[...mapData]}
              center={{ ...centerState }}
              display={true}
              zoom={zoom}
              people={data}
              email={email}
              radius={rangeContext}
            />
          ) : null}
        </div>
      </div>

      <SearchUserData />
    </div>
  );
}
