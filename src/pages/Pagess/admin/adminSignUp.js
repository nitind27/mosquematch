import emailjs from "emailjs-com";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function ImamUp() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [flag, setFlag] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [t, i18n] = useTranslation("global");

  const { push } = useRouter();

  const jwt = require("jsonwebtoken"); //To decode the token we recieve from backend

  const shiftToSignIn = () => {
    console.log("signIn Clicked");
    push("/Pagess/admin/adminSignIn");
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  //------------------Email send-----------------------
  const sendEmail = (user) => {
    const templateId = "template_ucwlucj";
    console.log(emailAddress);
    const templateParams = {
      to_name: user,
      to_email: emailAddress,
    };

    // Send the email
    emailjs
      .send("service_2offjoq", templateId, templateParams, "N3l8CQkoHqaZ8p5Ro")
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  //------------------^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  //------------------Handle Submit-----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      passwordError ||
      confirmError ||
      !firstName ||
      !lastName ||
      emailAddress === "" ||
      password === "" ||
      confirm === "" ||
      password !== confirm
    ) {
      return;
    }
    try {
      const acc = {
        email: emailAddress,
        password: password,
        firstName: firstName,
        lastName: lastName,
      };

      const res = await fetch("/api/admin/signUpAdmin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(acc),
      });
      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error if res:", errorMessage.error);
        alert("Email already exists");
        return;
      }
      const response = await res.json();

      const token = response.token;
      const msg = response.message;
      const username = "Admin";
      console.log("msg", msg);

      if (token) {
        localStorage.setItem("token", token);
        localStorage.setItem("email", msg);
        localStorage.setItem("username", username);
        console.log("token", token);
      }
      sendEmail(emailAddress);
      push("/Pagess/admin/messagesAdmin");
    } catch (error) {
      console.log("Error cought on last", error);
    }
  };

  //------------------^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div className="signUp-parent-signUp">
          <div className="logo-signUp">
            <span style={{ color: "#358fa1" }}>{t("nav.first")}</span>
            <span style={{ color: "#b52d3b" }}>{t("nav.second")}</span>
          </div>
          <div className="parent-container-signUp">
            <div className="box-signUp">
              <div className="fields-container-signUp">
                <div className="name-signUp">{t("signIn.first")}</div>
                <input
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  className="input-signUp"
                />
              </div>
              <div className="fields-container-signUp">
                <div className="name-signUp">{t("signIn.last")}</div>
                <input
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  type="text"
                  className="input-signUp"
                />
              </div>
              <div className="fields-container-signUp">
                <div className="name-signUp">{t("signIn.email")}</div>
                <input
                  onChange={(e) => {
                    setEmailAddress(e.target.value);
                  }}
                  type="email"
                  className="input-signUp"
                />
              </div>
              <div className="fields-container-signUp">
                <div className="name-signUp">{t("signIn.password")}</div>
                <Input
                  disableUnderline
                  className="input-password-signIn"
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => {
                    if (
                      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(
                        e.target.value
                      )
                    ) {
                      setPasswordError(false);
                      setPassword(e.target.value);
                    } else {
                      setPasswordError(true);
                    }
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton onClick={handleTogglePasswordVisibility}>
                        {showPassword ? (
                          <VisibilityIcon />
                        ) : (
                          <VisibilityOffIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                {passwordError && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    Password must contain at least 8 characters, including 1
                    letter and 1 number
                  </div>
                )}
              </div>
              <div className="fields-container-signUp">
                <div className="name-signUp">{t("signIn.confirm")}</div>
                <input
                  onChange={(e) => {
                    const confirmPwd = e.target.value;
                    setConfirm(confirmPwd);
                    if (confirmPwd === password) {
                      setConfirmError(false);
                    } else {
                      setConfirmError(true);
                    }
                  }}
                  type="password"
                  className="input-signUp"
                />
                {confirmError && (
                  <div style={{ color: "red", fontSize: "12px" }}>
                    Passwords do not match
                  </div>
                )}
              </div>
              <div className="terms-container-signUp">
                <div className="terms-signUp">
                  {t("signIn.terms1")}{" "}
                  <span style={{ fontWeight: "bold" }}>
                    {t("signIn.terms2")}
                  </span>{" "}
                  {t("signIn.policy")}
                </div>
              </div>
              <div className="signUp-btn-container-signUp">
                <button type="submit" className="signUp-button-signUp">
                  {t("signIn.register")}
                </button>
              </div>
              <div className="or-container-signIn">
                <div className="or-left-signIn"></div>
                <div className="or-signIn">OR</div>
                <div className="or-right-signIn"></div>
              </div>
              <div className="no-acc-container-signUp">
                <div className="no-acc-signUp">
                  {t("signIn.already1")}{" "}
                  <span
                    onClick={shiftToSignIn}
                    style={{ color: "#b52d3b", cursor: "pointer" }}
                  >
                    {t("signIn.already2")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
