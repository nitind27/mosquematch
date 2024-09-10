import { useContext, useEffect, useState } from "react";
// import Envelope from "../../../../../../public/envelope";
import ImageSlider from "react-simple-image-slider";
import { Data, useLoadScript } from "@react-google-maps/api";
import Image from "next/image";
import Link from "next/link";
import ReactCountryFlag from "react-country-flag";
import Envelope from "../../../../../../public/envelope";
import Camera from "../../../../../../public/camerasvg";
import Stop from "../../../../../../public/stopsvg";
import Excalim from "../../../../../../public/exclaimsvg";
import NextImage from "next/image";
import Arrow from "../../../../../../public/arrow";
import WaliRed from "../../../../../../public/search/waliRed";
import Right from "../../../../../../public/right";
import Wrong from "../../../../../../public/wrong";
import UserProfileImg from "@/pages/Pagess/create/results/userProfileImg";
import { ImageTwoTone } from "@mui/icons-material";
import { AppContext } from "@/pages/Pagess/AppContext";

export default function Awaiting() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [email, setEmail] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [viewBio, setViewBio] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [messageText, setMessageText] = useState("");
  const [heartedEmails, setHeartedEmails] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyDWxhNp15n52e7kPQkfTTumYZT9E20cMHg",
  });
  //------Time Stamps---------
  const [timeStamp, setTimeStamp] = useState([]);
  //-----For private image request---------
  const [showPrivate, setShowPrivate] = useState(false);
  // console.log(filteredData);
  const { getCode, getName } = require("country-list");
  let locationSet = false;
  const { cLocation } = useContext(AppContext);

  //-----For blocking user---------
  const [showBlock, setShowBlock] = useState(false);

  const [showReport, setShowReport] = useState(false);
  const [showWali, setShowWali] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const handleShowAll = (userInfo) => {
    setShowAll(!showAll);
    setSelectedUserData(userInfo);
  };
  //-------------Api to retrieve data for all males----------
  useEffect(() => {
    const fetchData = async () => {
      const email1 = localStorage.getItem("email");
      if (email1 === "" || !email1 || email1 === null) {
        return;
      }
      setEmail(email1);
      try {
        const res = await fetch("/api/imam/getInfoAwaiting", {
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

        setData(response.user);
      } catch (error) {
        console.error("Error on first try fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (cLocation && !locationSet) {
      locationSet = true;
      var tempData = data.map((e) => {
        if (e.locations) {
          let tempLoc = JSON.parse(e.locations)[0];
          e.distance = Math.round(
            getDistance(cLocation[0], cLocation[1], tempLoc[0], tempLoc[1])
          );
        }

        return e;
      });
    }
  }, [cLocation]);
  useEffect(() => {
    const filteredData = data.filter((item) => {item.gender === "male"
    // if (email !== item.email) {
    //   if (
    //     item.distance !== "Unknown" &&
    //     (item.distance < rangeContext * 1 || rangeContext === 0)
    //   ) {
    //     return true;
    //   } else if (item.distance === "Unknown") {
    //     return true;
    //   }
    // }
  });
    setFilteredData(filteredData);
  }, [data]);

  //-------------^^^^^^^^^^^^^^^^^^^^------------------
  const getDistance = (lat1, lng1, lat2, lng2) => {
    const radlat1 = (Math.PI * lat1) / 360;
    const radlat2 = (Math.PI * lat2) / 360;
    const theta = lng1 - lng2;
    const radtheta = (Math.PI * theta) / 360;
    let dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;

    dist = dist * 60 * 1.1515; // distance in miles
    dist = dist * 1.609344; // convert miles to kilometers

    return dist;
  };

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
  //-------------^^^^^^^^^^^^^^^^^^^^------------------

  const RequestPrivateImage = async (e, user) => {
    e.preventDefault();
    const receiver = user;
    const sender = localStorage.getItem("email");

    const data = {
      senderEmail: sender,
      receiverEmail: receiver,
      messageText: "Would like to request your private images",
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
    console.log("Private Image Request Sent: ", response);
  };
  //--------------------View Bio function-------------------
  const ViewBio = async (e, user) => {
    e.preventDefault();

    const username = user;

    const res = await fetch("/api/createAcc/addView", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
  };
  //--------------------^^^^^^^^^^^^^-------------------

  const check = (item, userItem) => {
    if (item.length == 0 || item.indexOf(userItem.toLowerCase()) !== -1) {
      return 1;
    }
  };

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
  //------------------Verifies Email------------------

  const verifyEmail = async (user, command) => {
    const email1 = user;
    console.log("email1:", email1);
    const email2 = localStorage.getItem("email");
    console.log("email2:", email2);
    const res = await fetch("/api/imam/verifyEmail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email1: email1, email2: email2, number: command }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
    console.log(response);
  };
  //------------------^^^^^^^^^^^^^-------------------

  //----------------For profile image------------------
  useEffect(() => {
    const getImages = async () => {
      try {
        const emails = data.map((user) => user.email);

        // Fetch images from the first endpoint
        const res1 = await fetch("/api/createAcc/getProfileImgBulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: emails,
          }),
        });
        const data1 = await res1.json();

        // Fetch images from the second endpoint
        const res2 = await fetch("/api/createAcc/getProfileImgPublicBulk", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: emails,
          }),
        });
        const data2 = await res2.json();

        // Check if either request failed
        if (data1.error || data2.error) {
          setLoaded(true);
          return;
        }

        // Combine image data from both endpoints
        const imageData = [data1.image, data2.images];
        // Set the image data and mark as loaded
        setImageData(imageData);
        setLoaded(true);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    getImages();
  }, [data]);
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

  //----------------Heart Click Function && REMOVE------------------

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

  useEffect(() => {
    // console.log("HEARTED EMAILS: ", heartedEmails);
  }, [heartedEmails]);

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

  //-------------------^^^^^^^^^^^^^^^^^^^^------------------
  const renderUserImages = (userInfo) => {
    const userImages = imageData
      .flat()
      .filter((img) => img.email === userInfo.email)
      .map((image, index) => ({
        url:
          index === 0 ? `data:image/jpeg;base64,${image.image}` : image.image,
      }));

    const isFemaleWithApproval =
      userInfo.gender === "female" &&
      requestCheck.some(
        (request) =>
          request.receiver_email === userInfo.email &&
          request.sender_email === email &&
          request.status === "approved"
      );

    if (userImages.length === 0) {
      return (
        <NextImage
          src={userInfo.gender == "female" ? "/female.jpeg" : "/man.jpg"}
          width={150}
          height={150}
          style={{ border: "1px solid black" }}
          alt="Female Placeholder"
        />
      );
    }

    if (isFemaleWithApproval) {
      return (
        <NextImage
          src="/private.jpg"
          width={150}
          height={150}
          style={{ border: "1px solid black" }}
          alt="Private"
        />
      );
    }

    return (
      <div className="image-slider-container">
        <ImageSlider
          width={150}
          height={150}
          images={userImages}
          showBullets={false}
          showNavs={true}
          navMargin={-5}
          navSize={30}
          color={"red"}
          navStyle={ImageTwoTone}
        />
      </div>
    );
  };
  //CSS IN imam.css in AWAITING SECTION
  return (
    <div className="bottom-container-search">
      {filteredData.map((userInfo) => (
        <div key={userInfo.id} className="result-parent-container-search">
          <div className="result-img-parent-search">
            <div className="result-main-img">
              <div className="img-container-search">
                {loaded ? (
                  renderUserImages(userInfo)
                ) : (
                  <NextImage
                    src="/female.jpeg"
                    width={150}
                    height={150}
                    style={{ border: "1px solid black" }}
                    alt="Loading"
                  />
                )}
              </div>
              <div className="result-line1">
                <div className="flag-container">
                  <ReactCountryFlag
                    countryCode={getCode(`${userInfo.aboutme_country}`)}
                    svg
                    title="India"
                    className="result-line1-flag"
                    style={{ height: "20px", width: "20px" }} // Set height and width inline
                  />
                </div>
                <div className="flag-container">
                  <ReactCountryFlag
                    countryCode={getCode(`${userInfo.personal_origin}`)}
                    svg
                    style={{
                      marginRight: "10px",
                      height: "20px",
                      width: "20px",
                    }} // Set height and width inline
                    title="India"
                    className="result-line1-flag"
                  />
                </div>
              </div>
            </div>

            <div className="result-right-parent-container">
              <div className="result-line1-container-search">
                <div></div>
                <div className="active-text-search">
                  Active:
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
              </div>

              <div className="result-line2-container-search">
                <div className="result-line2">
                  <Link
                    onClick={(e) => {
                      e.preventDefault(); // Prevent the default behavior of the link
                      setSelectedUserInfo(userInfo);
                      ViewBio(e, userInfo.email);
                      router.push({
                        pathname:
                          "/Pagess/create/results/viewProfile/viewProfile",
                        query: {
                          name: JSON.stringify(userInfo),
                        },
                      });
                    }}
                    href="/Pagess/create/results/viewProfile/viewProfile"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    <strong>{userInfo.username}</strong>
                  </Link>
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
                        id="heart"
                        onClick={() => {
                          HeartClickRemove(userInfo.email);
                        }}
                      ></div>
                    ) : (
                      <div
                        id="blackHeart"
                        onClick={() => {
                          HeartClick(userInfo.email);
                        }}
                      ></div>
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
                        <div className="msg-text-search">Block This User?</div>
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
                              // reloadPage();
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
                  className="heart-container-search"
                  onClick={() => {
                    setSelectedUserInfo(userInfo);
                    setShowWali(true);
                  }}
                >
                  {userInfo.gender == "male" ? "" : <WaliRed />}
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
                <div>{userInfo.distance + " Km Away"}</div>
                
                {userInfo.types.slice(0, 3).map((type, index) => (
                  <div
                    key={index}
                    className={`result-line3 ${index}`}
                    data-tooltip={type}
                  >
                    {type}
                  </div>
                ))}
                <div>
                  {!showAll && userInfo.types.length > 3 && (
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
                          <div
                            onClick={(e) => {
                              setShowAll(false);
                            }}
                          >
                            X
                          </div>
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
                  <i>
                    <span className="result-line4">Sect:</span>
                    {userInfo.religion_sector}
                  </i>{" "}
                </div>
                <div className="info-search">
                  <i>
                    <span className="result-line4">Hijab</span>:
                    {userInfo.religion_hijab}
                    {userInfo.religion_hijab}
                  </i>{" "}
                </div>

                <div className="info-search">
                  <i>
                    <span className="result-line4">Pray</span>:
                    {userInfo.religion_pray}
                  </i>{" "}
                </div>

                <div className="info-search">
                  <i>
                    <span className="result-line4">Quran</span>:
                    {userInfo.religon_quran}
                  </i>{" "}
                </div>

                <div className="info-search">
                  <i>
                    <span className="result-line4">Religiousness</span>:
                    {userInfo.religion_religious}
                  </i>
                </div>
              </div>

              <span className="result-line5-container-datas">
                <i>
                  <div className="result-line5-container-search">
                    <div className="info-search">
                      <span className="result-line5">Occupation</span>:
                      {userInfo.eduwork_job
                        ? userInfo.eduwork_job
                        : "Not Specified"}
                    </div>
                    <div className="info-search">
                      <span className="result-line5">Martial Status</span>:{" "}
                      {userInfo.personal_marital}
                    </div>
                    <div className="info-search">
                      <span className="result-line5">Has Children</span>:{" "}
                      {userInfo.personal_children2}
                    </div>
                    <div className="info-search">
                      {" "}
                      <span className="result-line5">Build</span>:
                      {userInfo.personal_build}{" "}
                    </div>

                    <div>
                      <span className="result-line5">Height</span>:{" "}
                      {userInfo.personal_height}{" "}
                    </div>

                    <div className="">
                      <div>
                        <span className="result-line5">Income</span>:{" "}
                        {userInfo.personal_income}
                      </div>
                    </div>
                  </div>
                </i>
              </span>
            </div>
            <div className="btn-container-awaiting">
              {/* 0 = VERIFY   1 = DENY  */}
              <div
                className="btn-awaiting"
                onClick={() => verifyEmail(userInfo.email, 0)}
              >
                <Right />
              </div>
              <div
                className="btn2-awaiting"
                onClick={() => verifyEmail(userInfo.email, 1)}
              >
                <Wrong />
              </div>
              <div
                className="btn3-awaiting"
                onClick={(e) => {
                  setSelectedUserInfo(userInfo);
                  setShowMessage(true);
                }}
              >
                <Envelope />
              </div>
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
