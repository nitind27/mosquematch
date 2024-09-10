import Image from "next/image";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { WhereLive, Countries, Dates, Months, Years } from "@/data/dataAcc";

export default function AboutEdit() {
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

  //-------------Api to update data------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email1 = localStorage.getItem("email");
    console.log("location:", location);
    if (
      !location ||
      !country ||
      !dayDate ||
      !monthDate ||
      !yearDate ||
      !tag ||
      !about ||
      !looking ||
      location === "" ||
      country === "" ||
      dayDate === "" ||
      monthDate === "" ||
      yearDate === "" ||
      tag === "" ||
      about === "" ||
      looking === ""
    ) {
      alert("Please fill all the fields");
      return;
    }

    const allData = {
      location: location,
      country: country,
      day: dayDate,
      month: monthDate,
      year: yearDate,
      tag: tag,
      about: about,
      looking: looking,
    };

    try {
      const res = await fetch("/api/update/about", {
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
        alert("About Info updated successfully");
      }
    } catch (error) {
      console.log(
        "Error on handleSubmit aboutEdit.js in profile:",
        error.message
      );
    }
  };

  //-------------^^^^^^^^^^^^^^^^^^^^------------------

  //------------------Updates State----------------

  const handleSelectChange = (e, setFunction) => {
    setFunction(e.target.value);
  };

  //------------------^^^^^^^^^^^^^^^----------------

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
        setLocation(userData.aboutme_location);
        setCountry(userData.aboutme_country);
        setDayDate(userData.aboutme_day);
        setMonthDate(userData.aboutme_month);
        setYearDate(userData.aboutme_year);
        setTag(userData.aboutme_tag);
        setAbout(userData.aboutme_about);
        setLooking(userData.aboutme_looking);
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
      <div className="container-heading-aboutEdit">About Me</div>
      <div className="horizontal-seprator-edit"></div>
      <div>
        <div className="location-aboutEdit">{t("aboutMe.where")}</div>
        <div className="select-location-aboutEdit">
          <select
            value={location}
            onChange={(e) => handleSelectChange(e, setLocation)}
            required
          >
            <option></option>
            {WhereLive.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="select-conatiner-aboutMe">
        <div className="location-aboutEdit">{t("aboutMe.country")}</div>
        <div className="select-location-aboutEdit">
          <select
            value={country}
            onChange={(e) => handleSelectChange(e, setCountry)}
            required
          >
            <option></option>
            {Countries.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="select-conatiner-aboutMe">
        <div className="location-aboutEdit">{t("aboutMe.date")}</div>
        <div className="select-date-aboutEdit">
          <div className="option-date-aboutEdit">
            <select
              value={dayDate}
              onChange={(e) => handleSelectChange(e, setDayDate)}
              required
            >
              <option></option>
              {Dates.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="option-date-aboutEdit">
            <select
              value={monthDate}
              onChange={(e) => handleSelectChange(e, setMonthDate)}
              required
            >
              <option></option>
              {Months.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>
          <div className="option-date-aboutEdit">
            <select
              value={yearDate}
              onChange={(e) => handleSelectChange(e, setYearDate)}
              required
            >
              <option></option>
              {Years.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="select-conatiner-aboutMe">
        <div className="location-aboutEdit">{t("aboutMe.tag")}</div>
        <div className="input-container-aboutEdit">
          <input
            onChange={(e) => {
              setTag(e.target.value);
            }}
            className="input-tag-aboutMe"
            value={tag}
            required
          />
        </div>
      </div>
      <div className="select-conatiner-aboutMe">
        <div className="location-aboutEdit">{t("aboutMe.about")}</div>
        <div className="input-container-aboutEdit">
          <input
            onChange={(e) => {
              setAbout(e.target.value);
            }}
            value={about}
            className="input-little-aboutMe"
            required
          />
        </div>
      </div>
      <div className="select-conatiner-aboutMe">
        <div className="location-aboutEdit">{t("aboutMe.what")}</div>
        <div className="input-container-aboutEdit">
          <input
            onChange={(e) => {
              setLooking(e.target.value);
            }}
            value={looking}
            className="input-little-aboutMe"
            required
          />
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
