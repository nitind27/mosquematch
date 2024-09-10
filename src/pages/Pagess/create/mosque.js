import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import NavMini from "./navMini";
import { useTranslation } from "react-i18next";
import { AppContext } from "../AppContext";
import emailjs from "emailjs-com";

export default function Mosque() {
  const [t, i18n] = useTranslation("global");
  const { push } = useRouter();
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState([]);
  const [arrMosque, setArrMosque] = useState([]);
  const [checkedMosques, setCheckedMosques] = useState([]);
  const [reset, setReset] = useState(false);

  const [emailAddress, setEmailAddress] = useState("");
  const [tokenLink, setTokenLink] = useState("");

  const { genderContext, setGenderContext } = useContext(AppContext);
  const { aboutmeContext, setAboutmeContext } = useContext(AppContext);
  const { personalContext, setPersonalContext } = useContext(AppContext);
  const { eduworkContext, setEduworkContext } = useContext(AppContext);
  const { religonContext, setReligonContext } = useContext(AppContext);
  const { mosqueContext, setMosqueContext } = useContext(AppContext);

  const handleInputChange = async (value) => {
    setInputValue(value);
    setReset(!reset);

    const res = await fetch("/api/getMosque/getNames", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: value }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error:", errorMessage.error);
      return;
    }
    const response = await res.json();
    setArrMosque(response);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.log("Token not found");
      push("/Pagess/sign/signIn/signIn");
    } else {
      console.log("Token found!");
    }
  }, [push]);

  useEffect(() => {
    if (localStorage.getItem("aboutMe") !== null) {
      let about = JSON.parse(localStorage.getItem("aboutMe"));
      setAboutmeContext(about);
      let personal = JSON.parse(localStorage.getItem("personal"));
      setPersonalContext(personal);
      let eduwork = JSON.parse(localStorage.getItem("eduwork"));
      setEduworkContext(eduwork);
      let religon = JSON.parse(localStorage.getItem("religon"));
      setReligonContext(religon);
    }
  }, [
    setAboutmeContext,
    setPersonalContext,
    setEduworkContext,
    setReligonContext,
  ]);

  useEffect(() => {
    console.log("aboutmeContext: ", religonContext);
  }, [aboutmeContext, religonContext]);

  const sendEmail = () => {
    const templateId = "template_ucwlucj";
    const templateParams = {
      to_name: localStorage.getItem("username"),
      to_email: emailAddress,
      message: tokenLink,
    };

    emailjs
      .send("service_2offjoq", templateId, templateParams, "N3l8CQkoHqaZ8p5Ro")
      .then(
        (result) => {
          console.log(result.text);
          alert("Email sent, please check your inbox");
        },
        (error) => {
          console.log(error.text);
          alert("Failed to send email. Please try again later.");
        }
      );
  };

  useEffect(() => {
    if (tokenLink !== "" && emailAddress !== "") {
      sendEmail();
      setTokenLink("");
    }
  }, [tokenLink, emailAddress]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("email");
    const encryptedEmail = btoa(email);

    if (!email) {
      console.log("Email not found");
      return;
    }

    if (mosqueContext.length === 0) {
      alert("Please select a mosque");
      return;
    }

    const dataToSend = {
      email,
      gender: genderContext,
      aboutMe: aboutmeContext || "",
      personal: personalContext || "",
      eduwork: eduworkContext || "",
      religion: religonContext || "",
      mosque: mosqueContext || [],
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/createAcc/addInfoAcc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });

      if (!res.ok) {
        throw new Error("Failed to create account");
      }

      const tokenLink = `https://www.mosquematch.com/Pagess/sign/signUp/confirm/${encryptedEmail}/${token}`;

      const templateId = "template_ucwlucj";
      const templateParams = {
        to_name: localStorage.getItem("username"),
        to_email: email,
        message: tokenLink,
      };

      const emailResult = await emailjs.send(
        "service_2offjoq",
        templateId,
        templateParams,
        "N3l8CQkoHqaZ8p5Ro"
      );

      console.log("Email sent successfully:", emailResult.text);
      alert("Email sent, please check your inbox");

      push("/Pagess/sign/signIn/signIn");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email. Please try again later.");
    }
  };

  const handleCheckboxChange = (mosque) => {
    const { id, name } = mosque;
    const isChecked = checkedMosques.some((item) => item.id === id);

    if (isChecked) {
      setCheckedMosques((prev) => prev.filter((item) => item.id !== id));
      setMosqueContext((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCheckedMosques((prev) => [...prev, { id, name }]);
      setMosqueContext((prev) => [...prev, { id, name }]);
    }
  };

  useEffect(() => {
    setCheckedMosques([]);
  }, [reset]);

  useEffect(() => {
    console.log("checkedMosques:", mosqueContext);
  }, [mosqueContext]);

  const removeAddedMosque = (mosque) => {
    setCheckedMosques((prev) => prev.filter((item) => item.id !== mosque.id));
    setMosqueContext((prev) => prev.filter((item) => item.id !== mosque.id));
  };

  return (
    <form onSubmit={handleSubmit}>
      <NavMini />
      <div className="parent-mosque">
        <div className="heading-container-mosque">
          <div className="heading-mosque">Link To A Mosque</div>
        </div>
        <div className="box-container-mosque">
          <div className="box-mosque">
            <div className="select-conatiner-mosque">
              <div className="input-container-mosque">
                <input
                  className="input-little-mosque"
                  onChange={(e) => handleInputChange(e.target.value)}
                />
                {arrMosque && arrMosque.length > 0 && (
                  <div className="option-container-mosque">
                    {arrMosque.map((mosque, index) => (
                      <div className="mini-option-mosque" key={index}>
                        <p>{mosque.name}</p>
                        <label className="check-option-mosque">
                          <input
                            type="checkbox"
                            onChange={() => handleCheckboxChange(mosque)}
                            checked={checkedMosques.some(
                              (item) => item.id === mosque.id
                            )}
                          />
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="button-container-mosque">
              <button type="submit" className="button-mosque">
                Next
              </button>
            </div>
          </div>
          <div className="box-mosque">
            <div className="select-conatiner-mosque">
              <div className="input-container-mosque">
                <div className="added-title-mosque">Mosques Added</div>
                {mosqueContext.length > 0 ? (
                  <div>
                    {mosqueContext.map((mosque, index) => (
                      <div key={index}>
                        <div className="mosque-added-mosque">
                          - {mosque.name}
                        </div>
                        <div
                          className="remove-added-mosque"
                          onClick={() => removeAddedMosque(mosque)}
                        >
                          Remove
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
