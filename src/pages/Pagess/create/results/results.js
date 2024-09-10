import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../AppContext";
import ResultNav from "./navResult";
import Filters from "./filters";
import Search from "./search";
import { useRouter } from "next/navigation";
import MenuIcon from "../../../../../public/search/menuIconSvg";

export default function Results() {
  const { push } = useRouter();
  //-------------If screen is mobile--------------
  const [screenMobile, setScreenMobile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  //------------------Checks for token----------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token === null) {
      console.log("token not found");
      push("/Pagess/sign/signIn/signIn");
    } else {
      console.log("Token found!");
    }
  }, []);
  //------------------^^^^^^^^^^^^^^^----------------

  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 764) {
        setScreenMobile(true);
      } else {
        setScreenMobile(false);
        setShowMenu(false);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //---------------^^^^^^^^^^^^^^^----------------

  // Update the function to accept a mosque name

  return (
    <form>
      <div className="parent-result">
        <ResultNav />
        <div className="box-parent-result">
          <div className="filters-parent-container-result">
            {screenMobile ? (
              <div className="menu-icon-parent-result">
                <div
                  onClick={() => {
                    setShowMenu(!showMenu);
                  }}
                  className="menu-icon-parent-result"
                >
                  <MenuIcon />
                </div>

                {showMenu && (
                  <div className="second-parent-filter-result">
                    <Filters />
                  </div>
                )}
              </div>
            ) : (
              <div>
                <Filters />
              </div>
            )}
          </div>
          <div className="search-parent-result">
            {/* Pass the selected mosque name to the function */}
            <Search />
          </div>
        </div>
      </div>
    </form>
  );
}
