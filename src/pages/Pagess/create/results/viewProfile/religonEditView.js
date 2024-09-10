import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function ReligonEditView({ data }) {
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

  useEffect(() => {
    if (data) {
      setReligious(data.religion_religious);
      setSector(data.religion_sector);
      setHijab(data.religion_hijab);
      setBeard(data.religion_beard);
      setRevert(data.religion_revert);
      setHalal(data.religion_halal);
      setPray(data.religion_pray);
      setQuran(data.religon_quran);
    } else {
      console.error("userInfo is not defined in query parameters");
    }
  }, []);

  return (
    <div style={{ paddingBottom: "40px" }}>
      <div>
        <div className="container-heading-aboutEdit">Religon</div>
        <div className="horizontal-seprator-edit"></div>
        <div>
          <div className="location-aboutEdit">{t("religon.religious")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={religious}>
              <option>{religious}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-religon">
          <div className="location-aboutEdit">{t("religon.sector")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={sector}>
              <option>{sector}</option>
            </select>
          </div>
        </div>

        <div className="select-conatiner-religon">
          <div className="location-aboutEdit">{t("religon.prefer")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={hijab}>
              <option>{hijab}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-religon">
          <div className="location-aboutEdit">{t("religon.beard")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={beard}>
              <option>{beard}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-religon">
          <div className="location-aboutEdit">{t("religon.revert")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={revert}>
              <option>{revert}</option>
            </select>
          </div>
        </div>

        <div className="select-conatiner-religon">
          <div className="location-aboutEdit">{t("religon.halal")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={halal}>
              <option>{halal}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-religon">
          <div className="location-aboutEdit">{t("religon.pray")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={pray}>
              <option>{pray}</option>
            </select>
          </div>
        </div>
        <div className="select-conatiner-religon">
          <div className="location-aboutEdit">{t("religon.quran")}</div>
          <div className="select-location-aboutEdit">
            <select disabled value={quran}>
              <option>{quran}</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
