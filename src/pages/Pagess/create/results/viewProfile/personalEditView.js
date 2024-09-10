import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function PersonalEditView({ data }) {
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

  useEffect(() => {
    if (data) {
      setCitizen(data.personal_citizen);
      setOrigin(data.personal_origin);
      setRelocate(data.personal_relocate);
      setIncome(data.personal_income);
      setMarriage(data.personal_marriage);
      setMarital(data.personal_marital);
      setChildren1(data.personal_children1);
      setChildren2(data.personal_children2);
      setLiving(data.personal_living);
      setHeight(data.personal_height);
      setBuild(data.personal_build);
      setSmoke(data.personal_smoke);
      setDrink(data.personal_drink);
      setDisability(data.personal_disability);
      setLong(data.personal_long);
      setEthniciting(data.personal_ethnicity);
    } else {
      console.error("userInfo is not defined in query parameters");
    }
  }, []);

  return (
    <div style={{ paddingBottom: "40px" }}>
      <div>
        <div className="container-heading-aboutEdit">Personal Information</div>
        <div className="horizontal-seprator-edit"></div>
        <div>
          <div className="location-aboutEdit">{t("personal.citizen")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={citizen}>
              <option>{citizen}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.origin")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={origin}>
              <option>{origin}</option>
            </select>
          </div>
        </div>

        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.relocate")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={relocate}>
              <option>{relocate}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.income")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={income}>
              <option>{income}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.marriage")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={marriage}>
              <option>{marriage}</option>
            </select>
          </div>
        </div>

        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.status")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={marital}>
              <option>{marital}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.children1")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={children1}>
              <option>{children1}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.children2")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={children2}>
              <option>{children2}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.living")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={living}>
              <option>{living}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.height")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={height}>
              <option>{height}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.build")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={build}>
              <option>{build}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-aboutEdit">
          <div className="location-aboutEdit">{t("personal.ethnicity")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={ethniciting}>
              <option>{ethniciting}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-personal">
          <div className="location-aboutEdit">{t("personal.smoke")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={smoke}>
              <option>{smoke}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-personal">
          <div className="location-aboutEdit">{t("personal.drink")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={drink}>
              <option></option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-personal">
          <div className="location-aboutEdit">{t("personal.disability")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={disability}>
              <option>{drink}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-personal">
          <div className="location-aboutEdit">{t("personal.long")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={long}>
              <option>{long}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
