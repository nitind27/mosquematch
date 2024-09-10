import { useEffect, useState } from "react";
import ImamNav from "./navImam";
import Awaiting from "./resultSections/awaiting";
import Verified from "./resultSections/verified";
import Denied from "./resultSections/denied";

import Locationicon from "../../../../../public/nav/locationSvg";

export default function ResultImam() {
  const [mosque, setMosque] = useState([]);
  const [mosqueName, setMosqueName] = useState([]);
  const [option, setOption] = useState("awaiting");
  //-------------------Api to get imam mosque------------------------

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
        setMosque(data);
        return data;
      } else {
        console.error("Error fetching data of user selected mosque:", data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    getUserData();
  }, []);

  //Get mosque name from array
  useEffect(() => {
    const names = mosque.map((data) => data.name);

    setMosqueName(names);
  }, [mosque]);

  //-------------------^^^^^^^^^^^^^^^^^^^^------------------

  return (
    <div>
      <ImamNav />

      <div className="imam-profiles-data">
        <div className="imam-profiles-head">
          <Locationicon />
          <span>WATFORD CENTRE MOSQUE</span>
        </div>
        <div className="verify-title-container-imamResult">
          <div
            className="verify-title-imamResult"
            style={{ color: option === "awaiting" ? "#b52d3b" : "" }}
            onClick={() => setOption("awaiting")}
          >
            REQUESTS
          </div>
          <div
            className="verify-title-imamResult"
            style={{ color: option === "verified" ? "#b52d3b" : "" }}
            onClick={() => setOption("verified")}
          >
            APPROVED
          </div>
          <div
            className="verify-title-imamResult"
            style={{ color: option === "denied" ? "#b52d3b" : "" }}
            onClick={() => setOption("denied")}
          >
            DENIED
          </div>
        </div>
        <div>{option === "awaiting" && <Awaiting />}</div>
        {option === "verified" && (
          <div>
            <Verified />
          </div>
        )}

        <div>
          {option === "denied" && (
            <div>
              <Denied />
            </div>
          )}
        </div>
      </div>

      {/* <div className="imam-profiles-data">
        <SearchUserData />

        {showFilters && (
          <div style={{ display: "none" }}>
            <Filters />
          </div>
        )}
      </div> */}
    </div>
  );
}
