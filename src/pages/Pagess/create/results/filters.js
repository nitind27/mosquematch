import { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../../AppContext";

import Geolocation from "../../../../../public/geolocation";
import { produce } from "immer";

export default function Filters() {
  const [filterExpanded, setFilterExpanded] = useState({
    ethnicity: false,
    body: false,
    income: false,
    marital: false,
    smoke: false,
    drink: false,
    phone: false,
    religon: false,
    sect: false,
    revert: false,
    hijab: false,
    halal: false,
    pray: false,
  });

  const [sliderValue, setSliderValue] = useState(0.5);
  const [arrPlaces, setArrPlaces] = useState([]);
  const [visibleMosques] = useState([]);
  const initialDisplayCount = 5;
  const [menu, setMenu] = useState(true);
  const [useremail, setUseremail] = useState(null);
  const [managedata, setManagedata] = useState(false);
  const [inputValueMosquq, setInputValueMosque] = useState(""); // State to store the input value

  const {
    setRangeContext,
    filterContext,
    setFilterContext,
    mapContext,
    setMapContext,
    selectedMosques,
    setSelectedMosques,
    setAllMosqueContext,
  } = useContext(AppContext);

  const rangeInputRef = useRef(null);
  const [inputValue, setInputValue] = useState("");
  const [maplocation, setMaplocation] = useState({
    location: [],
    latitude: [],
    longitude: [],
  });
  useEffect(() => {
    setAllMosqueContext(maplocation);
  }, [maplocation, setAllMosqueContext]);

  // Function to handle adding/removing mosque type from filterContext
  const handleCheckboxChange = async (index, mosque_type) => {
    const newStatus = selectedMosques[index].status === 0 ? 1 : 0;

    setSelectedMosques(
      produce((draft) => {
        draft[index].status = newStatus;
      })
    );
    const response = await fetch("/api/interest/setMosqueStatus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: useremail,
        mosque_status: newStatus,
        mosque_type,
      }),
    });
  };

  useEffect(() => {
    // Fetch email from localStorage
    const userEmail = localStorage.getItem("email");
    setUseremail(userEmail);

    async function fetchData() {
      try {
        const res = await fetch("/api/getMosque/getmosquesearchhistory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: userEmail }),
        });
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        console.log("mosque search history:", data);

        setMosqueSearchHistory(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);
  const handleRemoveLocation = (indexToRemove) => {
    // Remove the location from mapContext.mosques
    const updatedMosques = mapContext.mosques.filter(
      (_, index) => index !== indexToRemove
    );

    // Update mapContext with the new mosques array
    setMapContext((prevContext) => ({
      ...prevContext,
      mosques: updatedMosques,
    }));

    // Update filterRules by removing the corresponding latitude and longitude values
    setFilterRules((prevRules) => {
      const updatedLatitude = prevRules.latitude.filter(
        (_, index) => index !== indexToRemove
      );
      const updatedLongitude = prevRules.longitude.filter(
        (_, index) => index !== indexToRemove
      );

      return {
        ...prevRules,
        latitude: updatedLatitude,
        longitude: updatedLongitude,
      };
    });

    // Remove the location from filterRules location array
    const mosqueNameToRemove = mapContext.mosques[indexToRemove].name; // Assuming location has a name property
    const indexToUncheck = filterRules.locations.findIndex(
      (locations) =>
        locations.toLowerCase() === mosqueNameToRemove.toLowerCase()
    );

    if (indexToUncheck !== -1) {
      setFilterRules((prevRules) => ({
        ...prevRules,
        locations: prevRules.locations.filter(
          (_, index) => index !== indexToUncheck
        ),
      }));
    }
  };

  let handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value, 10));
  };

  //Send Slider Value Globally
  useEffect(() => {
    setRangeContext(sliderValue);
    rangeInputRef.current.value = sliderValue + " Miles";
    setInputValue(rangeInputRef.current.value);
    console.log("Slider Value:", sliderValue);
  }, [sliderValue]);

  /*----------^^^^^^^^^^^^^^^^^-----------*/

  //-----------------Updates the input suggestions----------------
  const handleInputChangePlaces = async (value) => {
    // Clearing out location to uncheck all checkboxes
    if (value.trim() === "") {
      setArrPlaces([]);
      // setCheckedCheckboxes([]);
      return;
    }

    const res = await fetch("/api/getMosque/getPlaces", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: value }),
    });

    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error:", errorMessage.error);
      return;
    }
    const response = await res.json();

    // Log each place's name, latitude, and longitude
    response.forEach((place) => {
      console.log(
        `Mosque: ${place.name}, Lat: ${place.lat}, Lng: ${place.lng}`
      );
    });

    setArrPlaces(response);
    console.log("ArrPlaces:", arrPlaces);
    // setCheckedCheckboxes([]);
  };

  //------------------^^^^^^^^^^^^^^^----------------

  //-----------------Get current users mosques----------------
  useEffect(() => {
    const getMosques = async () => {
      try {
        const res = await fetch("/api/getMosque/getCurrentUserMosque", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("email"),
          }),
        });
        if (!res.ok) {
          const errorMessage = await res.json();
          console.error("Error if:", errorMessage.error);
          return;
        }
        const response = await res.json();
        console.log("mosques:", response.mosques);

        setSelectedMosques(response.mosques);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    getMosques();
  }, [managedata]);

  /*-------------^^^^^^^^^-------------------*/
  const handleRemoveMosque = async (name) => {
    setManagedata(true);
    try {
      const res = await fetch("/api/getMosque/removeUserMosque", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: localStorage.getItem("email"),
          name: name,
        }),
      });
      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error if:", errorMessage.error);
        return;
      }
      const updatedMosques = selectedMosques.filter(
        (mosque) => mosque.name !== name
      );
      // Correct the typo here
      setManagedata(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleClick = async (index, mosqueName, lat, lng) => {
    // Update maplocation state with new mosque data, replacing old values
    setMaplocation({
      location: [mosqueName.split(/[,\s]+/)[0].toLowerCase()], // Replace with new mosqueName
      latitude: [lat], // Replace with new latitude
      longitude: [lng], // Replace with new longitude
    });
    setInputValueMosque(mosqueName);
  };

  return (
    <div className="filters-parent-result">
      <div className="filters-heading-result">Filters</div>

      <div className="filters-sub-result">Search By Location</div>
      <span
        style={{ position: "relative", display: "inline-block", width: "100%" }}
      >
        <input
          className="filters-location-result"
          value={inputValueMosquq} // Bind input value to state
          onChange={(e) => {
            handleInputChangePlaces(e.target.value); // Handle user input changes
            setInputValueMosque(e.target.value); // Update inputValue state
          }}
          required
          placeholder="Address, city, etc"
          style={{ paddingRight: "30px" }}
        />
        <img
          src="/searchicon.png"
          alt="Icon"
          style={{
            position: "absolute",
            top: "55%",
            transform: "translateY(-50%)",
            right: "12px",
            width: "23px",
            height: "23px",
            pointerEvents: "none", // Disable pointer events
            userSelect: "none", // Disable text selection
          }}
        />
      </span>

      <div
        className="option-container-mosque"
        style={{
          width: "100%",
        }}
      >
        {arrPlaces.map((mosque, index) => (
          <div
            className="mini-option-mosque"
            key={index}
            style={{
              display: "flex",
              padding: "5px",
              margin: "6px -12px",
              flexGrow: 1,
            }}
          >
            <div style={{ marginRight: "5px" }}>
              <Geolocation />
            </div>
            <div style={{ flex: 1 }}>
              <p
                style={{ margin: 0, cursor: "pointer" }}
                onClick={() =>
                  handleClick(index, mosque.name, mosque.lat, mosque.lng)
                }
              >
                {mosque.name}
              </p>
            </div>
          </div>
        ))}
      </div>
      {menu && (
        <div className="filters-sub-result">
          {selectedMosques.mosques && selectedMosques.length > 0 && (
            <div>
              <div className="your-mosque-filter">Added Locations</div>
              <div
                className="filter-container"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                {selectedMosques.map((location, indexNumber) => {
                  console.log("index hell ", indexNumber);

                  return (
                    <div
                      className="container-add-filter"
                      style={{
                        padding: "2px",
                        marginBottom: "1px",
                        display: "flex",
                        alignItems: "center",
                        marginLeft: "5px",
                      }}
                      key={indexNumber}
                    >
                      {indexNumber}
                      {"hell "}
                      <div>
                        <input
                          type="checkbox"
                          style={{ marginRight: "10px" }}
                          checked={location.status === 1}
                          onChange={(e) =>
                            handleCheckboxChange(indexNumber, location.type)
                          }
                        />
                        {location.name}
                      </div>
                      <div
                        className="remove-location-filter"
                        onClick={() => handleRemoveLocation(indexNumber)}
                        style={{ marginLeft: "auto", cursor: "pointer" }}
                      >
                        <svg
                          width="20"
                          height="30"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.5 9.5L18.5 18.5M9.5 18.5L18.5 9.5"
                            stroke="#b52d3b"
                            strokeWidth="3"
                          />
                        </svg>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      <div className="filters-sub-result-range">
        Search By Distance <span>{inputValue}</span>{" "}
      </div>

      {/* Input for masjid filter*/}
      <input
        type="hidden"
        className="filters-location-result"
        ref={rangeInputRef}
        placeholder="City, post code, region, area, etc"
        readOnly
      />

      <input
        type="range"
        name="region-slider"
        className="region-slider"
        min="0"
        max="7000"
        value={sliderValue}
        step="1"
        onChange={handleSliderChange}
      />
      <div className="region-slider-labels">
        <div>0 Miles</div>
        <div>7000 Miles</div>
      </div>

      {selectedMosques.length > 0 && (
        <div className="filters-sub-result">
          <div className="your-mosque-filter">Your Mosques</div>

          <div
            className="filter-container"
            style={{
              display: "flex",
              flexDirection: "column",
              maxHeight: "190px",
              // overflowY: showAll ? "hidden" : "auto", // Hide scroll when showing all items
            }}
          >
            {selectedMosques.map((mosque, index) => (
              <div
                className="container-add-filter"
                key={index}
                style={{
                  padding: "2px",
                  marginBottom: "1px",
                  display: "flex",
                  alignItems: "center",
                  marginLeft: "5px",
                  color: "gray",
                  fontSize: "14px",
                }}
              >
                <input
                  type="checkbox"
                  checked={mosque.status === 1}
                  className="container-add-filter1"
                  style={{ marginRight: "10px" }}
                  onChange={(e) => handleCheckboxChange(index, mosque.type)}
                />
                {mosque.type}

                <div
                  onClick={() => handleRemoveMosque(mosque.type)}
                  className="remove-location-filter"
                  style={{ marginLeft: "auto", cursor: "pointer" }}
                >
                  <svg
                    width="20"
                    height="30"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M9.5 9.5L18.5 18.5M9.5 18.5L18.5 9.5"
                      stroke="#b52d3b"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </div>
            ))}

            {visibleMosques.length > initialDisplayCount && (
              <div
                className="remove-location-filter"
                onClick={toggleShowAll}
                style={{
                  marginLeft: "auto",
                  cursor: "pointer",
                  marginRight: "4px",
                  marginTop: "auto", // Ensure button is at the bottom
                }}
              >
                <svg
                  width="20"
                  height="30"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  transform={showAll ? "rotate(90 0 0)" : "rotate(-90 10 1)"}
                >
                  <path
                    d="M12 5L4 12L12 19"
                    stroke="#000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="filters-line2-result"></div>
      {/* <div className="options-heading-result">Options</div> */}

      <div className="checkbox-container-option-result">
        <div className="personalInfo-head-filter-result">
          Personal Information
        </div>

        {/* Drop Down menu for ethnicity */}

        {Object.keys(filterContext.personalInfo).map((item, index) => {
          // Determine if all checkboxes are selected in this category
          const allSelected = Object.values(
            filterContext.personalInfo[item].data
          ).every((isSelected) => isSelected);

          return (
            <div key={index}>
              <div className=" dropdown-result">
                <label htmlFor={`touch-${index}`}>
                  <div
                    className={`title-dropdown-resut ${
                      filterExpanded[item] ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent scrolling to top
                      setFilterExpanded(
                        produce((draft) => {
                          draft[item] = !draft[item];
                        })
                      );
                    }}
                  >
                    {filterContext.personalInfo[item].label}
                  </div>
                </label>
                <input type="checkbox" id={`touch`} />
                <div>
                  {filterExpanded[item] ? (
                    <div className="slide-dropdown-result">
                      {/* "Select All" Checkbox */}
                      <div className="check-container-personal-result">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFilterContext(
                              produce((draft) => {
                                Object.keys(
                                  draft.personalInfo[item].data
                                ).forEach((key) => {
                                  draft.personalInfo[item].data[key] =
                                    isChecked;
                                });
                              })
                            );
                          }}
                        />
                        <span className="personal-check-result">
                          Select All
                        </span>
                      </div>

                      {/* Individual Checkboxes */}
                      {Object.keys(filterContext.personalInfo[item].data).map(
                        (inc, subIndex) => (
                          <div
                            className="check-container-personal-result"
                            key={subIndex}
                          >
                            <input
                              type="checkbox"
                              checked={
                                filterContext.personalInfo[item].data[inc]
                              }
                              onChange={(e) => {
                                setFilterContext(
                                  produce((draft) => {
                                    draft.personalInfo[item].data[inc] =
                                      !draft.personalInfo[item].data[inc];
                                  })
                                );
                              }}
                            />
                            <span className="personal-check-result">{inc}</span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
                <div className="seprator-filter-result"></div>
              </div>
            </div>
          );
        })}

        {/*---------------------Religon Section Starts------------------- */}

        <div className="personalInfo-head-filter-result">Religon</div>
        {Object.keys(filterContext.religion).map((item, index) => {
          // Determine if all checkboxes are selected in this category
          const allSelected = Object.values(
            filterContext.religion[item].data
          ).every((isSelected) => isSelected);

          return (
            <div key={index}>
              <div className="dropdown-result">
                <label htmlFor={`touch-${index}`}>
                  <div
                    className={`title-dropdown-resut ${
                      filterExpanded[item] ? "active" : ""
                    }`}
                    onClick={(e) => {
                      e.preventDefault(); // Prevent scrolling to top
                      setFilterExpanded(
                        produce((draft) => {
                          draft[item] = !draft[item];
                        })
                      );
                    }}
                  >
                    {filterContext.religion[item].label}
                  </div>
                </label>
                <input type="checkbox" id={`touch`} />
                <div>
                  {filterExpanded[item] ? (
                    <div className="slide-dropdown-result">
                      {/* "Select All" Checkbox */}
                      <div className="check-container-personal-result">
                        <input
                          type="checkbox"
                          checked={allSelected}
                          onChange={(e) => {
                            const isChecked = e.target.checked;
                            setFilterContext(
                              produce((draft) => {
                                Object.keys(draft.religion[item].data).forEach(
                                  (key) => {
                                    draft.religion[item].data[key] = isChecked;
                                  }
                                );
                              })
                            );
                          }}
                        />
                        <span className="personal-check-result">
                          Select All
                        </span>
                      </div>

                      {/* Individual Checkboxes */}
                      {Object.keys(filterContext.religion[item].data).map(
                        (inc, subIndex) => (
                          <div
                            className="check-container-personal-result"
                            key={subIndex}
                          >
                            <input
                              type="checkbox"
                              checked={filterContext.religion[item].data[inc]}
                              onChange={(e) => {
                                setFilterContext(
                                  produce((draft) => {
                                    draft.religion[item].data[inc] =
                                      !draft.religion[item].data[inc];
                                  })
                                );
                              }}
                            />
                            <span className="personal-check-result">{inc}</span>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>
              <div className="seprator-filter-result"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
