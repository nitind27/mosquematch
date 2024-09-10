import { useRouter } from "next/navigation";
import NavMini from "./navMini";
import { useTranslation } from "react-i18next";
import { AppContext } from "../AppContext";
import { useState, useContext, useEffect } from "react";

export default function Religon() {
  const [t, i18n] = useTranslation("global");
  const { religonContext, setReligonContext } = useContext(AppContext);
  const { genderContext, setGenderContext } = useContext(AppContext);
  const { push } = useRouter();

  //----------Storing input data in state----------------
  const [religious, setReligious] = useState("");
  const [sector, setSector] = useState("");
  const [hijab, setHijab] = useState("");
  const [beard, setBeard] = useState("");
  const [revert, setRevert] = useState("");
  const [halal, setHalal] = useState("");
  const [pray, setPray] = useState("");
  const [quran, setQuran] = useState("");
  const [localData, setLocalData] = useState("");
  //-----------------^^^^^^^^^^--------------------------

  //------------------Checks for token----------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token === null && !token) {
      console.log("token not found");
      push("/Pagess/sign/signIn/signIn");
    } else {
      if (localStorage.getItem("religon") !== null) {
        let temp = localStorage.getItem("religon");
        temp = JSON.parse(temp);
        setLocalData(temp);
      }
      console.log("Token found!");
    }
  }, []);
  //------------------^^^^^^^^^^^^^^^----------------

  //------Updates State if local data is present-----------
  useEffect(() => {
    setReligious(localData.religious);
    setSector(localData.sector);
    setHijab(localData.hijab);
    setBeard(localData.beard);
    setRevert(localData.revert);
    setHalal(localData.halal);
    setPray(localData.pray);
    setQuran(localData.quran);

    console.log("localData: ", localData);
  }, [localData]);

  //---------------^^^^^^^^^^^^^^^----------------

  //------------------Updates State----------------

  const handleSelectChange = (e, setFunction) => {
    setFunction(e.target.value);
    console.log("about:", religious);
  };
  //------------------^^^^^^^^^^^^^^^----------------

  const handleSubmit = (e) => {
    e.preventDefault();

    const religonData = {
      //Add all data to this object
      religious: religious,
      sector: sector,
      hijab: hijab,
      beard: beard,
      revert: revert,
      halal: halal,
      pray: pray,
      quran: quran,
    };

    setReligonContext(religonData); //Updates context

    localStorage.setItem("religon", JSON.stringify(religonData)); //Stores data in local storage

    push("/Pagess/create/image");
  };
  return (
    <form onSubmit={handleSubmit}>
      <NavMini />
      <div className="parent-religon">
        <div className="heading-container-religon">
          <div className="heading-religon">{t("religon.heading")}</div>
          <div
            className="skip-for-now-aboutMe"
            onClick={() => push("/Pagess/create/image")}
          >
            Skip for now
          </div>
        </div>
        <div className="box-container-religon">
          <div className="box-religon">
            <div>
              <div className="location-religon">{t("religon.religious")}</div>
              <div className="select-location-religon">
                <select
                  value={religious}
                  onChange={(e) => handleSelectChange(e, setReligious)}
                  required
                >
                  <option></option>
                  <option>Very Religious</option>
                  <option>Religious</option>
                  <option>Somewhat Religious</option>
                  <option>Not Religious</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>
            <div className="select-conatiner-religon">
              <div className="location-religon">{t("religon.sector")}</div>
              <div className="select-location-religon">
                <select
                  value={sector}
                  onChange={(e) => handleSelectChange(e, setSector)}
                  required
                >
                  <option></option>
                  <option>Just Muslim</option>
                  <option>Sunni</option>
                  <option>Shia</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            {genderContext === "male" && (
              <div className="select-conatiner-religon">
                <div className="location-religon">{t("religon.prefer")}</div>
                <div className="select-location-religon">
                  <select
                    value={hijab}
                    onChange={(e) => handleSelectChange(e, setHijab)}
                    required
                  >
                    <option></option>
                    <option>Yes Hijab</option>
                    <option>Yes Niqab</option>
                    <option>No</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            )}
            {genderContext === "female" && (
              <div className="select-conatiner-religon">
                <div className="location-religon">{t("religon.beard")}</div>
                <div className="select-location-religon">
                  <select
                    value={beard}
                    onChange={(e) => handleSelectChange(e, setBeard)}
                    required
                  >
                    <option></option>
                    <option>Beard, Yes</option>
                    <option>Beard, No</option>
                  </select>
                </div>
              </div>
            )}

            <div className="select-conatiner-religon">
              <div className="location-religon">{t("religon.revert")}</div>
              <div className="select-location-religon">
                <select
                  value={revert}
                  onChange={(e) => handleSelectChange(e, setRevert)}
                  required
                >
                  <option></option>
                  <option>Yes</option>
                  <option>No</option>
                </select>
              </div>
            </div>

            <div className="select-conatiner-religon">
              <div className="location-religon">{t("religon.halal")}</div>
              <div className="select-location-religon">
                <select
                  value={halal}
                  onChange={(e) => handleSelectChange(e, setHalal)}
                  required
                >
                  <option></option>
                  <option>Always Keep Halal</option>
                  <option>Usually Keep Halal</option>
                  <option>I Keep Halal At Home</option>
                  <option>Don't Keep Halal</option>
                </select>
              </div>
            </div>
            <div className="select-conatiner-religon">
              <div className="location-religon">{t("religon.pray")}</div>
              <div className="select-location-religon">
                <select
                  value={pray}
                  onChange={(e) => handleSelectChange(e, setPray)}
                  required
                >
                  <option></option>
                  <option>Always</option>
                  <option>Usually</option>
                  <option>Sometimes</option>
                  <option>Never</option>
                </select>
              </div>
            </div>
            <div className="select-conatiner-religon">
              <div className="location-religon">{t("religon.quran")}</div>
              <div className="select-location-religon">
                <select
                  value={quran}
                  onChange={(e) => handleSelectChange(e, setQuran)}
                  required
                >
                  <option></option>
                  <option>Always</option>
                  <option>Usually</option>
                  <option>Sometimes</option>
                  <option>Never</option>
                </select>
              </div>
            </div>
            <div className="button-container-religon">
              <button type="submit" className="button-religon">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
