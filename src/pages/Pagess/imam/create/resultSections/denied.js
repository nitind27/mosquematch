import { useEffect, useState } from "react";
import ImageSlider from "react-simple-image-slider";
import { ImageTwoTone } from "@mui/icons-material";

import { Data, useLoadScript } from "@react-google-maps/api";
import Link from "next/link";
import ReactCountryFlag from "react-country-flag";
import Envelope from "../../../../../../public/envelope";
import Camera from "../../../../../../public/camerasvg";
import Stop from "../../../../../../public/stopsvg";
import Excalim from "../../../../../../public/exclaimsvg";
import NextImage from "next/image";
import Arrow from "../../../../../../public/arrow";
import WaliRed from "../../../../../../public/search/waliRed";
export default function Denied() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [email, setEmail] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [viewBio, setViewBio] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [messageText, setMessageText] = useState("");

  const [loaded, setLoaded] = useState(false);
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyD2vzJGdXaHatCi0Hf-2Z6PvQyRYlh3Akc",
  });

  const [showReport, setShowReport] = useState(false);
  const [showWali, setShowWali] = useState(false);
  const [imageData, setImageData] = useState(null);
  //-----For Fav icon-----
  const [heartClicked, setHeartClicked] = useState(false);
  const [heartedEmails, setHeartedEmails] = useState([]);
  //-----For private image request---------
  const [showPrivate, setShowPrivate] = useState(false);
  //-----For blocking user---------
  const [showBlock, setShowBlock] = useState(false);
  const [blockStart, setBlockStart] = useState(0);
  //------Time Stamps---------
  const [timeStamp, setTimeStamp] = useState([]);

  // console.log(filteredData);
  const { getCode, getName } = require("country-list");
  const [showAll, setShowAll] = useState(false);

  const [selectedUserData, setSelectedUserData] = useState(null);
  const handleShowAll = (userInfo) => {
    setShowAll(!showAll);
    setSelectedUserData(userInfo);
  };

  //-------------Api to retrieve data for all males----------
  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching data");
      const email1 = localStorage.getItem("email");
      if (email1 === "" || !email1 || email1 === null) {
        return;
      }
      setEmail(email1);
      try {
        const res = await fetch("/api/imam/getDeniedUser", {
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

        //Adding a Distance Tracker to the Users

        console.log("Data found:", response.data);
        setData(response.data);
      } catch (error) {
        console.error("Error on first try fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log("Data changed", data);
  }, [data]);
  //-------------^^^^^^^^^^^^^^^^^^^^------------------

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

  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

    //---------------Block a user----------------
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
    {data.map((userInfo) => (
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
              style={{ height: "20px", width: "20px"}} // Set height and width inline
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
            <div>{userInfo.aboutme_looking}</div>
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
                <strong>{userInfo.email}</strong>
      
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
      </div>
      </div>
    ))}
  </div>
  );
}
