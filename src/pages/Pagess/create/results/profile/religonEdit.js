import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Education, Profession, JobTitle, Languages } from "@/data/dataAcc";

export default function ReligonEdit() {
  const { push } = useRouter();
  const [t, i18n] = useTranslation("global");

  //----------Storing input data in state----------------
  const [religious, setReligious] = useState("");
  const [sector, setSector] = useState("");
  const [hijab, setHijab] = useState("");
  const [beard, setBeard] = useState("");
  const [revert, setRevert] = useState("");
  const [halal, setHalal] = useState("");
  const [pray, setPray] = useState("");
  const [quran, setQuran] = useState("");
  //-----------------^^^^^^^^^^--------------------------

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
      !religious ||
      !sector ||
      !hijab ||
      !beard ||
      !revert ||
      !halal ||
      !pray ||
      !quran
    ) {
      alert("Please fill all the fields");
      return;
    }

    const allData = {
      religious: religious,
      sector: sector,
      hijab: hijab,
      beard: beard,
      revert: revert,
      halal: halal,
      pray: pray,
      quran: quran,
    };
    try {
      const res = await fetch("/api/update/religon", {
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
        setReligious(userData.religion_religious);
        setSector(userData.religion_sector);
        setHijab(userData.religion_hijab);
        setBeard(userData.religion_beard);
        setRevert(userData.religion_revert);
        setHalal(userData.religion_halal);
        setPray(userData.religion_pray);
        setQuran(userData.religon_quran);
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
        <div className="container-heading-aboutEdit">Religon</div>
        <div className="horizontal-seprator-edit"></div>
        <div>
          <div className="location-aboutEdit">{t("religon.religious")}</div>
          <div className="select-location-aboutEdit">
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
          <div className="location-aboutEdit">{t("religon.sector")}</div>
          <div className="select-location-aboutEdit">
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

        <div className="select-conatiner-religon">
          <div className="location-aboutEdit">{t("religon.prefer")}</div>
          <div className="select-location-aboutEdit">
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
        <div className="select-conatiner-religon">
          <div className="location-aboutEdit">{t("religon.beard")}</div>
          <div className="select-location-aboutEdit">
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
        <div className="select-conatiner-religon">
          <div className="location-aboutEdit">{t("religon.revert")}</div>
          <div className="select-location-aboutEdit">
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
          <div className="location-aboutEdit">{t("religon.halal")}</div>
          <div className="select-location-aboutEdit">
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
          <div className="location-aboutEdit">{t("religon.pray")}</div>
          <div className="select-location-aboutEdit">
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
          <div className="location-aboutEdit">{t("religon.quran")}</div>
          <div className="select-location-aboutEdit">
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
