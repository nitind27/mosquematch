import { React, useState } from "react";
import AdminNav from "./adminNav";

import Filters from "../create/results/filters";
import SearchUserData from "./create/searchuserdata";
import BlockedUser from "./create/blockedUser";

const AdminResult = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [option, setOption] = useState("request");
  return (
    <div>
      <AdminNav />

      <div className="admin-profiles-data">
        <div className="verify-title-container-adminResult">
          <div
            className="verify-title-adminResult"
            style={{ color: option === "request" ? "#b52d3b" : "" }}
            onClick={() => setOption("request")}
          >
            REQUESTS
          </div>
          <div
            className="verify-title-adminResult"
            style={{ color: option === "blocked" ? "#b52d3b" : "" }}
            onClick={() => setOption("blocked")}
          >
            BLOCKED
          </div>
          <div></div>
        </div>
        <div className="full-width-border"></div>

        {option === "request" && <SearchUserData />}
        {option === "blocked" && <BlockedUser />}
        {showFilters && (
          <div style={{ display: "none" }}>
            <Filters />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminResult;
