import { useTranslation } from "react-i18next";
import SearchIcon from "../../../../../public/nav/searchsvg";
import MessageIcon from "../../../../../public/nav/messageIconsvg";
import HeartIcon from "../../../../../public/nav/hearticonSvg";
import { useState, useEffect, useRef } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import RedHeartIcon from "../../../../../public/nav/redHeart";
import RedMessageIcon from "../../../../../public/nav/redMsgs";
import RedSearchIcon from "../../../../../public/nav/redSearch";
import io from "socket.io-client";
import {
  ArrowDownRightSquare,
  ChevronDown,
  Heart,
  MessageCircle,
  Search,
  UserCircle,
} from "lucide-react";
import { color } from "@mui/system";

export default function ResultsNav() {
  const { data: session } = useSession();
  const [t, i18n] = useTranslation("global");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [logout, setLogout] = useState(false);
  const { push } = useRouter();
  const [counts, setCounts] = useState([]);
  const [msgCounts, setMsgCounts] = useState([]);
  const selectedRef = useRef("results");
  const socket = io(); // Initialize Socket.IO client
  const pathname = usePathname().split("/");
  selectedRef.current = pathname.length > 4 ? pathname[4] : "results";
  //------------------Retrieves data----------------
  useEffect(() => {
    const fetchData = async () => {
      if (
        localStorage.getItem("email") === null ||
        localStorage.getItem("email") === undefined ||
        localStorage.getItem("email") === "" ||
        localStorage.getItem("username") === null ||
        localStorage.getItem("username") === undefined ||
        localStorage.getItem("username") === ""
      ) {
        push("/Pagess/sign/signIn/signIn");
      }
      const email1 = localStorage.getItem("email");
      setEmail(email1);
      const user1 = localStorage.getItem("username");
      setUsername(user1);

      console.log("email found nav:", email);

      console.log("username", username);
    };
    fetchData();
  }, []);
  //------------------^^^^^^^^^^^^^^^----------------
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

  // count messages data
  useEffect(() => {
    // Fetch email from localStorage
    const userEmail = localStorage.getItem("email");
    setEmail(userEmail);

    async function fetchData() {
      try {
        const res = await fetch("/api/interest/viewMassageCount", {
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

  // Mock function to update user status - replace with actual API call
  const updateStatus = async (email, status) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate success
        resolve({ success: true, message: "User status updated successfully" });
      }, 1000); // Simulate 1 second delay
    });
  };
  //------------------Shift to messages----------------
  const shiftToMessages = () => {
    // push("/Pagess/create/results/messages/messages");
    push("/Pagess/create/results/messages/liveMessage");
  };

  const shiftToSearch = () => {
    localStorage.setItem("currentNavOption", "search");
    push("/Pagess/create/results/results");
  };

  const shiftToEditProfile = () => {
    push("/Pagess/create/results/profile/editProfile");
  };

  const shiftToInterest = () => {
    push("/Pagess/create/results/interest/interest");
  };

  //------------------^^^^^^^^^^^^^^^----------------

  //------------------Log out----------------
  const handleLogout = async (e) => {
    e.preventDefault();
    localStorage.removeItem("email");
    localStorage.removeItem("username");
    localStorage.removeItem("token");

    if (session) {
      await signOut("google");
    }
    socket.emit("logout", email);
    if (!session) {
      push("/Pagess/HomePage/home");
    }
  };

  //------------------^^^^^^^^^^^^^^^----------------
  const reloadPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };
  //------------------Change Nav Optio----------------
  const changeNavOption = (option) => {
    selectedRef.current = option;
  };

  //------------------^^^^^^^^^^^^^^^----------------

  return (
    <div style={{ zIndex: "1" }}>
      <div className="navbar-parent-container-navResult">
        <div className="navbar-logo-navResult">
          <span style={{ color: "#358fa1" }}>{t("nav.first")}</span>
          <span style={{ color: "#b52d3b" }}>{t("nav.second")}</span>
        </div>
        <div className="svg-container-navResult">
          <div
            className="search-navResult social-icon"
            onClick={() => {
              localStorage.setItem("turn", 1);

              shiftToSearch();
              changeNavOption("results");
            }}
          >
            {selectedRef.current === "results" ? (
              <>
                <Search stroke="#b52d3b" />
                <span style={{ color: "#b52d3b" }}>Search</span>
              </>
            ) : (
              <>
                <Search />
                search
              </>
            )}
          </div>
          <div
            className="message-navResult social-icon"
            onClick={() => {
              localStorage.setItem("turn", 0);

              shiftToMessages();
              changeNavOption("messages");
            }}
          >
            {selectedRef.current === "messages" ? (
              <>
                <MessageCircle stroke="#b52d3b" />

                <span style={{ color: "#b52d3b" }}>message</span>
              </>
            ) : (
              <>
                <MessageCircle />
                message
              </>
            )}
            {msgCounts.length == 0 ? "" : msgCounts.length}
          </div>

          <div
            className="message-navResult social-icon"
            onClick={() => {
              localStorage.setItem("turn", 0);
              shiftToInterest();
              changeNavOption("interest");
            }}
          >
            {selectedRef.current === "interest" ? (
              <>
                <Heart stroke="#b52d3b" />
                <span style={{ color: "#b52d3b" }}>interest</span>
              </>
            ) : (
              <>
                <Heart />
                interest
              </>
            )}
            {counts.length == 0 ? "" : counts.length}
          </div>
        </div>
        <div
          className={`account-navResult ${logout ? "active" : ""}`}
          onClick={() => setLogout(!logout)}
        >
          <span>
            <UserCircle />
            <p> Hello, {username}</p>
            <ChevronDown
              style={{
                transform: logout ? "rotate(180deg)" : "",
                transition: "all 0.5s",
              }}
            />
          </span>
        </div>
      </div>
      {logout && (
        <div className="logout-container-navResult">
          <div
            className="edit-profile-navResult drop-link"
            onClick={() => {
              localStorage.setItem("turn", 0);
              shiftToEditProfile();
              localStorage.setItem("currentNavOption", "editProfile");
            }}
          >
            Edit Profile
          </div>
          <div className="line-edit-navResult"></div>
          <button
            className="logout-btn-navResult drop-link"
            onClick={(e) => {
              handleLogout(e);
            }}
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
