import { useRouter } from "next/router";
import React, { use, useEffect, useState, useContext } from "react";
import ResultsNav from "../navResult";
import ImageSlider from "react-simple-image-slider";
import "react-slideshow-image/dist/styles.css";
import { ImageTwoTone } from "@mui/icons-material";
import BasicEditView from "./basicEditView";
import AboutEditView from "./aboutEditView";
import EduEditView from "./eduEditView";
import PersonalEditView from "./personalEditView";

import ReligonEditView from "./religonEditView";
import PhotoEditView from "./photoEditView";
import Link from "next/link";
import Envelope from "../../../../../../public/envelope";
import Camera from "../../../../../../public/camerasvg";
import Stop from "../../../../../../public/stopsvg";
import Excalim from "../../../../../../public/exclaimsvg";
import { AppContext } from "@/pages/Pagess/AppContext";
import ReactCountryFlag from "react-country-flag";
import WaliRed from "../../../../../../public/search/waliRed";
import Arrow from "../../../../../../public/arrow";
import RedHeartIcon from "../../../../../../public/nav/redHeart";
import BlackHeartIcon from "../../../../../../public/nav/blackHeart";
import { User } from "lucide-react";
export default function Profilesection() {
  const router = useRouter();
  const { push } = useRouter();
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const { getCode, getName } = require("country-list");
  const { filterContext, setFilterContext } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [userInfo, setUserInfo] = useState([]);
  const [viewBio, setViewBio] = useState(false);
  const [selected, setSelected] = useState("Basic Information");
  const [heartedEmails, setHeartedEmails] = useState([]);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  //------Time Stamps---------
  const [timeStamp, setTimeStamp] = useState([]);
  console.log("timeStamp", timeStamp);
  const [showAll, setShowAll] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const handleShowAll = (userInfo) => {
    setShowAll(!showAll);
    setSelectedUserData(userInfo);
  };
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [showWali, setShowWali] = useState(false);
  //-----For private image request---------
  const [showPrivate, setShowPrivate] = useState(false);
  //-----For blocking user---------
  const [showBlock, setShowBlock] = useState(false);
  //-------------Function to calculate age------------------
  function calculateAge(year, month, day) {
    const dateOfBirth = `${year}-${month}-${day}`;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // If the birth date for the current year hasn't occurred yet, subtract one year
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return <div>{age}</div>;
  }

  const RequestPrivateImage = async (e, user) => {
    e.preventDefault();
    console.log("Requesting Images");
    try {
      const res = await fetch("/api/interest/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          viewed: user,
          viewer: localStorage.getItem("email"),
        }),
      });
      const data = await res.json();
      if (data.error) {
        console.log("Error: ", data.error);
        return;
      }
      alert("Private Images Requested");

      console.log("Data: ", data);
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  //-------------------Sending Message------------------------
  const SendMessage = async (e, user) => {
    e.preventDefault();
    console.log("Send message fucntion started", user);
    const receiver = user;
    const sender = localStorage.getItem("email");

    const data = {
      senderEmail: sender,
      receiverEmail: receiver,
      messageText: messageText,
    };

    const res = await fetch("/api/message/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
  };
  const SendMessageAdmin = async (e, user) => {
    e.preventDefault();
    const receiver = user;
    const sender = localStorage.getItem("email");

    const data = {
      senderEmail: sender,
      receiverEmail: receiver,
      messageText: messageText,
    };

    const res = await fetch("/api/admin/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
  };

  //-------------Api to retrieve data------------------
  useEffect(() => {
    const fetchData = async () => {
      const email1 = localStorage.getItem("email");
      if (email1 === "" || !email1 || email1 === null) {
        return;
      }
      setEmail(email1);
      try {
        //Getting all users
        const res = await fetch("/api/createAcc/getInfoAcc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email1),
        });
        if (!res.ok) {
          const errorMessage = await res.json();
          console.error("Error if:", errorMessage.error);
          return;
        }
        const response = await res.json();

        //Getting users who you have blocked
        const res2 = await fetch("/api/interest/getBlocked", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: localStorage.getItem("email"),
          }),
        });
        let data2 = await res2.json();
        if (data2.error) {
          console.log("Error on getting blocked: ", data2.error);
        }

        data2 = data2.data;

        //getting users who have blocked me so we can filter then also

        const res3 = await fetch("/api/interest/getBlockedMe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: localStorage.getItem("email"),
          }),
        });

        let data3 = await res3.json();
        if (data3.error) {
          console.log("Error on getting blocked: ", data3.error);
        }

        data3 = data3.data;

        const res4 = await fetch("/api/createAcc/getTime", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user: localStorage.getItem("email"),
          }),
        });

        let timeData = await res4.json();
        if (timeData.error) {
          console.log("Error on getting timestamp", error);
        }
        timeData = timeData.data;
        console.log("timeData", timeData);
        setTimeStamp(timeData);

        //Adding a Distance Tracker to the Users
        const dataToChange = response.user.rows.map((e) => {
          // e["distance"] = "Unknown";
          return e;
        });

        //Filtering users who are blocked by current
        const dataChanged = dataToChange.filter(
          (user) => !data2.some((item) => item.receiver_email === user.email)
        );

        //Filtering users who have blocked current user
        const filteredData = dataChanged.filter(
          (user) => !data3.some((item) => item.sender_email === user.email)
        );

        setData(filteredData);
        showMap();
      } catch (error) {
        console.error("Error on first try fetching data:", error.message);
      }
    };

    fetchData();
  }, []);
  const BlockUser = async (e, user) => {
    e.preventDefault();
    const res = await fetch("/api/interest/blockUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blocked: user,
        blocker: localStorage.getItem("email"),
      }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
    console.log(response);
    // Update the data state with the filtered data
    const dataChanged = data.filter(
      (user) => user.email !== selectedUserInfo.email
    );
    setData(dataChanged);
    setShowBlock(false);
  };
  // Get the user info from the query parameters
  useEffect(() => {
    const userInfoString = router.query.name;
    if (userInfoString) {
      try {
        const userInfoArray = JSON.parse(userInfoString);
        setUserInfo(userInfoArray);
        localStorage.setItem("currentNavOption", "search");
        localStorage.setItem("currentUserViewed", userInfoArray.email);
        console.log("userInfoArray", userInfoArray);
      } catch (error) {
        console.error("Error parsing userInfo:", error);
        push("/Pagess/create/results/results");
      }
    } else {
      console.error("userInfo is not defined in query parameters");
    }
  }, [router.query]);

  //-------------------Api to get nearest mosque mosque------------------------

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

  const HeartClick = async (user) => {
    console.log("Heart clicked!");
    const res = await fetch("/api/interest/heart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hearted: user,
        hearter: localStorage.getItem("email"),
      }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
    console.log(response);

    // Update the data state with the new hearted user
    setHeartedEmails([...heartedEmails, user]);
  };
  const HeartClickRemove = async (user) => {
    console.log("Heart clicked to remove!");
    const res = await fetch("/api/interest/heartRemove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hearted: user,
        hearter: localStorage.getItem("email"),
      }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
    console.log(response);

    // Update the data state to remove the hearted user
    setHeartedEmails(heartedEmails.filter((hearted) => hearted !== user));
  };

  //----------------For favs------------------
  useEffect(() => {
    var getHearts = async () => {
      try {
        const emails = data.map((user) => user.email);
        console.log("get fav started");
        const res = await fetch("/api/interest/heartedByMe", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: emails,
            user: localStorage.getItem("email"),
          }),
        });
        const data2 = await res.json();
        if (data2.error) {
          console.log("Error on getting favs: ", data2.error);
        } else {
          setHeartedEmails(data2.data);
        }
      } catch (error) {
        console.log("Error on getting image: ", error);
      }
    };
    getHearts();
  }, [data]);

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

  //-------------Checks for token----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");

    if (token === null && !token) {
      push("/Pagess/sign/signIn/signIn");
    }
  }, []);
  //-----------------Format Time------------------
  const formatTimeAgo = (timestamp) => {
    // Parse timestamp as a Date object
    const timestampDate = new Date(timestamp);

    // Calculate the difference in milliseconds
    const differenceMs = Date.now() - timestampDate.getTime();

    const oneMinute = 60 * 1000;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;

    if (differenceMs < oneMinute) {
      // If less than a minute
      return "Just now";
    } else if (differenceMs < oneHour) {
      // If less than an hour
      const differenceMinutes = Math.floor(differenceMs / oneMinute);
      return `${differenceMinutes} minute${
        differenceMinutes > 1 ? "s" : ""
      } ago`;
    } else if (differenceMs < oneDay) {
      // If less than a day but more than an hour
      const differenceHours = Math.floor(differenceMs / oneHour);
      return `${differenceHours} hour${differenceHours > 1 ? "s" : ""} ago`;
    } else {
      // If greater than or equal to a day
      const differenceDays = Math.floor(differenceMs / oneDay);
      return `${differenceDays} day${differenceDays > 1 ? "s" : ""} ago`;
    }
  };

  // Example usage with timestamp as string

  return (
    <div className="parent-result">
      <ResultsNav />

      <div className="box-parent-result">
        <div className="bottom-container-search">
          <div
            key={userInfo.id}
            className="result-parent-container-search demo-page"
          >
            <div className="result-img-parent-search ">
              <div className="result-main-img">
                <div className="img-container-search">
                  <>
                    <PhotoEditView data={userInfo} routerQuery={router.query} />
                    <div className="result-line1-container-search">
                      <div className="result-line1-username">
                        {userInfo.username}
                      </div>

                      <span className="flag-container1">
                        <ReactCountryFlag
                          countryCode={getCode(`${userInfo.aboutme_country}`)}
                          svg
                          title="India"
                          style={{ height: "13px", width: "20px" }} // Set height and width inline
                        />

                        <ReactCountryFlag
                          countryCode={getCode(`${userInfo.personal_origin}`)}
                          svg
                          style={{
                            marginRight: "0",
                            height: "13px",
                            width: "20px",
                          }} // Set height and width inline
                          title="India"
                        />
                      </span>
                    </div>
                  </>
                </div>
              </div>

              <div className="result-right-parent-container">
                <div className="result-line2-container-search">
                  <div className="result-line2">
                    <div>
                      <strong>{userInfo.distance + " Km Away"}</strong>
                    </div>
                  </div>

                  <div className="mini-seprator-search"></div>
                  <span className="result-line2-container-age">
                    Age:
                    <div className="age-search">
                      {calculateAge(
                        userInfo.aboutme_year,
                        userInfo.aboutme_month,
                        userInfo.aboutme_day
                      )}
                    </div>
                  </span>
                  <div className="mini-seprator-search"></div>
                  <div className="heart-container-search">
                    {Array.isArray(heartedEmails) ? (
                      heartedEmails.includes(userInfo.email) ? (
                        <div
                          onClick={() => {
                            HeartClickRemove(userInfo.email);
                            // reloadPage();
                          }}
                        >
                          <RedHeartIcon />
                        </div>
                      ) : (
                        <div
                          onClick={() => {
                            HeartClick(userInfo.email);
                            // reloadPage();
                          }}
                        >
                          <BlackHeartIcon />
                        </div>
                      )
                    ) : null}
                  </div>
                  <div
                    className="heart-container-search2"
                    onClick={(e) => {
                      setSelectedUserInfo(userInfo);
                      setShowMessage(true);
                    }}
                  >
                    <Envelope />
                  </div>
                  {/* Shows Message Details */}
                  {showMessage && (
                    <div className="msg-container-search">
                      <div className="msg-sub-search">
                        <div className="msg-heading-search">
                          <div className="msg-text-search">New Message</div>
                          <div className="close-msg-search">
                            <div
                              onClick={(e) => {
                                setShowMessage(false);
                              }}
                            >
                              X
                            </div>
                          </div>
                        </div>
                        <div className="divider-msg-search"></div>
                        <div className="msg-mini-container-search">
                          <div className="msg-mini-text-search">Message</div>
                          <textarea
                            placeholder="Enter your message here"
                            className="msg-input-search"
                            onChange={(e) => {
                              setMessageText(e.target.value);
                            }}
                          ></textarea>
                          <div className="send-msg-container-search">
                            <button
                              className="send-msg-search"
                              onClick={(e) => {
                                SendMessage(e, selectedUserInfo.email);
                                setShowMessage(false);
                              }}
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* ^^^^^^^^^^^^^ */}
                  <div
                    className="heart-container-search2"
                    onClick={() => {
                      setSelectedUserInfo(userInfo);
                      setShowPrivate(true);
                    }}
                  >
                    <Camera />
                  </div>
                  {showPrivate && (
                    <div className="msg-container-search">
                      <div className="msg-sub-search">
                        <div className="msg-heading-search">
                          <div className="msg-text-search">
                            Request Private Images
                          </div>
                          <div className="close-msg-search">
                            <div
                              onClick={(e) => {
                                setShowPrivate(false);
                              }}
                            >
                              X
                            </div>
                          </div>
                        </div>
                        <div className="divider-msg-search"></div>
                        <div className="msg-mini-container-search">
                          <div className="send-msg-container-search">
                            <button
                              className="send-msg-search"
                              onClick={(e) => {
                                RequestPrivateImage(e, selectedUserInfo.email);
                                setShowPrivate(false);
                              }}
                            >
                              Request
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div
                    className="heart-container-search2"
                    onClick={() => {
                      setSelectedUserInfo(userInfo);
                      setShowBlock(true);
                    }}
                  >
                    <Stop />
                  </div>
                  {showBlock && (
                    <div className="msg-container-search">
                      <div className="msg-sub-search">
                        <div className="msg-heading-search">
                          <div className="msg-text-search">
                            Block This User?
                          </div>
                          <div className="close-msg-search">
                            <div
                              onClick={(e) => {
                                setShowBlock(false);
                              }}
                            >
                              X
                            </div>
                          </div>
                        </div>
                        <div className="divider-msg-search"></div>
                        <div className="msg-mini-container-search">
                          <div className="send-msg-container-search">
                            <button
                              className="send-msg-search"
                              onClick={(e) => {
                                BlockUser(e, selectedUserInfo.email);
                                setShowBlock(false);
                                // reloadPage;
                              }}
                            >
                              Block
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div
                    className="heart-container-search2"
                    onClick={(e) => {
                      setSelectedUserInfo(userInfo);
                      setShowReport(true);
                    }}
                  >
                    <Excalim />
                  </div>
                  {showReport && (
                    <div className="msg-container-search">
                      <div className="msg-sub-search">
                        <div className="msg-heading-search">
                          <div className="msg-text-search">Report</div>
                          <div className="close-msg-search">
                            <div
                              onClick={(e) => {
                                setShowReport(false);
                              }}
                            >
                              X
                            </div>
                          </div>
                        </div>
                        <div className="divider-msg-search"></div>
                        <div className="msg-mini-container-search">
                          <div className="msg-mini-text-search">
                            Message To Admin
                          </div>
                          <textarea
                            placeholder="Enter your report here"
                            className="msg-input-search"
                            onChange={(e) => {
                              setMessageText(e.target.value);
                            }}
                          ></textarea>
                          <div className="send-msg-container-search">
                            <button
                              className="send-msg-search"
                              onClick={(e) => {
                                SendMessageAdmin(e, selectedUserInfo.email);
                                setShowReport(false);
                              }}
                            >
                              Send
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div
                    className="heart-container-search2"
                    onClick={() => {
                      setSelectedUserInfo(userInfo);
                      setShowWali(true);
                    }}
                  >
                    <span style={{ height: "" }}>
                      {userInfo.gender == "female" && <WaliRed />}
                    </span>
                  </div>
                  {showWali && (
                    <div className="msg-container-search">
                      <div className="msg-sub-search">
                        <div className="msg-heading-search">
                          <div className="msg-text-search">
                            Request Wali Details
                          </div>
                          <div className="close-msg-search">
                            <div
                              onClick={(e) => {
                                setShowWali(false);
                              }}
                            >
                              X
                            </div>
                          </div>
                        </div>
                        <div className="divider-msg-search"></div>
                        <div className="msg-mini-container-search">
                          <div className="send-msg-container-search">
                            <button
                              className="send-msg-search"
                              onClick={(e) => {
                                setMessageText(
                                  "I would like to request your wali details"
                                );
                                RequestWali(e, selectedUserInfo.email);
                                setShowWali(false);
                              }}
                            >
                              Request
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="active-text-search">
                    <strong>Active : </strong>

                    {timeStamp.map((timestampItem) => {
                      if (timestampItem.email === userInfo.email) {
                        return (
                          <div key={timestampItem.email}>
                            {formatTimeAgo(timestampItem.active_since)}
                          </div>
                        );
                      }
                      return null; // Return null if no match
                    })}
                  </div>

                  {/* Shows Bio Details */}
                  {viewBio && (
                    <div className="bio-container-search">
                      {console.log(
                        "data found on user:",
                        selectedUserInfo.username
                      )}
                      <div className="bio-sub-search">
                        <div className="bio-heading-search">
                          <div className="bio-text-search">Biography</div>
                          <div className="close-bio-search">
                            <div
                              onClick={(e) => {
                                setViewBio(false);
                              }}
                            >
                              X
                            </div>
                          </div>
                        </div>
                        <div className="divider-bio-search"></div>
                        <div className="bio-mini-container-search">
                          <div className="bio-mini-text-search">
                            A Little bit about me
                          </div>
                          <div className="bio-mini-text2-search">
                            {selectedUserInfo.aboutme_about}
                          </div>
                        </div>
                        <div className="bio-mini-container-search">
                          <div className="bio-mini-text-search">
                            What I am looking for
                          </div>
                          <div className="bio-mini-text2-search">
                            {selectedUserInfo.aboutme_looking}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* ^^^^^^^^^^^^^ */}
                </div>
                <div className="result-line3-container-search">
                  .
                  {userInfo &&
                    userInfo.types &&
                    userInfo.types.slice(0, 3).map((type, index) => (
                      <div
                        key={index}
                        className={`result-line3 ${index}`}
                        data-tooltip={type}
                      >
                        {type}
                      </div>
                    ))}
                  <div>
                    {!showAll && userInfo?.types?.length > 3 && (
                      <span onClick={() => handleShowAll(userInfo)}>
                        <Arrow />
                      </span>
                    )}
                  </div>
                  {showAll && selectedUserData === userInfo && (
                    <div className="msg-container-search">
                      <div className="msg-sub-search">
                        <div className="msg-heading-search">
                          <div className="msg-text-search">Types</div>
                          <div className="close-msg-search">
                            <div onClick={() => setShowAll(false)}>X</div>
                          </div>
                        </div>
                        <div className="divider-msg-search"></div>
                        <div className="msg-mini-container-search">
                          <ul>
                            {selectedUserData.types.map((type, index) => (
                              <li key={index} className="msg-mini-text-search">
                                {type}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="result-line4-container-search">
                  <div className="info-search">
                    <span className="result-line4">Sect: </span>
                    {userInfo.religion_sector || "Not Specified"}
                  </div>
                  <div className="info-search">
                    <span className="result-line4">Hijab: </span>
                    {userInfo.religion_hijab || "Not Specified"}
                  </div>
                  <div className="info-search">
                    <span className="result-line4">Pray: </span>
                    {userInfo.religion_pray || "Not Specified"}
                  </div>
                  <div className="info-search">
                    <span className="result-line4">Quran: </span>
                    {userInfo.religon_quran || "Not Specified"}
                  </div>
                  <div className="info-search">
                    <span className="result-line4">Religiousness: </span>
                    {userInfo.religion_religious || "Not Specified"}
                  </div>
                </div>
                <div className="seprator-filter-result-userinfo"></div>

                <span className="result-line5-container-datas">
                  <div className="result-line5-container-search">
                    <div className="info-search">
                      <span
                        className="result-line5"
                        style={{ paddingRight: "10px" }}
                      >
                        Occupation:
                      </span>
                      {userInfo.eduwork_job || "Not Specified"}{" "}
                    </div>
                    <div className="info-search">
                      <span className="result-line5">Marital Status:</span>{" "}
                      {userInfo.personal_marital || "Not Specified"}
                    </div>
                    <div className="info-search">
                      <span className="result-line5">Has Children:</span>{" "}
                      {userInfo.personal_children2 || "Not Specified"}
                    </div>
                    <div className="info-search">
                      <span className="result-line5">Build: </span>
                      {userInfo.personal_build || "Not Specified"}
                    </div>
                    <div className="info-search">
                      <span className="result-line5">Height: </span>
                      {userInfo.personal_height || "Not Specified"}
                    </div>
                    <div className="info-search">
                      <span className="result-line5">Income: </span>
                      {userInfo.personal_income || "Not Specified"}
                    </div>
                  </div>
                </span>
              </div>
            </div>
            <div className="main-result-line5-container-datas">
              {/* <span className="result-line5-container-datas">
                <div className="result-line5-container-search">
                  <div className="info-search">
                    <span className="result-line5">Occupation</span>:
                    {userInfo.eduwork_job
                      ? userInfo.eduwork_job
                      : "Not Specified"}
                  </div>
                  <div className="info-search">
                    <span className="result-line5">Martial Status</span>:{" "}
                    {userInfo.personal_marital
                      ? userInfo.personal_marital
                      : "Not Specified"}
                  </div>
                  <div className="info-search">
                    <span className="result-line5">Has Children</span>:{" "}
                    {userInfo.personal_children2
                      ? userInfo.personal_children2
                      : "Not Specified"}
                  </div>
                  <div className="info-search">
                    {" "}
                    <span className="result-line5">Build</span>:
                    {userInfo.personal_build
                      ? userInfo.personal_build
                      : "Not Specified"}{" "}
                  </div>

                  <div className="info-search">
                    <span className="result-line5">Height</span>:{" "}
                    {userInfo.personal_height
                      ? userInfo.personal_height
                      : "Not Specified"}{" "}
                  </div>

                  <div className="info-search">
                    <div>
                      <span className="result-line5">Income</span>:{" "}
                      {userInfo.personal_income
                        ? userInfo.personal_income
                        : "Not Specified"}
                    </div>
                  </div>
                </div>
              </span> */}
              <div className="info-container">
                <span className="info-header">Other information</span>
                <div className="info-box">
                  {/* Row 1 */}
                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">Where do I live</span>:
                      {userInfo.aboutme_location || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">Country of birth</span>:
                      {userInfo.aboutme_country || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">Date of birth</span>:
                      {userInfo.aboutme_day || "Not Specified"}-
                      {userInfo.aboutme_month}-
                      {userInfo.aboutme_year || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">Tag Line</span>:
                      {userInfo.aboutme_tag || "Not Specified"}
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">My citizenship</span>:
                      {userInfo.personal_citizen || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">My education level</span>:
                      {userInfo.eduwork_education || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">Subject I studied</span>:
                      {userInfo.eduwork_subject || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">My profession</span>:
                      {userInfo.eduwork_profession || "Not Specified"}
                    </div>
                  </div>
                  {/* Row 3 */}
                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">My first language</span>:
                      {userInfo.eduwork_language1 || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">My second language</span>:
                      {userInfo.eduwork_language2 || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">Country of origin</span>:
                      {userInfo.personal_origin || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">Willing to relocate</span>:
                      {userInfo.personal_relocate || "Not Specified"}
                    </div>
                  </div>
                  {/* Row 4 */}
                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">
                        I'm looking to marriage within
                      </span>
                      :{userInfo.personal_marriage || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        Would I like to have children
                      </span>
                      :{userInfo.personal_children1 || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">My living arrangements</span>
                      :{userInfo.personal_living || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">My ethnicity</span>:
                      {userInfo.personal_ethnicity || "Not Specified"}
                    </div>
                  </div>
                  {/* Row 5 */}
                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">Do I smoke</span>:
                      {userInfo.personal_smoke || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">Do I drink</span>:
                      {userInfo.personal_drink || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        Do I have any disability
                      </span>
                      :{userInfo.personal_disability || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">
                        How long do you spend on your phone daily
                      </span>
                      :{userInfo.personal_long || "Not Specified"}
                    </div>
                  </div>
                  {/* Row 6 */}
                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">Do you prefer a beard?</span>
                      :{userInfo.religion_beard || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">Are you a revert?</span>:
                      {userInfo.religion_revert || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">Do you keep halal?</span>:
                      {userInfo.religion_halal || "Not Specified"}
                    </div>
                    <div className="info-item">
                      <span className="info-label">Do you pray?</span>:
                      {userInfo.receiver_pray || "Not Specified"}
                    </div>
                  </div>
                  {/* Row 7 */}
                  <div className="info-row">
                    <div className="info-item">
                      <span className="info-label">
                        How often do you read Quran?
                      </span>
                      :{userInfo.religion_quran || "Not Specified"}
                    </div>
                  </div>{" "}
                  <div className="seprator-filter-result-aboutme"></div>
                  <div className="">
                    <div className="info-item">
                      <span className="info-label">About me:</span>{" "}
                      {userInfo.aboutme_about
                        ? userInfo.aboutme_about
                        : "Not Specified"}
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Autem soluta ea iure error similique velit nulla
                      repellendus laudantium inventore ab ipsa, mollitia
                      quisquam veniam modi libero, quod facilis beatae illum!
                    </div>
                  </div>
                  <div className="">
                    <div className="info-item">
                      <span className="info-label">What i am looking for:</span>
                      {userInfo.aboutme_looking
                        ? userInfo.aboutme_looking
                        : "Not Specified"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
