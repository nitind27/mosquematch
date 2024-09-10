import { useEffect, useState } from "react";
import ResultHeart from "../../../../../../public/resultheartsvg";
import Camera from "../../../../../../public/camerasvg";
import Envelope from "../../../../../../public/envelope";
import Stop from "../../../../../../public/stopsvg";
import Excalim from "../../../../../../public/exclaimsvg";
import WaliRed from "../../../../../../public/search/waliRed";
import HeartClick from "../../../../../../public/heartClickSvg";
import NextImage from "next/image";
import { useRouter } from "next/navigation";
export default function Request() {
  const [data, setData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [viewBio, setViewBio] = useState(false);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null); //Temporary storage for users
  const [showMessage, setShowMessage] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [heartClicked, setHeartClicked] = useState(false);
  const [heartedEmails, setHeartedEmails] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [showPrivate, setShowPrivate] = useState(false);
  //-----For blocking user---------
  const [showBlock, setShowBlock] = useState(false);
  const [blockStart, setBlockStart] = useState(0);
  //------Time Stamps---------
  const [timeStamp, setTimeStamp] = useState([]);
  //------Loading State---------
  const [loading, setLoading] = useState(false);
  //-------Requests Approve/Deny------
  const [approve, setApprove] = useState("");

  //-------------Api to retrieve data------------------
  useEffect(() => {
    const fetchData = async () => {
      const email1 = localStorage.getItem("email");
      
      if (email1 === "" || !email1 || email1 === null) {
        return;
      }
      try {
        const res = await fetch("/api/interest/requestMe", {
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

        const dataToChange = response.data;

        console.log("Data to change: ", dataToChange);

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

        //Getting active time

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
        setTimeStamp(timeData);

        //Filtering users who are blocked by current
        const dataChanged = dataToChange.filter(
          (user) => !data2.some((item) => item.receiver_email === user.email)
        );

        console.log("Data Changed: ", dataChanged);

        //Filtering users who have blocked current user
        const filteredData = dataChanged.filter(
          (user) => !data3.some((item) => item.sender_email === user.email)
        );

        setData(filteredData);
      } catch (error) {
        console.error("Error on first try fetching data:", error.message);
      }
    };

    fetchData();
  }, []);


  //-------------^^^^^^^^^^^^^^^^^^^^------------------
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

  //--------------------^^^^^^^^^^^^^-------------------

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
  };

  const HeartClickRemove = async (user) => {
    console.log("Heart clicked!");
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
  };
  //--------------------^^^^^^^^^^^^^-------------------

  const reloadPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 1500);
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
      return `${differenceMinutes} minute${differenceMinutes > 1 ? "s" : ""} ago`;
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
  };

  //-----------------^^^^^^^^^^^^^^----------------

  //---------------Handle Approve/Denied Req---------------

  const HandleRequest = async (emai, access) => {
    try {
      const res = await fetch("/api/interest/requestHandle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver: localStorage.getItem("email"),
          sender: emai,
          approve: access,
        }),
      });
      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error if:", errorMessage.error);
        return;
      }
      const response = await res.json();
      console.log(response);
      reloadPage();
    } catch (error) {
      console.log("Error on request handle: ", error);
    }
  };

  //-----------------^^^^^^^^^^^^^^----------------

  return (
    <div>
      <div className="bottom-container-search">
        {data.map((userInfo) => (
          <div key={userInfo.id} className="result-parent-container-search">
            <div className="result-img-parent-search">
              <div className="img-container-search">
                {loaded ? (
                  <div>
                    {imageData
                      .filter((img) => img.email === userInfo.email)
                      .map((img) => (
                        <NextImage
                          unoptimized
                          key={img.email} // Ensure each NextImage has a unique key
                          src={`data:image/jpeg;base64,${img.image}`}
                          width={100}
                          height={100}
                          style={{
                            border: "1px solid black",
                          }}
                          alt=""
                        />
                      ))}
                    {imageData.filter((img) => img.email === userInfo.email)
                      .length === 0 && (
                      <NextImage
                        unoptimized
                        src="/female.jpeg" // Set src to "/female.jpeg" if no images found
                        width={100}
                        height={100}
                        style={{
                          border: "1px solid black",
                        }}
                        alt=""
                      />
                    )}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
            <div className="result-right-parent-container">
              <div className="result-line1-container-search">
                <div className="request-container-search">
                  <div
                    className="approve-request-search"
                    onClick={() => {
                      setApprove("approved");
                      HandleRequest(userInfo.email, "approved");
                    }}
                  >
                    Approve
                  </div>
                  <div
                    className="deny-request-search"
                    onClick={() => {
                      setApprove("denied");
                      HandleRequest(userInfo.email, "denied");
                    }}
                  >
                    Deny
                  </div>
                </div>
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
                <div>{userInfo.username},</div>
                <div className="age-search">
                  {calculateAge(
                    userInfo.aboutme_year,
                    userInfo.aboutme_month,
                    userInfo.aboutme_day
                  )}
                </div>
                <div className="mini-seprator-search"></div>

                <div className="heart-container-search">
                  {Array.isArray(heartedEmails) ? (
                    heartedEmails.includes(userInfo.email) ? (
                      <div
                        id="heart"
                        onClick={() => {
                          HeartClickRemove(userInfo.email);
                          reloadPage();
                        }}
                      ></div>
                    ) : (
                      <div
                        id="blackHeart"
                        onClick={() => {
                          HeartClick(userInfo.email);
                          reloadPage();
                        }}
                      ></div>
                    )
                  ) : null}
                </div>
                <div
                  className="heart-container-search"
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
                  className="heart-container-search"
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
                              setMessageText(
                                "I would like to request your Private Images"
                              );
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
                  className="heart-container-search"
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
                              reloadPage();
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
                  className="heart-container-search"
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
                <div className="heart-container-search">
                  <WaliRed />
                </div>
              </div>

              <div className="result-line4-container-search">
                <div>{userInfo.eduwork_profession} -</div>
                <div className="info-search">{userInfo.religion_sector} - </div>
                <div className="info-search">{userInfo.eduwork_subject} -</div>
                <div className="info-search">{userInfo.personal_height} -</div>
                <div className="info-search"> {userInfo.religion_pray}</div>
              </div>
              <div className="result-line5-container-search">
                <div>{userInfo.religion_halal} -</div>
                <div className="info-search"> {userInfo.personal_smoke} -</div>
                <div className="info-search"> {userInfo.personal_drink} -</div>
              </div>
              <div className="result-line5-container-search">
                <div> {userInfo.personal_marriage} -</div>
                <div className="info-search">{userInfo.personal_relocate}</div>
              </div>
              <div className="result-line5-container-search">
                <div>Annual Income: {userInfo.personal_income}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
