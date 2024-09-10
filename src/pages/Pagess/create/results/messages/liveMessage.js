import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { io } from "socket.io-client";
import ResultsNav from "../navResult";
import Image from "next/image";
import MessageSend from "../../../../../../public/sendMsgSvg";
import { useRef } from "react";
import Right from "../../../../../../public/right";
import Wrong from "../../../../../../public/wrong";

export default function MessageHome() {
  const [inputText, setInputText] = useState("");
  const [socket, setSocket] = useState(null);
  const [defaultScreen, setDefaultScreen] = useState(true);
  const [data, setData] = useState([]);
  const [username, setUsername] = useState("");
  const [recievedMessages, setRecievedMessages] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [filteredMessage, setFilteredMessage] = useState([]); //All emails for the current user
  const [uniqueUsers, setUniqueUsers] = useState([]); //All unique users for the current user
  const [emailFound, setEmailFound] = useState("");
  const [allMessages, setAllMessages] = useState([]); //All messages for the current user
  const [filteredAndSortedMessages, setFilteredAndSortedMessages] = useState(
    []
  );
  const [checkBlock, setCheckBlock] = useState([]);
  const [isRequestHandled, setIsRequestHandled] = useState(false);
  const [msgCounts, setMsgCounts] = useState([]);
  const [email, setEmail] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState("Offline");
  const [message, setMessage] = useState(""); //Message to send
  const [selectedUser, setSelectedUser] = useState(""); //Selected user to display messages
  const { push } = useRouter();
  //State for image Profile
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const canvasRef2 = useRef(null);
  const imageRef2 = useRef(null);
  const [selectedUserUrl, setSelectedUserUrl] = useState(null);
  const [approve, setApprove] = useState("");
  const [requestData, setRequestData] = useState([]);
  const [requestCheck, setRequestCheck] = useState([]);

  //States for others images
  const [images, setImages] = useState([
    {
      email: "",
      username: "",
      imageUrl: null,
      isBlurred: false,
      backup: null,
      imageBase64: "",
    },
  ]);
  const [initEmailsz, setInitEmailsz] = useState(false);
  const imageRefs = useRef([]);
  const [otherloading, setOtherLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);

  useEffect(() => {
    localStorage.setItem("currentNavOption", "messages");
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/interest/requestData");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setRequestData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    function handleMouseEnter() {
      fetchData();
      document.removeEventListener("mouseenter", handleMouseEnter);
    }

    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, []);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/interest/requestCheck");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setRequestCheck(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  //--------------Get Profile Image-----------
  useEffect(() => {
    var getImg = async () => {
      try {
        const res = await fetch("/api/createAcc/getProfileImg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("email"),
          }),
        });
        const data = await res.json();
        if (data.error) {
          console.log("Error: ", data.error);
          setImageUrl(null);
        } else {
          setImageUrl("data:image/jpeg;base64," + data.backup);
        }
        setLoading(true);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    getImg();
  }, []);

  //--------------------^^^^^^^^^^--------------------

  // ---------------------Update message count
  useEffect(() => {
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
        const response = await fetch("/api/interest/setmsgCount", {
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
    handleUpdateStatus();
  }, []);

  // useEffect(()=>{
  //   handleUpdateStatus()
  // },[])
  //---------------Handle Approve/Denied Req---------------

  const HandleRequest = async (email, access) => {
    if (!socket || socket === null) {
      console.log("socket not found");
      return;
    }

    try {
      const res = await fetch("/api/interest/requestHandle", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          receiver: localStorage.getItem("email"),
          sender: email,
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

      // Emit WebSocket events after handling the request
      const emailCurrent = localStorage.getItem("email");
      socket.emit("getRequestUpdates", emailCurrent);
      socket.emit("refreshOther", email);

      console.log("server: ", response.message);
      setMessage("");
      socket.emit("getSentMessages", emailCurrent);

      socket.emit("refreshOther", emailFound);

      reloadPage();
    } catch (error) {
      console.log("Error on request handle: ", error);
    }
  };

  //--------------------Socket Initializer--------------------
  useEffect(() => {
    const socketInitializer = async () => {
      const username = localStorage.getItem("username");
      setUsername(username);

      const email = localStorage.getItem("email");
      setEmailFound(email);

      if (email === "" || !email || email === null) {
        console.log("no email found");
        return;
      }
      await fetch("/api/message/socket");
      const newSocket = io();
      setSocket(newSocket);

      newSocket.on("connection", () => {
        console.log("connected with server");
      });

      newSocket.emit("addUser", email);
      newSocket.emit("getOnline", email);

      newSocket.on("messageFromServer", (message) => {
        console.log(message);
      });

      newSocket.on("getRecievedMessages", (arr, email1) => {
        let em = localStorage.getItem("email");
        if (email1 === em) {
          setRecievedMessages(arr);
        }
      });

      newSocket.on("getSentMessages", (arr, email2) => {
        let em = localStorage.getItem("email");

        if (email2 === em) {
          setSentMessages(arr);
        }
      });

      newSocket.on("refreshOther", (result, email) => {
        console.log("Email on refreshOther:", email);
        let tempE = localStorage.getItem("email");
        if (email === tempE) {
          setRecievedMessages(result);
        } else {
          console.log("Refresh false");
        }
      });
    };

    socketInitializer();
  }, []);

  //-----------Fetch recieved/Sent messages------------------
  useEffect(() => {
    //Fetch recieved messages
    const email = localStorage.getItem("email");
    console.log("email on live: ", email);
    if (socket != null) {
      socket.emit("getRecievedMessages", email);
      socket.emit("getSentMessages", email);
      socket.on("updateOnline", (users) => {
        const uniqueEmails = {};

        const uniqueUsers = users.filter((user) => {
          if (!uniqueEmails[user.email]) {
            uniqueEmails[user.email] = true;
            return true;
          }
          return false;
        });

        setOnlineUsers(uniqueEmails);
      });
    }
  }, [socket, requestData]);

  //--------------------^^^^^^^^^^--------------------

  //-------Filtered array for left pane contact display-----

  useEffect(() => {
    // Combine and filter messages
    const allMessages = [
      ...sentMessages.map((message) => ({
        email: message.receiver_email,
        ...message,
      })),
      ...recievedMessages.map((message) => ({
        email: message.sender_email,
        ...message,
      })),
    ];

    const uniqueEmails = Array.from(
      new Set(allMessages.map((message) => message.email))
    );
    setFilteredMessage(uniqueEmails);
  }, [sentMessages, recievedMessages]);
  //--------------------^^^^^^^^^^--------------------------

  //-----get unique username and filter state for dups------
  useEffect(() => {
    const fetchData = async () => {
      const uniqueUsersSet = new Set();

      for (const email of filteredMessage) {
        try {
          const res = await fetch("/api/message/getUsername", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });

          if (!res.ok) {
            const errorMessage = await res.json();
            console.error("Error if:", errorMessage.error);
            continue;
          }

          const response = await res.json();

          uniqueUsersSet.add(response.user);
        } catch (error) {
          console.error("Error on fetching data:", error.message);
        }
      }

      setUniqueUsers(Array.from(uniqueUsersSet));
    };

    fetchData();
  }, [email]);

  //-----get unique Emails and usernames and store in images,setImages------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/message/getEmailsAndUsername", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(localStorage.getItem("email")),
        });

        if (!res.ok) {
          const errorMessage = await res.json();
          console.error("Error if:", errorMessage.error);
          return;
        }
        const response = await res.json();

        const tempImages = [];

        response.forEach(({ email, username }) => {
          tempImages.push({
            email,
            username,
            imageUrl: null,
            isBlurred: false,
            backup: null,
            imageBase64: "",
          });
        });

        const filteredImages = tempImages.filter(
          (image) => image.email.trim() !== ""
        );
        //Now images contain all the emails and usernames
        setInitEmailsz(true);
        setImages(filteredImages);
      } catch (error) {
        console.error("Error on fetching data:", error.message);
      }
    };

    // fetchData();

    // Update filtered data when rangeContext changes
    const updateFilteredData = () => {
      fetchData();
    };

    // Call updateFilteredData whenever rangeContext changes
    const rangeContextListener = setInterval(updateFilteredData, 1000);

    // Clean up interval listener when the component unmounts or when rangeContext changes
    return () => clearInterval(rangeContextListener);
  }, []);

  //---------Fetch Profile Image for other users--------------
  useEffect(() => {
    const getImg = async () => {
      try {
        const updatedImages = [];
        for (const image of images) {
          const { email } = image; // Destructure email property from the image object
          try {
            const res = await fetch("/api/createAcc/getProfileImg", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ email }), // Ensure email is sent as an object
            });
            const data = await res.json();

            const imageUrl = data.image ? data.image : null;
            const backup = data.backup ? data.backup : null;
            const imageBase64 = data.image ? data.image : null;
            let blur = false;
            if (data.privacy === "yes") {
              blur = true;
            }

            updatedImages.push({
              email,
              username: image.username,
              imageUrl,
              isBlurred: blur,
              backup,
              imageBase64,
            });
          } catch (error) {
            console.error("Error fetching profile image:", error);
            // Push null to maintain index consistency
            updatedImages.push(null);
          }
        }

        // Set the images array with the updated images
        setImages(updatedImages);
        setOtherLoading(true);
        console.log("Images updated:", updatedImages);
      } catch (error) {
        console.error("Error updating images:", error);
      }
    };

    getImg();
  }, [initEmailsz]);

  //--------------------^^^^^^^^^^--------------------------

  //---------Fetch All User Data for a single user----------
  useEffect(() => {
    const fetchData = async () => {
      const email1 = localStorage.getItem("email");
      if (email1 === "" || !email1 || email1 === null) {
        return;
      }
      setEmail(email1);
      try {
        const res = await fetch("/api/message/getSingleUser", {
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
        setData(response.user.rows);
      } catch (error) {
        console.error("Error on first try fetching data:", error.message);
      }
    };
    fetchData();
  }, []);

  //--------------------^^^^^^^^^^--------------------

  //---------Get email of selected user--------------
  const selectUser = async (user, url) => {
    console.log("User selected", user);
    setSelectedUserUrl(url);
    console.log("Selected user url:", url);
    setSelectedUser(user);
    const res = await fetch("/api/message/getEmailbyName", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
    console.log("Email found:", response.email);

    setEmailFound(response.email);

    setDefaultScreen(false);
  };

  //--------------------^^^^^^^^^^--------------------

  //---------Display messages in order----------------
  useEffect(() => {
    const allMessages1 = [...sentMessages, ...recievedMessages];

    setAllMessages(allMessages1); //Storing every message first
  }, [sentMessages, recievedMessages]);

  const sortByTimestamp = (a, b) =>
    new Date(a.timestamp) - new Date(b.timestamp);

  useEffect(() => {
    const tempEmail = localStorage.getItem("email"); // Fix the typo in 'localstorage'

    const filteredAndSortedMessages = allMessages
      .filter(
        (message) =>
          (message.sender_email === emailFound &&
            message.receiver_email === tempEmail) ||
          (message.sender_email === tempEmail &&
            message.receiver_email === emailFound)
      )
      .sort(sortByTimestamp);

    setFilteredAndSortedMessages(filteredAndSortedMessages);
  }, [allMessages, emailFound]);
  //--------------------^^^^^^^^^^--------------------

  //------------------Send message--------------------
  const handleMessage = async () => {
    if (!socket || socket === null) {
      console.log("socket not found");
      return;
    }
    if (message === "") {
      return;
    }

    const emailCurrent = localStorage.getItem("email");
    const res = await fetch("/api/message/sendMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderEmail: emailCurrent,
        receiverEmail: emailFound,
        messageText: message,
      }),
    });
    if (!res.ok) {
      console.log("Error occured while send msg live");
      return;
    }
    const response = await res.json();
    console.log("server: ", response.message);
    setMessage("");
    socket.emit("getSentMessages", emailCurrent);

    socket.emit("refreshOther", emailFound);
  };

  //--------------------^^^^^^^^^^--------------------
  useEffect(() => {
    const getOnlineStatus = async () => {
      console.log("Function called");

      let newEmail = emailFound;
      const newOnlineUsers = Object.keys(onlineUsers);
      const emailExistsInState = newOnlineUsers.includes(newEmail);
      console.log("ONLINE USERS: ", newOnlineUsers);
      if (emailExistsInState) {
        setOnlineStatus("Online");
      } else {
        setOnlineStatus("Offline");
      }
    };
    getOnlineStatus();
  }, [selectedUser, emailFound]);

  const handleImageRefLoaded = (index) => {
    const imageRef = imageRefs.current[index];
    // Do nothing if the imageRef is already set
    if (imageRef) return;

    // Set the imageRef once it's loaded
    imageRefs.current[index] = imageRef;
  };

  //  check block data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/interest/checkBlock");
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await res.json();
        setCheckBlock(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  // count messages data
  useEffect(() => {
    // Fetch email from localStorage
    const userEmail = localStorage.getItem("email");
    setEmail(userEmail);

    async function fetchData() {
      try {
        const res = await fetch("/api/interest/personalmsgCount", {
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
        setMsgCounts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    fetchData();
  }, []);

  const msgsParentRef = useRef(null);

  useEffect(() => {
    // Function to keep scroll position at the bottom
    const scrollToBottom = () => {
      if (msgsParentRef.current) {
        msgsParentRef.current.scrollTop =
          msgsParentRef.current.scrollHeight -
          msgsParentRef.current.clientHeight;
      }
    };

    // Call the function to initially set the scroll position to the bottom
    scrollToBottom();
  }, [filteredAndSortedMessages, requestData]); // Add dependencies if needed

  return (
    <div>
      <div className="parent-live">
        <ResultsNav />
        <div className="box-container-live">
          <div className="left-container-live">
            <div className="header-left0-live">
              <div className="header-left1-live">
                {loading ? (
                  <div>
                    <canvas
                      ref={canvasRef}
                      width={100}
                      height={100}
                      style={{
                        border: "1px solid black",
                        display: "none",
                      }}
                    ></canvas>

                    <img
                      ref={imageRef}
                      src={imageUrl ? imageUrl : "/female.jpeg"}
                      width={70}
                      height={70}
                      className="profile-image-live"
                      alt=""
                    />
                  </div>
                ) : (
                  <div className="loader">
                    <div></div>
                  </div>
                )}
              </div>
              <div className="header-left1-holder">
                <div className="header-left1-heading">Personal Chats</div>
                <div className="name-left-live">For {username}</div>
              </div>
            </div>
            {/* <div>
   
      {checkBlock.length === 0 ? (
      <></>
      ) : (
        <ul>
          {checkBlock.map((user, index) => (
            <li key={index}>
             <li>{user.sender_email}{}</li>
            </li>
          ))}
        </ul>
      )}
    </div>*/}

            <div className="body-left-container-live">
              {/* Mapping username for left pane */}
              {images.map((image, index) => (
                <div
                  className="container-user-live"
                  key={index}
                  onClick={() => {
                    selectUser(image.username, image.imageUrl);
                    setLoading2(true);
                  }}
                >
                  {loading ? (
                    <div className="parent-select-user-live">
                      <canvas
                        ref={(ref) => (imageRefs.current[index] = ref)}
                        width={100}
                        height={100}
                        style={{
                          border: "1px solid black",
                          display: "none",
                        }}
                      ></canvas>
                      {requestCheck.some(
                        (request) =>
                          request.sender_email === email &&
                          request.receiver_email === image.email &&
                          request.status === "approved"
                      ) ? (
                        <img
                          ref={(ref) => (imageRefs.current[index] = ref)}
                          src={
                            image.isBlurred
                              ? image.imageUrl
                                ? `data:image/jpeg;base64,${image.imageUrl}`
                                : "/female.jpeg"
                              : image.backup
                              ? `data:image/jpeg;base64,${image.backup}`
                              : "/female.jpeg"
                          }
                          width={50}
                          height={50}
                          alt=""
                          className="profile-image-live"
                          onLoad={() => handleImageRefLoaded(index)}
                        />
                      ) : (
                        <img
                          ref={(ref) => (imageRefs.current[index] = ref)}
                          src="/female.jpeg"
                          width={50}
                          height={50}
                          alt=""
                          className="profile-image-live"
                          onLoad={() => handleImageRefLoaded(index)}
                        />
                      )}
                      <div className="name-user-live">{image.username}</div>

                      {/* <div className="msgcount-user-live">
                        {" "}
                        {msgCounts.length == 0
                          ? msgCounts.sender_email
                          : msgCounts.length}
                      </div> */}
                    </div>
                  ) : (
                    <div className="loader">
                      <div></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {defaultScreen ? (
            <div className="default-container-live">
              <div>Messages Will Appear Here</div>
            </div>
          ) : (
            <div className="right-container-live">
              <div className="header-right0-live">
                <div className="header-right1-live">
                  {loading2 ? (
                    <div className="">
                      <canvas
                        ref={canvasRef2}
                        width={100}
                        height={100}
                        style={{
                          border: "1px solid black",
                          display: "none",
                        }}
                      ></canvas>
                      {requestCheck.some(
                        (request) =>
                          request.sender_email === email &&
                          request.receiver_email === emailFound &&
                          request.status === "approved"
                      ) ? (
                        <img
                          ref={imageRef2}
                          src={
                            selectedUserUrl
                              ? "data:image/jpeg;base64," + selectedUserUrl
                              : "/female.jpeg"
                          }
                          className="header-right0-image-live"
                          alt=""
                        />
                      ) : (
                        <img
                          ref={imageRef2}
                          src="/female.jpeg"
                          className="header-right0-image-live"
                          alt=""
                        />
                      )}
                    </div>
                  ) : (
                    <div className="loader">
                      <div></div>
                    </div>
                  )}
                </div>
                <div className="name-right-holder">
                  <div className="name-right-live">{selectedUser}</div>
                  <div className="name-right-status">{onlineStatus}</div>
                </div>
              </div>
              <div className="msgs-body">
                <div className="msgs-parent-live" ref={msgsParentRef}>
                  {filteredAndSortedMessages.map((message, index) => (
                    <div className="text-container-wrapper">
                      <div
                        key={index}
                        className={
                          message.sender_email != emailFound
                            ? "sender-live"
                            : "receiver-live"
                        }
                      >
                        <div
                          className={
                            message.sender_email != emailFound
                              ? "sender-text-container-live"
                              : "reciever-text-container-live"
                          }
                        >
                          <div
                            className={
                              message.sender_email != emailFound
                                ? "sender-text-live"
                                : "reciever-text-live"
                            }
                          >
                            {message.message_text}
                          </div>

                          <div
                            className={
                              message.sender_email != emailFound
                                ? "sender-timestamp"
                                : "reciever-timestamp"
                            }
                          >
                            {new Intl.DateTimeFormat("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                              hour12: true,
                            }).format(new Date(message.timestamp))}
                          </div>
                        </div>
                      </div>

                      {/* {  <p>Sender: {message.sender_email}</p>
                    <p>Receiver: {message.receiver_email}</p>
                  <p>Timestamp: {message.timestamp}</p>} */}
                    </div>
                  ))}

                  {!isRequestHandled &&
                    requestData.map((request) =>
                      request.receiver_email === email &&
                      request.sender_email === emailFound ? (
                        <div key={request.id}>
                          <div className="sender-text-container-live1">
                            Reda Gouid asked to view your pictures
                          </div>
                          <div className="clearfix spacer"></div>
                          <div className="message-permission-container">
                            <div
                              className="message-permission"
                              onClick={() => {
                                setApprove("denied");
                                HandleRequest(emailFound, "denied");
                                setIsRequestHandled(true);
                              }}
                            >
                              <Wrong />
                            </div>
                            <div
                              className="message-permission"
                              onClick={() => {
                                setApprove("approved");
                                HandleRequest(emailFound, "approved");
                                setIsRequestHandled(true);
                              }}
                            >
                              <Right />
                            </div>
                          </div>
                        </div>
                      ) : null
                    )}
                </div>

                <div className="input-parent-live">
                  <div className="input-container-live">
                    <input
                      className="input-live"
                      value={message}
                      placeholder="Enter a message here.."
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                      className="send-msg-live"
                      onClick={() => {
                        console.log("message clicked");
                        handleMessage();
                        setMessage("");
                      }}
                    >
                      <MessageSend />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
