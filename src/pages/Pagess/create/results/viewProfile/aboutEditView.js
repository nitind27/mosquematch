import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";

export default function AboutEditView({ data }) {
  const [t, i18n] = useTranslation("global");
  const { push } = useRouter();
  //----------Storing input data in state----------------
  const [location, setLocation] = useState("");
  const [country, setCountry] = useState("");
  const [dayDate, setDayDate] = useState("");
  const [monthDate, setMonthDate] = useState("");
  const [yearDate, setYearDate] = useState("");
  const [tag, setTag] = useState("");
  const [about, setAbout] = useState("");
  const [looking, setLooking] = useState("");
  //-----------------^^^^^^^^^^----------------

  useEffect(() => {
    if (data) {
      setLocation(data.aboutme_location);
      setCountry(data.aboutme_country);
      setDayDate(data.aboutme_day);
      setMonthDate(data.aboutme_month);
      setYearDate(data.aboutme_year);
      setTag(data.aboutme_tag);
      setAbout(data.aboutme_about);
      setLooking(data.aboutme_looking);
    } else {
      console.error("userInfo is not defined in query parameters");
    }
  }, []);

  return (
    <div style={{ paddingBottom: "40px" }}>
      <div className="container-heading-aboutEdit">About Me</div>
      <div className="horizontal-seprator-edit"></div>
      <div>
        <div className="location-aboutEdit">Where do I live</div>
        <div className="select-location-aboutEdit">
          <select style={{ cursor: "default" }} disabled value={location}>
            <option>{location}</option>
          </select>
        </div>
      </div>
      <div className="select-conatiner-aboutMe">
        <div className="location-aboutEdit">{t("aboutMe.country")}</div>
        <div className="select-location-aboutEdit">
          <select style={{ cursor: "default" }} disabled value={country}>
            <option>{country}</option>
          </select>
        </div>
      </div>
      <div className="select-conatiner-aboutMe">
        <div className="location-aboutEdit">{t("aboutMe.date")}</div>
        <div className="select-date-aboutEdit">
          <div className="option-date-aboutEdit">
            <select style={{ cursor: "default" }} disabled value={dayDate}>
              <option>{dayDate}</option>
            </select>
          </div>
          <div className="option-date-aboutEdit">
            <select style={{ cursor: "default" }} disabled value={monthDate}>
              <option>{monthDate}</option>
            </select>
          </div>
          <div className="option-date-aboutEdit">
            <select style={{ cursor: "default" }} disabled value={yearDate}>
              <option>{yearDate}</option>
            </select>
          </div>
        </div>
      </div>
      <div className="select-conatiner-aboutMe">
        <div className="location-aboutEdit">{t("aboutMe.tag")}</div>
        <div className="input-container-aboutEdit">
          <input readOnly className="input-tag-aboutMe" value={tag} />
        </div>
      </div>
      <div className="select-conatiner-aboutMe">
        <div className="location-aboutEdit">{t("aboutMe.about")}</div>
        <div className="input-container-aboutEdit">
          <input readOnly value={about} className="input-little-aboutMe" />
        </div>
      </div>
      <div className="select-conatiner-aboutMe">
        <div className="location-aboutEdit">{t("aboutMe.what")}</div>
        <div className="input-container-aboutEdit">
          <input readOnly value={looking} className="input-little-aboutMe" />
        </div>
      </div>
    </div>
  );
}
