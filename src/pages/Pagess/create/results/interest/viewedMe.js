import { useEffect, useState } from "react";
import Camera from "../../../../../../public/camerasvg";
import Envelope from "../../../../../../public/envelope";
import Stop from "../../../../../../public/stopsvg";
import Excalim from "../../../../../../public/exclaimsvg";
import WaliRed from "../../../../../../public/search/waliRed";
import NextImage from "next/image";
import Link from "next/link";
import ImageSlider from "react-simple-image-slider";
import { ImageTwoTone } from "@mui/icons-material";
import ReactCountryFlag from "react-country-flag";
import Arrow from "../../../../../../public/arrow";
import { useRouter } from "next/navigation";
import { User } from "lucide-react";
import BlackHeartIcon from "../../../../../../public/nav/blackHeart";
import RedHeartIcon from "../../../../../../public/nav/redHeart";
import { getCode, getName } from "country-list";
export default function ViewedMe({ data }) {
  const [isMobile, setIsMobile] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  const [imageData, setImageData] = useState(null);
  const [viewBio, setViewBio] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null); //Temporary storage for users
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [showReport, setShowReport] = useState(false);
  const [counts, setCounts] = useState([]);
  const [heartedEmails, setHeartedEmails] = useState([]);
  const [showPrivate, setShowPrivate] = useState(false);
  //-----For blocking user---------
  const [showBlock, setShowBlock] = useState(false);
  //------Time Stamps---------
  const [email, setEmail] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [selectedUserData, setSelectedUserData] = useState(null);
  const [showWali, setShowWali] = useState(false);

  const handleShowAll = (userInfo) => {
    setShowAll(!showAll);
    setSelectedUserData(userInfo);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    // Initialize state based on window size
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const RequestWali = async (e, user) => {
    e.preventDefault();
    const receiver = user;
    const sender = localStorage.getItem("email");

    const data = {
      senderEmail: sender,
      receiverEmail: receiver,
      messageText: "I would like to request your wali details",
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
    console.log("Wali Request Sent: ", response);
  };
  //----------------For profile image------------------
  useEffect(() => {
    const getImages = async () => {
      try {
        if (data.length < 1) {
          return;
        }
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
  //--------------------^^^^^^^^^^^^^-------------------

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
    if (isNaN(age)) {
      age = "-";
    }
    return <div>{age}</div>;
  }
  //-------------^^^^^^^^^^^^^^^^^^^^------------------
  //-------------------Sending Message------------------------
  const SendMessage = async (e, user) => {
    e.preventDefault();
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

  //-------------------^^^^^^^^^^^^^^^^^^^^------------------
  //-------------------Request Wali------------------------

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

  //-------------------^^^^^^^^^^^^^^^^^^^^------------------
  //----------------For favs------------------

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
  //--------------------^^^^^^^^^^^^^-------------------

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

  //-----------------^^^^^^^^^^^^^^----------------

  // count data
  useEffect(() => {
    // Fetch email from localStorage
    const userEmail = localStorage.getItem("email");
    setEmail(userEmail);

    async function fetchData() {
      try {
        const res = await fetch("/api/interest/viewsCount", {
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
        setCounts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  //--------------------View Bio function-------------------
  const ViewBio = async (e, viewed) => {
    e.preventDefault();

    const viewer = localStorage.getItem("email");

    const res = await fetch("/api/interest/view", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ viewed, viewer }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }

    const response = await res.json();
    console.log(response);
  };

  //  update count data
  const handleUpdateStatus = async () => {
    // setIsLoading(true);

    try {
      // Retrieve email from localStorage
      const email = localStorage.getItem("email");

      // Check if email is available
      if (!email) {
        throw new Error("Email not found in localStorage");
      }

      // Mock API request - replace with your actual logic
      const response = await fetch("/api/interest/setCount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, user_status: 1 }), // Fixed value for user_status
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      console.log(response);
    } catch (error) {
      console.error("Error updating user status:", error.message);
    } finally {
      // setIsLoading(false);
    }
  };

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
      [].some(
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

  return (
    <div>
      <div
        className="bottom-container-search"
        onMouseEnter={handleUpdateStatus}
      >
        {data?.map((userInfo) => (
          <div
            key={userInfo.id}
            className="result-parent-container-search"
            style={{
              backgroundColor: counts.some(
                (count) =>
                  count.viewer_email === userInfo.email && count.views === 0
              )
                ? "#ededed"
                : "white",
            }}
          >
            {/* Your content here */}

            <div className="result-img-parent-search">
              <div className="result-main-img">
                <div className="img-container-search">
                  <>
                    {loaded ? (
                      renderUserImages(userInfo)
                    ) : (
                      <NextImage
                        src="/female.jpeg"
                        width={160}
                        height={160}
                        style={{ border: "1px solid black" }}
                        alt="Loading"
                      />
                    )}
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
                    <Link
                      className="view-bio-search"
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
                        localStorage.setItem("turn", 0);
                      }}
                      href="/Pagess/create/results/viewProfile/viewProfile"
                    >
                      <span className="view-bio-search-link">
                        <User />
                        View Profile
                      </span>
                    </Link>
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
                    <div>{formatTimeAgo(userInfo.active_since)}</div>
                    {/* {timeStamp.map((timestampItem) => {
                      if (timestampItem.email === userInfo.email) {
                        return (
                          <div key={timestampItem.email}>
                            {formatTimeAgo(timestampItem.active_since)}
                          </div>
                        );
                      }
                      return null; // Return null if no match
                    })} */}
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
                  {userInfo.types.slice(0, 4).map((type, index) => (
                    <div
                      key={index}
                      className={`result-line3 ${index} ${
                        isMobile ? "hide-on-mobile" : ""
                      }`}
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
                        // style={{ paddingRight: "10px" }}
                      >
                        Occupation:
                      </span>{" "}
                      {userInfo.eduwork_job || "Not Specified"}
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
          </div>
        ))}
      </div>
    </div>
  );
}
