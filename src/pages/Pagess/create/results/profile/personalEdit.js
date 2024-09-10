import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Countries, Height, Ethnicity } from "@/data/dataAcc";

export default function PersonalEdit() {
  const { push } = useRouter();
  const [t, i18n] = useTranslation("global");

  //----------Storing input data in state----------------
  const [citizen, setCitizen] = useState("");
  const [origin, setOrigin] = useState("");
  const [relocate, setRelocate] = useState("");
  const [income, setIncome] = useState("");
  const [marriage, setMarriage] = useState("");
  const [marital, setMarital] = useState("");
  const [children1, setChildren1] = useState("");
  const [children2, setChildren2] = useState("");
  const [living, setLiving] = useState("");
  const [height, setHeight] = useState("");
  const [build, setBuild] = useState("");
  const [smoke, setSmoke] = useState("");
  const [drink, setDrink] = useState("");
  const [disability, setDisability] = useState("");
  const [long, setLong] = useState("");
  const [ethniciting, setEthniciting] = useState("");

  //-----------^^^^^^^^^^^^^^^^^^^^^^^----------------

  //------------------Updates State----------------

  const handleSelectChange = (e, setFunction) => {
    setFunction(e.target.value);
  };
  //------------------^^^^^^^^^^^^^^^----------------

  //-------------Api to update data------------------

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email1 = localStorage.getItem("email");
    if (
      !citizen ||
      !origin ||
      !relocate ||
      !income ||
      !marriage ||
      !marital ||
      !children1 ||
      !children2 ||
      !living ||
      !height ||
      !build ||
      !smoke ||
      !drink ||
      !disability ||
      !long ||
      !ethniciting
    ) {
      alert("Please fill all the fields");
      return;
    }

    const allData = {
      //Add data
      citizen: citizen,
      origin: origin,
      relocate: relocate,
      income: income,
      marriage: marriage,
      marital: marital,
      children1: children1,
      children2: children2,
      living: living,
      height: height,
      build: build,
      smoke: smoke,
      drink: drink,
      disability: disability,
      long: long,
      ethnicity: ethniciting,
    };
    try {
      const res = await fetch("/api/update/personal", {
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

  //-------------^^^^^^^^^^^^^^^^^^^^------------------

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
        setCitizen(userData.personal_citizen);
        setOrigin(userData.personal_origin);
        setRelocate(userData.personal_relocate);
        setIncome(userData.personal_income);
        setMarriage(userData.personal_marriage);
        setMarital(userData.personal_marital);
        setChildren1(userData.personal_children1);
        setChildren2(userData.personal_children2);
        setLiving(userData.personal_living);
        setHeight(userData.personal_height);
        setBuild(userData.personal_build);
        setSmoke(userData.personal_smoke);
        setDrink(userData.personal_drink);
        setDisability(userData.personal_disability);
        setLong(userData.personal_long);
        setEthniciting(userData.personal_ethnicity);
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
        <div className="container-heading-aboutEdit">Personal Information</div>
        <div className="horizontal-seprator-edit"></div>

        <div>
          <div className="location-aboutEdit">{t("personal.citizen")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={citizen}
              onChange={(e) => handleSelectChange(e, setCitizen)}
              required
            >
              <option></option>
              {Countries.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.origin")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={origin}
              onChange={(e) => handleSelectChange(e, setOrigin)}
              required
            >
              <option></option>
              {Countries.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.relocate")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={relocate}
              onChange={(e) => handleSelectChange(e, setRelocate)}
              required
            >
              <option></option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.income")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={income}
              onChange={(e) => handleSelectChange(e, setIncome)}
              required
            >
              <option></option>
              <option>Average</option>
              <option>Above Average</option>
              <option>Below Average</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.marriage")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={marriage}
              onChange={(e) => handleSelectChange(e, setMarriage)}
              required
            >
              <option></option>
              <option>This Year</option>
              <option>Next Year</option>
              <option>As soon as possible</option>
              <option>Any Time</option>
            </select>
          </div>
        </div>

        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.status")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={marital}
              onChange={(e) => handleSelectChange(e, setMarital)}
              required
            >
              <option></option>
              <option>Never Married</option>
              <option>Legally Married</option>
              <option>Divorced</option>
              <option>Widowed</option>
              <option>Analled</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.children1")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={children1}
              onChange={(e) => handleSelectChange(e, setChildren1)}
              required
            >
              <option></option>
              <option>Yes I want to have</option>
              <option>No I don't want to have</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.children2")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={children2}
              onChange={(e) => handleSelectChange(e, setChildren2)}
              required
            >
              <option></option>
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.living")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={living}
              onChange={(e) => handleSelectChange(e, setLiving)}
              required
            >
              <option></option>
              <option>Alone</option>
              <option>Family</option>
              <option>Friends</option>
              <option>Other</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.height")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={height}
              onChange={(e) => handleSelectChange(e, setHeight)}
              required
            >
              <option></option>
              {Height.map((city) => (
                <option key={city}>{city} cm</option>
              ))}
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.build")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={build}
              onChange={(e) => handleSelectChange(e, setBuild)}
              required
            >
              <option></option>
              <option>Petite</option>
              <option>Slim</option>
              <option>Athletic</option>
              <option>Medium</option>
              <option>Muscular</option>
              <option>Large</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.ethnicity")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={ethniciting}
              onChange={(e) => handleSelectChange(e, setEthniciting)}
              required
            >
              <option></option>
              {Ethnicity.map((city) => (
                <option key={city}>{city}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="select-conatiner-personal">
          <div className="location-aboutEdit">{t("personal.smoke")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={smoke}
              onChange={(e) => handleSelectChange(e, setSmoke)}
              required
            >
              <option></option>
              <option>No</option>
              <option>Yes</option>
              <option>Sometimes</option>
              <option>Stopped</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-personal">
          <div className="location-aboutEdit">{t("personal.drink")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={drink}
              onChange={(e) => handleSelectChange(e, setDrink)}
              required
            >
              <option></option>
              <option>No</option>
              <option>Yes</option>
              <option>Sometimes</option>
              <option>Stopped</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-personal">
          <div className="location-aboutEdit">{t("personal.disability")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={disability}
              onChange={(e) => handleSelectChange(e, setDisability)}
              required
            >
              <option></option>
              <option>No Disability</option>
              <option>Yes Disability</option>
              <option>Speech Language</option>
              <option>Hearing Loss</option>
              <option>Vision Loss</option>
              <option>Physical Disability</option>
              <option>Learning Disability</option>
              <option>Mental illness</option>
              <option>Chronic Disability</option>
              <option>Autisim</option>
              <option>Ask me</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-personal">
          <div className="location-aboutEdit">{t("personal.long")}</div>
          <div className="select-location-aboutEdit">
            <select
              value={long}
              onChange={(e) => handleSelectChange(e, setLong)}
              required
            >
              <option></option>
              <option>Attatched to my phone</option>
              <option>Regular use</option>
              <option>Not much</option>
            </select>
          </div>
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
