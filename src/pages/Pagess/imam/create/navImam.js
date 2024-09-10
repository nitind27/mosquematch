import { useTranslation } from "react-i18next";
import SearchIcon from "../../../../../public/nav/searchsvg";
import MessageIcon from "../../../../../public/nav/messageIconsvg";
import HeartIcon from "../../../../../public/nav/hearticonSvg";
import { useState, useEffect } from "react";
import { signIn, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function ImamNav() {
  const { data: session } = useSession();
  const [t, i18n] = useTranslation("global");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [logout, setLogout] = useState(false);
  const { push } = useRouter();
  const [msgCounts, setMsgCounts] = useState([]);
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
    };
    fetchData();
  }, []);
  //------------------^^^^^^^^^^^^^^^----------------

  //------------------Shift to messages----------------
  const shiftToMessages = () => {
    push("/Pagess/imam/create/message/imamMessage");
  };

  const shiftToSearch = () => {
    push("/Pagess/imam/create/imamResult");
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
    if (!session) {
      push("/Pagess/HomePage/home");
    }
  };
  //das

  //------------------^^^^^^^^^^^^^^^----------------

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

  return (
    <div style={{ zIndex: "1" }}>
      <div className="navbar-parent-container-navResult">
        <div
          className="navbar-logo-navResult"
         
        >
          <span style={{ color: "#358fa1" }}>{t("nav.first")}</span>
          <span style={{ color: "#b52d3b" }}>{t("nav.second")}</span>
        </div>
        <div className="svg-container-navResult">
          <div className="search-navResult"></div>
          <div className="imamsquare">
            <div className="message-navResult" onClick={shiftToMessages}>
              <MessageIcon />
            </div>
            <span className="imamcount">
              {msgCounts.length == 0 ? "" : msgCounts.length}
            </span>
          </div>
        </div>
        <div className="account-navResult" onClick={() => setLogout(!logout)}>
          {username}
        </div>
      </div>
      {logout && (
        <div className="logout-container-navResult">
          <button
            className="logout-btn-navResult"
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
