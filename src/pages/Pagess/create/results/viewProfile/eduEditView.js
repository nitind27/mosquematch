import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function EduEditView({ data }) {
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
  useEffect(() => {
    if (data) {
      setEdulevel(data.eduwork_education);
      setSubject(data.eduwork_subject);
      setProfession(data.eduwork_profession);
      setJob(data.eduwork_job);
      setLanguage1(data.eduwork_language1);
      setLanguage2(data.eduwork_language2);
    } else {
      console.error("userInfo is not defined in query parameters");
    }
  }, []);
  return (
    <div style={{ paddingBottom: "40px" }}>
      <div>
        <div className="container-heading-aboutEdit">Education & Work</div>
        <div className="horizontal-seprator-edit"></div>
        <div className="location-aboutEdit">{t("eduWork.level")}</div>
        <div className="select-location-aboutEdit">
          <select disabled value={edulevel}>
            <option>{edulevel}</option>
          </select>
        </div>
      </div>
      <div className="select-conatiner-aboutEdit">
        <div className="location-aboutEdit">{t("eduWork.subject")}</div>
        <div className="input-container-aboutEdit">
          <input readOnly className="input-little-aboutEdit" value={subject} />
        </div>
      </div>
      <div className="select-conatiner-aboutEdit">
        <div className="location-aboutEdit">{t("eduWork.profession")}</div>
        <div className="select-location-aboutEdit">
          <select disabled value={profession} required>
            <option>{profession}</option>
          </select>
        </div>
      </div>

      <div className="select-conatiner-aboutEdit">
        <div className="location-aboutEdit">{t("eduWork.job")}</div>
        <div className="select-location-aboutEdit">
          <select disabled value={job} required>
            <option>{job}</option>
          </select>
        </div>
      </div>
      <div className="select-conatiner-aboutEdit">
        <div className="location-aboutEdit">{t("eduWork.language1")}</div>
        <div className="select-location-aboutEdit">
          <select disabled value={language1}>
            <option>{language1}</option>
          </select>
        </div>
      </div>
      <div className="select-conatiner-aboutEdit">
        <div className="location-aboutEdit">{t("eduWork.language2")}</div>
        <div className="select-location-aboutEdit">
          <select disabled value={language2}>
            <option>{language2}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
