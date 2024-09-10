import React, { useEffect, useState, useContext } from "react";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  CircleF,
} from "@react-google-maps/api";
import { AppContext } from "../../AppContext";

function scatterCoordinates(latitude, longitude) {
  const earthRadius = 6371;

  const randomDistance = Math.random() * (0.5 - 0.1) + 0.2;
  const randomAngle = Math.random() * (2 * Math.PI);
  const newLatitude =
    latitude +
    (randomDistance / earthRadius) * (180 / Math.PI) * Math.cos(randomAngle);
  const newLongitude =
    longitude +
    (randomDistance / earthRadius) * (180 / Math.PI) * Math.sin(randomAngle);
  return { latitude: newLatitude, longitude: newLongitude };
}

function Map({
  positions,
  center,
  display,
  zoom,
  people,
  email,
  radius,
  selectmosque,
}) {
  const [activeMarker, setActiveMarker] = useState(null);

  const [activeName, setActiveName] = useState(null);
  const [activePeople, setActivePeople] = useState([]);
  const [mainPositions, setMainPositions] = useState([]);
  const [isPart, setIsPart] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [defaultPeople, setDefaultPeople] = useState([]);
  const [insideCenter, setInsideCenter] = useState(center);
  const { selectedMosques, setSelectedMosques } = useContext(AppContext);
  useEffect(() => {
    setMainPositions(positions);
  }, [positions]);

  useEffect(() => {
    setInsideCenter(center);
  }, [center]);

  const handleMarkerClick = (marker) => {
    try {
      setActiveMarker(marker);
      if (marker.type === "mosque" || marker.type === "mosque2") {
        setIsProcessing(true);

        // Check if the mosque is already added
        const mosqueAlreadyAdded = selectedMosques.some(
          (mosque) =>
            mosque.latitude === marker.location.lat &&
            mosque.longitude === marker.location.lng
        );
        setIsPart(mosqueAlreadyAdded);
      }
    } catch (error) {
      console.log("Error on marker: ", error);
    }
  };

  const handleInfoWindowClose = () => {
    setActiveMarker(null);
    setActiveName(null);
    setIsPart(false);
    setActivePeople([]);
    setIsProcessing(false);
  };

  const handleOnLoad = (mapInput) => {
    const bounds = new window.google.maps.LatLngBounds();
    if (positions && positions.length) {
      positions.forEach((pos) =>
        bounds.extend(new window.google.maps.LatLng(pos.lat, pos.lng))
      );
      mapInput.fitBounds(bounds);
    }
  };

  useEffect(() => {
    console.log("MAP IS BEING INITIALIZED");
    console.log(display);
  }, []);

  const handleAddMosque = async (e) => {
    e.preventDefault();

    try {
      let result = await fetch("/api/createAcc/addMosqueUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          lat: activeMarker.location.lat,
          lng: activeMarker.location.lng,
          mosque: activeMarker.name,
        }),
      });

      result = await result.json();
      if (result.message === "Success") {
        setIsPart(true); // Set isPart to true after adding the mosque
        setSelectedMosques((prev) => [
          {
            email: email,
            type: activeMarker.name,
            status: 1,
            latitude: activeMarker.location.lat,
            longitude: activeMarker.location.lng,
          },
          ...prev,
        ]);
        setActiveMarker((prev) => ({ ...prev, type: "mosque2" }));
      } else {
        console.log("ERROR");
      }
    } catch (error) {
      console.log("ERROR: ", error);
    }
  };

  const getIconUrl = (type) => {
    switch (type) {
      case "mosque":
        return "https://cdn-icons-png.flaticon.com/512/2319/2319870.png";
      case "female":
        return "https://cdn-icons-png.flaticon.com/512/7029/7029970.png";
      case "male":
        return "https://cdn-icons-png.flaticon.com/512/7029/7029967.png";
      case "mosque2":
        return "https://cdn-icons-png.flaticon.com/128/4050/4050101.png";
      default:
        return "https://cdn-icons-png.flaticon.com/512/819/819814.png";
    }
  };

  useEffect(() => {
    console.log("hedf center ", radius);
  }, [radius]);

  if (display) {
    return (
      <GoogleMap
        onLoad={handleOnLoad}
        onClick={() => setActiveMarker(null)}
        mapContainerStyle={{
          width: "100%",
          height: "100%",
        }}
        zoom={zoom}
        center={insideCenter}
      >
        {mainPositions &&
          mainPositions.map((position) => (
            <>
              {position.type === "user" && (
                <CircleF
                  center={{
                    lat: position.lat,
                    lng: position.lng,
                  }}
                  radius={radius * 1609}
                  options={{
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#FF0000",
                    fillOpacity: 0.35,
                  }}
                />
              )}
              <MarkerF
                icon={{
                  url: getIconUrl(position.type),
                  scaledSize: new window.google.maps.Size(30, 30),
                  origin: new window.google.maps.Point(0, 0),
                  anchor: new window.google.maps.Point(15, 15),
                }}
                key={`${position.location?.lat || position.lat || "unknown"}-${
                  position.location?.lng || position.lng || "unknown"
                }`}
                position={
                  position.location
                    ? {
                        lat: position.location.lat,
                        lng: position.location.lng,
                      }
                    : {
                        lat: position.lat,
                        lng: position.lng,
                      }
                }
                onClick={() => handleMarkerClick(position)}
                name={position.name}
              />
            </>
          ))}
        {activeMarker && isProcessing && (
          <InfoWindowF
            className="map-info-window"
            position={
              activeMarker.location
                ? {
                    lat: activeMarker.location.lat,
                    lng: activeMarker.location.lng,
                  }
                : {
                    lat: activeMarker.lat,
                    lng: activeMarker.lng,
                  }
            }
            onCloseClick={handleInfoWindowClose}
          >
            <div className="mosque-add-label">
              <div>
                {activeMarker.type === "mosque"
                  ? activeMarker.name
                  : activeMarker.name}
              </div>
              {(activeMarker.type === "mosque" ||
                activeMarker.type === "mosque2") && (
                <button
                  className="mosque-add-button"
                  onClick={handleAddMosque}
                  style={{
                    backgroundColor:
                      activeMarker.type === "mosque2" ? "#ed7b86" : "#4CAF50",
                    cursor:
                      activeMarker.type === "mosque2"
                        ? "context-menu"
                        : "pointer",
                  }}
                  disabled={activeMarker.type === "mosque2"}
                >
                  {activeMarker.type === "mosque2"
                    ? "Mosque Added"
                    : "Add mosque"}
                </button>
              )}
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    );
  }

  return null;
}

export default Map;
