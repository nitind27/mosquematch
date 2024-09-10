import { useEffect } from "react";
import NavMini from "./navMini";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { AppContext } from "../AppContext";
import { useState, useContext } from "react";
import { WhereLive, Countries, Dates, Months, Years } from "@/data/dataAcc";

export default function AboutMeSection() {
  const { aboutmeContext, setAboutmeContext } = useContext(AppContext);
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
  const [localData, setLocalData] = useState("");
  //-----------------^^^^^^^^^^----------------

  //----------Storing Places in state----------------
  const [arrPlaces, setArrPlaces] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);

    // Find the selected option in the arrPlaces array
    const selectedPlace = arrPlaces.find((place) => place.id === selectedValue);

    if (selectedPlace) {
      console.log("Selected place:", selectedPlace.name);
      setLocation(selectedPlace.name);
    } else {
      console.log("Selected place not found");
    }
  };

  //-----------------Updates the input suggestions----------------
  const handleInputChangePlaces = async (value) => {
    setInputValue(value);

    const res = await fetch("/api/getMosque/getPlaces", {
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
    setArrPlaces(response);
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
      if (localStorage.getItem("aboutMe") !== null) {
        let temp = localStorage.getItem("aboutMe");
        temp = JSON.parse(temp);
        setLocalData(temp);
      }
    }
  }, []);
  //------------------^^^^^^^^^^^^^^^----------------

  //------Updates State if local data is present-----------
  useEffect(() => {
    setLocation(localData.location);
    setCountry(localData.country);
    setDayDate(localData.day);
    setMonthDate(localData.month);
    setYearDate(localData.year);
    setTag(localData.tag);
    setAbout(localData.about);
    setLooking(localData.looking);
    console.log("localData: ", localData.tag);
  }, [localData]);

  //---------------^^^^^^^^^^^^^^^----------------
  //------------------Updates State----------------

  const handleSelectChange = (e, setFunction) => {
    setFunction(e.target.value);
    console.log("country:", country);
  };
  //------------------^^^^^^^^^^^^^^^----------------

  //------------------Updates Context and shifts page----------------

  const handleSubmit = (e) => {
    const aboutMeData = {
      //Add all data to this object
      location: location,
      country: country,
      day: dayDate,
      month: monthDate,
      year: yearDate,
      tag: tag,
      about: about,
      looking: looking,
    };
    setAboutmeContext(aboutMeData); //Updates context

    e.preventDefault();

    localStorage.setItem("aboutMe", JSON.stringify(aboutMeData)); //Stores data in local storage

    push("/Pagess/create/eduWork");
  };
  //------------------^^^^^^^^^^^^^^^---------------

  return (
    <form onSubmit={handleSubmit}>
      <NavMini />
      <div className="parent-aboutMe">
        <div className="heading-container-aboutMe">
          <div className="heading-aboutMe">{t("aboutMe.heading")}</div>
          <div
            className="skip-for-now-aboutMe"
            onClick={() => push("/Pagess/create/eduWork")}
          >
            Skip for now
          </div>
        </div>
        <div className="box-container-aboutMe">
          <div className="box-aboutMe">
            <div>
              <div className="location-aboutMe">{t("aboutMe.where")}</div>
              <div className="input-container-mosque">
                <input
                  className="input-little-mosque"
                  onChange={(e) => handleInputChangePlaces(e.target.value)}
                  required
                />
                {arrPlaces && arrPlaces.length > 0 && (
                  <div className="option-container-mosque">
                    {arrPlaces.map((mosque, index) => (
                      <div className="mini-option-mosque" key={index}>
                        <p>{mosque.name}</p>
                        <input
                          type="radio"
                          className="check-option-mosque"
                          value={mosque.id}
                          checked={selectedOption === mosque.id}
                          onChange={handleOptionChange}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="select-conatiner-aboutMe">
              <div className="location-aboutMe">{t("aboutMe.country")}</div>
              <div className="select-location-aboutMe">
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
              <div className="location-aboutMe">{t("aboutMe.date")}</div>
              <div className="select-date-aboutMe">
                <div className="option-date-aboutMe">
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
                <div className="option-date-aboutMe">
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
                <div className="option-date-aboutMe">
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
              <div className="location-aboutMe">{t("aboutMe.tag")}</div>
              <div className="input-container-aboutMe">
                <input
                  onChange={(e) => {
                    setTag(e.target.value);
                  }}
                  value={tag}
                  className="input-tag-aboutMe"
                  // required
                />
              </div>
            </div>
            <div className="select-conatiner-aboutMe">
              <div className="location-aboutMe">{t("aboutMe.about")}</div>
              <div className="input-container-aboutMe">
                <input
                  onChange={(e) => {
                    setAbout(e.target.value);
                  }}
                  value={about}
                  className="input-little-aboutMe"
                  // required
                />
              </div>
            </div>
            <div className="select-conatiner-aboutMe">
              <div className="location-aboutMe">{t("aboutMe.what")}</div>
              <div className="input-container-aboutMe">
                <input
                  onChange={(e) => {
                    setLooking(e.target.value);
                  }}
                  value={looking}
                  className="input-little-aboutMe"
                  // required
                />
              </div>
            </div>
            <div className="button-container-aboutMe">
              <button type="submit" className="button-aboutMe">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
