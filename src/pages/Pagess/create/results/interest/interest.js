import { useContext, useEffect, useState } from "react";
import ResultsNav from "../navResult";
import { getDistance } from "@/util/util";
import ViewedMe from "./viewedMe";
import { AppContext } from "@/pages/Pagess/AppContext";

export default function Interest() {
  // 0 = Viewed Me, 1 = Viewed, 2 = Favourited Me, 3 = Favourited
  const [selectedTab, setSelectedTab] = useState(0); // Default to "Viewed Me"
  const [data, setData] = useState([]);
  const { cLocation, setcLocation } = useContext(AppContext);
  const showMap = async () => {
    navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setcLocation([latitude, longitude]);
        console.log("current location 234234", latitude, longitude);

        let tempData = [
          { lat: latitude, lng: longitude, name: "You", type: "user" },
        ];

        const mosquesData = await getMosqueData(latitude, longitude);
        const userData = await getUserData();

        let updatedMapData = mosquesData.map((mosque) => ({
          location: { lat: mosque.location.lat, lng: mosque.location.lng },
          name: mosque.name,
          type: "mosque",
        }));

        const userMapData = userData.map((data) => ({
          location: { lat: data.location.lat, lng: data.location.lng },
          name: data.name,
          type: "mosque2",
        }));

        const uniqueMapData = updatedMapData.filter(
          (data) => !userMapData.some((user) => user.name === data.name)
        );

        tempData = tempData.concat(userMapData, uniqueMapData);
        // setMapData(tempData);
      },
      (error) => {
        console.error("Error getting user's location:", error);
      }
    );
  };
  useEffect(() => {
    console.log("heei in rendering ");

    localStorage.setItem("currentNavOption", "interest");
    showMap();
  }, []);
  useEffect(() => {
    fetchData();
  }, [selectedTab, cLocation]);

  const apiUrls = [
    "/api/interest/viewedMe",
    "/api/interest/viewedByMe",
    "/api/interest/getFavsMe",
    "/api/interest/getFavs",
  ];

  const fetchData = async () => {
    const email = localStorage.getItem("email");
    console.log("email from localstoreae ", email);

    if (!email) return;

    try {
      const res = await fetch(apiUrls[selectedTab], {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error fetching users:", errorMessage.error);
        return;
      }

      const { data: viewedUsers } = await res.json();
      console.log("1234current location", cLocation);

      const usersWithDistance = cLocation
        ? viewedUsers.map((user) => {
            if (user.locations) {
              const userLoc = JSON.parse(user.locations)[0];
              console.log("userLoc", userLoc);

              const distance = Math.round(
                getDistance(cLocation[0], cLocation[1], userLoc[0], userLoc[1])
              );
              console.log("userLo distance", distance);

              return { ...user, distance };
            }
            return user;
          })
        : viewedUsers;
      console.log("usersWithDistance", usersWithDistance);

      setData(usersWithDistance);
      showMap();
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const getMosqueData = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `/api/getMosque/getMosque?latitude=${latitude}&longitude=${longitude}`
      );
      const data = await response.json();

      if (response.ok && data.status === "OK" && data.results.length > 0) {
        return data.results.slice(0, 10).map((result) => ({
          location: result.geometry.location,
          name: result.name,
        }));
      } else {
        console.error("Error fetching data from Google Places API:", data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const getUserData = async () => {
    try {
      const email = localStorage.getItem("email");
      const res = await fetch("/api/getMosque/getUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        return data;
      } else {
        console.error("Error fetching user data:", data);
        return [];
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };
  useEffect(() => {
    console.log("clocation123", cLocation);
  }, [cLocation]);
  return (
    <>
      <div>
        <ResultsNav />
        <div className="interest-container">
          <div className="shade-interest"></div>
          <div className="main-ininterest">
            <div className="interest-views">
              <div className="option-section-interest main">
                <div
                  className="option-1-interest"
                  style={{ color: selectedTab <= 1 ? "#b52d3b" : "" }}
                >
                  VIEWS
                </div>
                <div
                  className="option-2-interest"
                  style={{
                    color: selectedTab === 0 ? "#b52d3b" : "",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedTab(0)}
                >
                  Viewed Me
                </div>
                <div
                  className="option-2-interest"
                  style={{
                    color: selectedTab === 1 ? "#b52d3b" : "",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedTab(1)}
                >
                  Viewed
                </div>
              </div>
              <div className="left-container-view-interest">
                <div
                  className="view-text-interest"
                  style={{ color: selectedTab >= 2 ? "#b52d3b" : "" }}
                >
                  FAVOURITE
                </div>
                <div
                  className="view-text-interest4"
                  style={{
                    color: selectedTab === 2 ? "#b52d3b" : "",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedTab(2)}
                >
                  Favourited Me
                </div>
                <div
                  className="view-text-interest4"
                  style={{
                    color: selectedTab === 3 ? "#b52d3b" : "",
                    cursor: "pointer",
                  }}
                  onClick={() => setSelectedTab(3)}
                >
                  Favourited
                </div>
              </div>
            </div>
            <div className="container-interest">
              <div className="container-view-interest">
                {cLocation === null || cLocation === undefined ? (
                  <div>Loading...</div>
                ) : (
                  <ViewedMe data={data} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
