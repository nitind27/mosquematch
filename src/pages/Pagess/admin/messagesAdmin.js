import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import AdminNav from "./adminNav";
import Image from "next/image";
import MessageSend from "../../../../public/sendMsgSvg";

export default function ImamMessages() {
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
  const [message, setMessage] = useState(""); //Message to send
  const [selectedUser, setSelectedUser] = useState(""); //Selected user to display messages
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [onlineStatus, setOnlineStatus] = useState("Offline");

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

      newSocket.on("getRecievedMessagesAdmin", (arr, email1) => {
        let em = localStorage.getItem("email");

        if (email1 === em) {
          setRecievedMessages(arr);
        }
      });

      newSocket.on("getSentMessagesAdmin", (arr, email2) => {
        let em = localStorage.getItem("email");
        console.log("email2", email2);
        if (email2 === em) {
          setSentMessages(arr);
        }
      });

      newSocket.on("refreshOther", (result, email) => {
        console.log("Email on refreshOther:", email);
        let tempE = localStorage.getItem("email");
        if (email === tempE) {
          console.log("Email found on refreshOther:", tempE);
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
    if (socket != null) {
      socket.emit("getRecievedMessagesAdmin", email);
      socket.emit("getSentMessagesAdmin", email);
      console.log("message sent to server");
    }
  }, [socket]);
  //--------------------^^^^^^^^^^--------------------

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
  }, [socket]);

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

  //-------Filtered array for left pane contact display------

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
  }, [filteredMessage]);

  //--------------------^^^^^^^^^^--------------------------

  //---------Fetch All User Data for a single user----------
  useEffect(() => {
    const fetchData = async () => {
      const email1 = localStorage.getItem("email");
      if (email1 === "" || !email1 || email1 === null) {
        return;
      }
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
  const selectUser = async (user) => {
    console.log("User selected", user);
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
          message.sender_email === emailFound ||
          (message.sender_email === tempEmail &&
            message.receiver_email === emailFound)
      )
      .sort(sortByTimestamp);
    console.log("filteredAndSortedMessages", filteredAndSortedMessages);
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
    socket.emit("getSentMessagesAdmin", emailCurrent);

    socket.emit("refreshOther", emailFound);
  };

  //--------------------^^^^^^^^^^--------------------

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
  }, [filteredAndSortedMessages]); // Add dependencies if needed

  return (
    <div>
      <div className="parent-live">
        <AdminNav />
        <div className="box-container-live">
          <div className="left-container-live">
            <div className="header-left0-live">
              <div className="header-left1-live">
                <Image
                  unoptimized
                  src="/female.jpeg"
                  alt="default"
                  layout="responsive"
                  width={100}
                  height={100}
                  className="profile-image-live"
                />
              </div>
              <div className="header-left1-holder">
                <div className="header-left1-heading">Personal Chats</div>
                <div className="name-left-live">For {username}</div>
              </div>
            </div>
            <div className="body-left-container-live">
              {/* Mapping username for left pane */}
              {uniqueUsers.map((user, index) => (
                <div
                  key={index}
                  className="container-user-live"
                  onClick={() => {
                    selectUser(user);
                  }}
                >
                  <div className="parent-select-user-live">
                    <div className="parent-select-user-sub-live">
                      <div className="profile-user-live">
                        <Image
                          unoptimized
                          src="/female.jpeg"
                          alt="default"
                          layout="responsive"
                          width={80}
                          height={80}
                          className="profile-image-live"
                        />
                      </div>
                      <div className="name-user-live">{user}</div>
                    </div>
                    {/* {<div className="user-timestamp">4:32 PM</div>} */}
                  </div>
                </div>
              ))}
              {/* Mapping username for left pane^^^^^^*/}
            </div>
          </div>
          {/* Show default screen if messages not open*/}
          {defaultScreen ? (
            <div className="default-container-live">
              <div>Messages Will Appear Here</div>
            </div>
          ) : (
            <div className="right-container-live">
              <div className="header-right0-live">
                <div className="header-right1-live">
                  <Image
                    unoptimized
                    src="/female.jpeg"
                    alt="default"
                    layout="responsive"
                    width={100}
                    height={100}
                    className="header-right0-image-live"
                  />
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
                </div>
                <div className="input-parent-live">
                  <div className="input-container-live">
                    <input
                      value={message}
                      className="input-live"
                      placeholder="Enter a message here.."
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <button
                      className="send-msg-live"
                      onClick={() => {
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
