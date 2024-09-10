import { createContext, useState } from "react";

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const [usernameContext, setUsernameContext] = useState("default");
  const [genderContext, setGenderContext] = useState("default");
  const [aboutmeContext, setAboutmeContext] = useState(["default"]);
  const [eduworkContext, setEduworkContext] = useState(["default"]);
  const [personalContext, setPersonalContext] = useState(["default"]);
  const [religonContext, setReligonContext] = useState(["default"]);
  const [mosqueContext, setMosqueContext] = useState([]);
  const [cLocation, setcLocation] = useState(null);

  const [filterContext, setFilterContext] = useState({
    personalInfo: {
      ethnicity: {
        label: "Ethnicity",
        data: {
          Asian: false,
          African: false,
          Latin: false,
          "East Indian": false,
          Mixed: false,
          "Native American": false,
          "Pacific Islander": false,
          Caucasian: false,
          Other: false,
        },
      },
      body: {
        label: "Body Type",
        data: {
          Slim: false,
          Athletic: false,
          Medium: false,
          Muscular: false,
          Large: false,
        },
      },
      income: {
        label: "Income Level",
        data: {
          "Below Average": false,
          Average: false,
          "Above Average": false,
        },
      },
      marital: {
        label: "Marital Status",
        data: {
          Single: false,
          Married: false,
          Divorced: false,
          Separated: false,
          Widowed: false,
        },
      },
      smoke: {
        label: "Smoking Habits",
        data: {
          No: false,
          Yes: false,
          Sometimes: false,
          Stopped: false,
        },
      },
      drink: {
        label: "Drinking Habits",
        data: {
          No: false,
          Yes: false,
          Sometimes: false,
          Stopped: false,
        },
      },
      phone: {
        label: "Phone Usage",
        data: {
          "Attached to my phone": false,
          "Regular User": false,
          "Not Much": false,
        },
      },
    },
    religion: {
      religious: {
        label: "Religious Level",
        data: {
          "Very Religious": false,
          Religious: false,
          "Somewhat Religious": false,
          "Not Religious": false,
          "Prefer Not To Say": false,
        },
      },
      sect: {
        label: "Sect",
        data: {
          "Just Muslim": false,
          Sunni: false,
          Shia: false,
          Other: false,
        },
      },
      revert: {
        label: "Revert",
        data: {
          Yes: false,
          No: false,
        },
      },
      hijab: {
        label: "Hijab Observance",
        data: {
          "Always Keep Halal": false,
          "Usually Keep Halal": false,
          "I Keep Halal At Home": false,
          "Don't Keep Halal": false,
        },
      },
      halal: {
        label: "Halal Observance",
        data: {
          "Always Keep Halal": false,
          "Usually Keep Halal": false,
          "I Keep Halal At Home": false,
          "Don't Keep Halal": false,
        },
      },
      pray: {
        label: "Prayer Habits",
        data: {
          Always: false,
          Usually: false,
          Sometimes: false,
          Never: false,
        },
      },
    },
  });
  const [selectedMosques, setSelectedMosques] = useState([]);
  const [rangeContext, setRangeContext] = useState([]);
  const [mapContext, setMapContext] = useState([]);
  const [allmosquedata, setAllMosqueContext] = useState([]);

  return (
    <AppContext.Provider
      value={{
        usernameContext,
        setUsernameContext,
        genderContext,
        setGenderContext,
        aboutmeContext,
        setAboutmeContext,
        eduworkContext,
        setEduworkContext,
        personalContext,
        setPersonalContext,
        religonContext,
        setReligonContext,
        mosqueContext,
        setMosqueContext,
        filterContext,
        setFilterContext,
        rangeContext,
        setRangeContext,
        mapContext,
        setMapContext,
        allmosquedata,
        setAllMosqueContext,
        selectedMosques,
        setSelectedMosques,
        cLocation,
        setcLocation,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
export { AppContext };
