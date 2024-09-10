import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Education, Profession, JobTitle, Languages } from "@/data/dataAcc";

export default function EduEdit() {
  const { push } = useRouter();
  const [t, i18n] = useTranslation("global");

  //----------Storing input data in state----------------
  const [edulevel, setEdulevel] = useState("");
  const [subject, setSubject] = useState("");
  const [profession, setProfession] = useState("");
  const [job, setJob] = useState("");
  const [language1, setLanguage1] = useState("");
  const [language2, setLanguage2] = useState("");
  //-----------------^^^^^^^^^^--------------------------

  //------------------Updates State----------------

  const handleSelectChange = (e, setFunction) => {
    setFunction(e.target.value);
  };
  useEffect(() => {
    console.log("location:", edulevel);
  }, [edulevel]);
  //------------------^^^^^^^^^^^^^^^----------------

  //-------------Api to update data------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email1 = localStorage.getItem("email");
    if (
      !edulevel ||
      !subject ||
      !profession ||
      !job ||
      !language1 ||
      !language2 ||
      edulevel === "" ||
      subject === "" ||
      profession === "" ||
      job === "" ||
      language1 === "" ||
      language2 === ""
    ) {
      alert("Please fill all the fields");
      return;
    }

    const allData = {
      edulevel: edulevel,
      subject: subject,
      profession: profession,
      job: job,
      language1: language1,
      language2: language2,
    };
    try {
      const res = await fetch("/api/update/eduwork", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email1, data: allData }),
      });
      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error if:", errorMessage.error);
        return;
      }
      const response = await res.json();
      if (response.message === "success") {
        alert("Data updated successfully");
      }
    } catch (error) {
      console.log(
        "Error on handleSubmit eduEdit.js in profile:",
        error.message
      );
    }
  };

  //-------------^^^^^^^^^^^^^^^^^^^^-----------------
  //---------------Get user data from api--------------
  useEffect(() => {
    const email = localStorage.getItem("email");
    const fetchData = async () => {
      try {
        const res = await fetch("/api/message/getSingleUser", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(email),
        });
        if (!res.ok) {
          const errorMessage = await res.json();
          console.error("Error if:", errorMessage.error);
          return;
        }
        const response = await res.json();
        const userData = response.user.rows[0];
        setEdulevel(userData.eduwork_education);
        setSubject(userData.eduwork_subject);
        setProfession(userData.eduwork_profession);
        setJob(userData.eduwork_job);
        setLanguage1(userData.eduwork_language1);
        setLanguage2(userData.eduwork_language2);
      } catch (error) {
        console.log(
          "Error on useEffect aboutEdit.js in profile:",
          error.message
        );
      }
    };
    fetchData();
  }, []);
  return (
    <div style={{ paddingBottom: "40px" }}>
      <div>
        <div className="container-heading-aboutEdit">Education & Work</div>
        <div className="horizontal-seprator-edit"></div>
        <div className="location-aboutEdit">{t("eduWork.level")}</div>
        <div className="select-location-aboutEdit">
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
      <div className="select-conatiner-aboutEdit">
        <div className="location-aboutEdit">{t("eduWork.subject")}</div>
        <div className="input-container-aboutEdit">
          <input
            onChange={(e) => {
              setSubject(e.target.value);
            }}
            className="input-little-aboutEdit"
            required
            value={subject}
          />
        </div>
      </div>
      <div className="select-conatiner-aboutEdit">
        <div className="location-aboutEdit">{t("eduWork.profession")}</div>
        <div className="select-location-aboutEdit">
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

      <div className="select-conatiner-aboutEdit">
        <div className="location-aboutEdit">{t("eduWork.job")}</div>
        <div className="select-location-aboutEdit">
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
      <div className="select-conatiner-aboutEdit">
        <div className="location-aboutEdit">{t("eduWork.language1")}</div>
        <div className="select-location-aboutEdit">
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
      <div className="select-conatiner-aboutEdit">
        <div className="location-aboutEdit">{t("eduWork.language2")}</div>
        <div className="select-location-aboutEdit">
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
      <button
        className="save-aboutEdit"
        onClick={(e) => {
          handleSubmit(e);
        }}
      >
        Save Changes
      </button>
    </div>
  );
}
