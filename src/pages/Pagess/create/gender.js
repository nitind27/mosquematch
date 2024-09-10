import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AppContext } from "../AppContext";
import { useState, useContext } from "react";
import NavMini from "./navMini";

export default function Gender() {
  const [selectedOption, setSelectedOption] = useState(null); // Used for styling the selected option
  const { genderContext, setGenderContext } = useContext(AppContext);

  const handleOptionClick = (option) => {
    //To change the style of the selected option
    setSelectedOption(option);
  };

  const [t, i18n] = useTranslation("global"); //Translation

  const { push } = useRouter();

  //-------------Checks for token----------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token === null && !token) {
      console.log("token not found");
      push("/Pagess/sign/signIn/signIn");
    } else {
      console.log("Token found!");
    }
  }, []);
  //-------------^^^^^^^^^^^^^^^-----------------

  //-------------Upload and Update Data and shift----------------
  const handleSubmit = (e) => {
    e.preventDefault();

    if (selectedOption === null) {
      return;
    }
    setGenderContext(selectedOption);

    localStorage.setItem("gender", selectedOption);
    console.log("Selected option: ", genderContext);
    push("/Pagess/create/aboutMe");
  };
  //-------------^^^^^^^^^^^^^^^-----------------

  return (
    <form onSubmit={handleSubmit}>
      <NavMini />
      <div className="parent-gender">
        <div className="heading-container-gender">
          <div className="heading-gender">{t("gender.heading")}</div>
        </div>
        <div className="box-gender">
          <div className="iAm-container-gender">
            <div>{t("gender.iAm")}...</div>
          </div>
          <div className="option-container-gender">
            <div
              className={`male-option-gender ${
                selectedOption === "male" ? "gender-option selected" : ""
              }`}
              onClick={() => handleOptionClick("male")}
            >
              <div className="male-text-gender">{t("gender.male")}</div>
            </div>
            <div
              className={`female-option-gender ${
                selectedOption === "female" ? "gender-option selected" : ""
              }`}
              onClick={() => handleOptionClick("female")}
            >
              <div className="female-text-gender">{t("gender.female")}</div>
            </div>
          </div>
          <div className="button-container-gender">
            <button type="submit" className="button-gender">
              Next
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}


