import { useRouter } from "next/navigation";
import NavMini from "./navMini";
import { useTranslation } from "react-i18next";
import { AppContext } from "../AppContext";
import { useState, useContext, useEffect } from "react";
import { Education, Profession, JobTitle, Languages } from "@/data/dataAcc";

export default function Educwork() {
  const [t, i18n] = useTranslation("global");
  const { eduworkContext, setEduworkContext } = useContext(AppContext);
  const { push } = useRouter();

  //----------Storing input data in state----------------
  const [edulevel, setEdulevel] = useState("");
  const [subject, setSubject] = useState("");
  const [profession, setProfession] = useState("");
  const [job, setJob] = useState("");
  const [language1, setLanguage1] = useState("");
  const [language2, setLanguage2] = useState("");
  const [localData, setLocalData] = useState("");
  //-----------------^^^^^^^^^^--------------------------

  //------------------Checks for token----------------
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token === null && !token) {
      console.log("token not found");
      push("/Pagess/sign/signIn/signIn");
    } else {
      if (localStorage.getItem("eduWork") !== null) {
        let temp = localStorage.getItem("eduWork");
        temp = JSON.parse(temp);
        setLocalData(temp);
      }
      console.log("Token found!");
    }
  }, []);
  //------------------^^^^^^^^^^^^^^^----------------

  //------Updates State if local data is present-----------
  useEffect(() => {
    setEdulevel(localData.education);
    setSubject(localData.subject);
    setProfession(localData.profession);
    setJob(localData.job);
    setLanguage1(localData.language1);
    setLanguage2(localData.language2);
    console.log("localData: ", localData);
  }, [localData]);

  //---------------^^^^^^^^^^^^^^^----------------

  //------------------Updates State----------------

  const handleSelectChange = (e, setFunction) => {
    setFunction(e.target.value);
  };
  //------------------^^^^^^^^^^^^^^^----------------

  //------------------Updates Context and shifts page----------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const eduWorkData = {
      //Add all data to this object
      education: edulevel,
      subject: subject,
      profession: profession,
      job: job,
      language1: language1,
      language2: language2,
    };

    setEduworkContext(eduWorkData); //Updates context

    localStorage.setItem("eduWork", JSON.stringify(eduWorkData)); //Stores data in local storage
    push("/Pagess/create/personal");
  };
  //------------------^^^^^^^^^^^^^^^----------------

  return (
    <form onSubmit={handleSubmit}>
      <NavMini />
      <div className="parent-eduwork">
        <div className="heading-container-eduwork">
          <div className="heading-eduwork">{t("eduWork.heading")}</div>
          <div
            className="skip-for-now-aboutMe"
            onClick={() => push("/Pagess/create/personal")}
          >
            Skip for now
          </div>
        </div>
        <div className="box-container-eduwork">
          <div className="box-eduwork">
            <div>
              <div className="location-eduwork">{t("eduWork.level")}</div>
              <div className="select-location-eduwork">
                <select
                  value={edulevel}
                  onChange={(e) => handleSelectChange(e, setEdulevel)}
                  required
                >
                  <option></option>
                  {Education.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="select-conatiner-eduwork">
              <div className="location-eduwork">{t("eduWork.subject")}</div>
              <div className="input-container-eduwork">
                <input
                  onChange={(e) => {
                    setSubject(e.target.value);
                  }}
                  value={subject}
                  className="input-little-eduwork"
                  required
                />
              </div>
            </div>
            <div className="select-conatiner-eduwork">
              <div className="location-eduwork">{t("eduWork.profession")}</div>
              <div className="select-location-eduwork">
                <select
                  value={profession}
                  onChange={(e) => handleSelectChange(e, setProfession)}
                  required
                >
                  <option></option>
                  {Profession.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="select-conatiner-eduwork">
              <div className="location-eduwork">{t("eduWork.job")}</div>
              <div className="select-location-eduwork">
                <select
                  value={job}
                  onChange={(e) => handleSelectChange(e, setJob)}
                  required
                >
                  <option></option>
                  {JobTitle.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="select-conatiner-eduwork">
              <div className="location-eduwork">{t("eduWork.language1")}</div>
              <div className="select-location-eduwork">
                <select
                  value={language1}
                  onChange={(e) => handleSelectChange(e, setLanguage1)}
                  required
                >
                  <option></option>
                  {Languages.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="select-conatiner-eduwork">
              <div className="location-eduwork">{t("eduWork.language2")}</div>
              <div className="select-location-eduwork">
                <select
                  value={language2}
                  onChange={(e) => handleSelectChange(e, setLanguage2)}
                  required
                >
                  <option></option>
                  {Languages.map((city) => (
                    <option key={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="button-container-eduwork">
              <button type="submit" className="button-eduwork">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
