import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import NavMini from "../../create/navMini";
import { useTranslation } from "react-i18next";
import { AppContext } from "../../AppContext";
import { use } from "i18next";

import Select from "react-select";

export default function Mosque() {
  const [t, i18n] = useTranslation("global");
  const { push } = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [arrMosque, setArrMosque] = useState([]);

  //-----------------Data to send to database----------------

  const { mosqueContext, setMosqueContext } = useContext(AppContext);

  //-----------------Updates the input suggestions----------------
  const handleInputChange = async (value) => {
    setInputValue(value);

    const res = await fetch("/api/getMosque/getNames", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: value }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
    setArrMosque(response);
  };
  //------------------^^^^^^^^^^^^^^^----------------

  //------------------Checks for token----------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token === null && !token) {
      console.log("token not found");
      push("/Pagess/sign/signIn/signIn");
    } else {
      console.log("Token found!");
    }
  }, []);
  //------------------^^^^^^^^^^^^^^^----------------

  //------------------Updates data and shifts to next page----------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");
    if (email === null || !email) {
      console.log("email not found");
      return;
    }
    console.log("email found:", email);

    const dataToSend = {
      email,
      mosque: mosqueContext,
    };

    const res = await fetch("/api/imam/mosque", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSend),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
    const username = response.username;
    console.log("username", username);

    push("/Pagess/imam/create/imamResult");
  };
  //------------------^^^^^^^^^^^^^^^----------------

  const handleCheckboxChange = (mosque) => {
    const { id, name } = mosque;

    // Check if the mosqueName is already in the array
    const isSelected = mosqueContext.some((item) => item.id === id);

    if (isSelected) {
      // If already selected, remove it
      setMosqueContext((prev) => prev.filter((item) => item.id !== id));
    } else {
      // If not selected, add it
      setMosqueContext((prev) => [...prev, { id, name }]);
    }
    console.log("mosqueContext: ", mosqueContext);
  };
  return (
    <form onSubmit={handleSubmit}>
      <NavMini />
      <div className="parent-mosque">
        <div className="heading-container-mosque">
          <div className="heading-mosque">Link To A Mosque</div>
        </div>
        <div className="box-container-mosque">
          <div className="box-mosque">
            <div className="select-conatiner-mosque">
              <div className="input-container-mosque">
                <input
                  className="input-little-mosque"
                  onChange={(e) => handleInputChange(e.target.value)}
                />
                {arrMosque && arrMosque.length > 0 && (
                  <div className="option-container-mosque">
                    {arrMosque.map((mosque, index) => (
                      <div className="mini-option-mosque">
                        <p key={index}>{mosque.name} </p>
                        <input
                          type="checkbox"
                          className="check-option-mosque"
                          onChange={() => handleCheckboxChange(mosque)}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="button-container-mosque">
              <button type="submit" className="button-mosque">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
