import ResultsNav from "../navResult";
import { useState } from "react";
import BasicEdit from "./basicEdit";
import AboutEdit from "./aboutEdit";
import EduEdit from "./eduEdit";
import PersonalEdit from "./personalEdit";
import ReligonEdit from "./religonEdit";
import PhotoEdit from "./photoEdit";

export default function EditProfile() {
  const [selected, setSelected] = useState("Basic Information");

  return (
    <div className="shade-edit">
      <ResultsNav />
      <div className="parent-edit">
        <div className="left-container-edit">
          <div className="title-edit">{selected}</div>
          <div className="horizontal-seprator-edit"></div>
          <div
            className="subtitle-edit"
            onClick={() => setSelected("Basic Information")}
          >
            Basic Information
          </div>
          <div className="horizontal-seprator-edit"></div>
          <div
            className="subtitle-edit"
            onClick={() => setSelected("About Me")}
          >
            About Me
          </div>
          <div className="horizontal-seprator-edit"></div>
          <div
            className="subtitle-edit"
            onClick={() => setSelected("Education & Work")}
          >
            Education & Work
          </div>
          <div className="horizontal-seprator-edit"></div>
          <div
            className="subtitle-edit"
            onClick={() => setSelected("Personal Information")}
          >
            Personal Information
          </div>
          <div className="horizontal-seprator-edit"></div>
          <div className="subtitle-edit" onClick={() => setSelected("Religon")}>
            Religon
          </div>
          <div className="horizontal-seprator-edit"></div>
          <div className="subtitle-edit" onClick={() => setSelected("Photo")}>
            Photo
          </div>
          <div className="horizontal-seprator-edit"></div>
        </div>
        <div className="vertical-seprator-edit"></div>
        <div className="right-edit">
          {selected === "Basic Information" && <BasicEdit />}
          {selected === "About Me" && <AboutEdit />}
          {selected === "Education & Work" && <EduEdit />}
          {selected === "Personal Information" && <PersonalEdit />}
          {selected === "Religon" && <ReligonEdit />}
          {selected === "Photo" && <PhotoEdit />}
        </div>
      </div>
    </div>
  );
}
