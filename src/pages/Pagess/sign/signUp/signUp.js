import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { signIn, useSession, signOut } from "next-auth/react";
import SignUpGoogle from "../../../../../public/signupGooglesvg";
import emailjs from "emailjs-com";
import { Input } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function SignUp() {
  const { status, data: session } = useSession();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(false);
  const [flag, setFlag] = useState(false);
  const [googleUser, setGoogleUser] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [confirmError, setConfirmError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tokenLink, setTokenLink] = useState("");

  const [t, i18n] = useTranslation("global");

  const { push } = useRouter();

  const jwt = require("jsonwebtoken"); //To decode the token we recieve from backend

  const shiftToSignIn = () => {
    console.log("signIn Clicked");
    push("/Pagess/sign/signIn/signIn");
  };
  const shiftToImam = () => {
    push("/Pagess/imam/sign/signIn/imamIn");
  };
  const shiftToHome = () => {
    push("/");
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  //------------------Email send-----------------------
 

  //---------------SignUP with google------------------------
  useEffect(() => {
    if (session && session.user && session.user.name) {
      console.log("GOOGLE USER SUCCESSFULLY CONNECTED");
      console.log(session.user.name);
      console.log(session.user.email);

      const fetchToken = async () => {
        //If the User Exists the Token Is fetched
        const res = await fetch("/api/google/getToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(session.user.email),
        });
        if (!res.ok) {
          const errorMessage = await res.json();
          console.error("Error if:", errorMessage.error);
          return;
        }
        const responseData = await res.json();
        const token = responseData.token;

        //Successful Redirection
        setGoogleUser(session.user.name);
        setGoogleEmail(session.user.email);
        localStorage.setItem("token", token);
        localStorage.setItem("email", session.user.email);
        localStorage.setItem("username", session.user.name);
        console.log("res", responseData);

        // push("/Pagess/create/results/results");
      };

      const validateUser = async () => {
        try {
          const res = await fetch("/api/google/checkUserExist", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user.email }),
          });
          if (!res.ok) {
            const errorMessage = await res.json();
            console.error("ERROR: ", errorMessage.error);
            return;
          }
          const responseData = await res.json();
          console.log("DATA RECIEVED", responseData);
          //setUserExist(true);
          if (responseData.user === true) {
            // fetchToken();
            //Since user exists, he/she will have to signIn instead
            setError(true);
          } else {
            //-----------USER DOESNOT EXIST-----------
            console.log("USER IS NOT REGISTERED");
            //setUserExist(false);
            console.log("PUSHING");
            setFlag(true);
          }
        } catch (error) {
          console.log("VALIDATION ERROR", error);
        }
      };
      validateUser();
    } else {
      console.log("GOOGLE USER NOT CONNECTED");
    }
  }, [session]);

  //------------------^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  useEffect(() => {
    const intervalId = setInterval(async () => {
      if (flag === true) {
        console.log("WORKING");
        console.log(session.user.email);
        localStorage.setItem("email", session.user.email);
        localStorage.setItem("username", session.user.name);
        try {
          const res = await fetch("/api/google/getToken", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: session.user.email }),
          });
          if (!res.ok) {
            const errorMessage = await res.json();
            console.error("ERROR: ", errorMessage.error);
            return;
          }
          const responseData = await res.json();
          const token = responseData.token;
          localStorage.setItem("token", token);
          try {
            const acc = {
              email: session.user.email,
              password: responseData.token,
              firstName: session.user.name,
              lastName: " ",
            };
            localStorage.setItem("email", session.user.email);
            localStorage.setItem("username", session.user.name);
            const res = await fetch("/api/createAcc/createAcc", {
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
            const username = "dsa";
            console.log("msg", msg);

            push("/Pagess/create/gender");
          } catch (error) {
            console.log("Error caught on try-catch line 181 of signUp", error);
          }
        } catch (error) {
          console.log("eror on 183", error);
        }
      }
    }, 3000); // 3000 milliseconds = 3 seconds

    // Clear the interval on component unmount to prevent memory leaks
    return () => clearInterval(intervalId);
  }, [flag]);

  //---------------SignUpWith GOOGLE----------------------------

  const signUpWithGoogle = async () => {
    localStorage.setItem("sign", 1);
    const result = await signIn("google");
  };
  //---------------^^^^^^^^^-----------------------------

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

      //First checking if email is valid
      const res = await fetch("/api/forgotPass/forgot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: emailAddress }),
      });
      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error if res:", errorMessage.error);
        alert("Email already exists");
        return;
      }
      const response = await res.json();

      if (response.check === true) {
        alert("Email Already Exists");
        return;
      }

      try {
        //If the User Exists the Token Is fetched
        const res2 = await fetch("/api/forgotPass/getToken", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: emailAddress }),
        });
        if (!res2.ok) {
          const errorMessage = await res2.json();
          console.error("Error if:", errorMessage.error);
          return;
        }
        const data2 = await res2.json();
        const userEmail = emailAddress;
        const fullName = firstName + " " + lastName;

        console.log("userEmail: ", userEmail);
        try {
          const res = await fetch("/api/createAcc/createAcc", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: password,
              email: userEmail,
              firstName: firstName,
              lastName: lastName,
            }),
          });
          if (!res.ok) {
            const errorMessage = await res.json();
            console.error("Error on forgotPass frontend:", errorMessage.error);
            return;
          }
          const data = await res.json();
          console.log("Data recieved from backend: ", data);
          if (data.check === true) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("name", data.name);
            localStorage.setItem("email", userEmail);
            push("/Pagess/create/gender");
          } else {
            alert("Error on creating account, please try again.");
          }
        } catch (error) {
          console.log("Could not create account", error);
        }

        localStorage.setItem("email", emailAddress);

        localStorage.setItem("username", fullName);
      } catch (error) {
        console.log("Error while getting token on signUp: ", error);
      }

      // if (token) {
      //   localStorage.setItem("token", token);
      //   localStorage.setItem("email", msg);
      //   localStorage.setItem("username", username);
      //   console.log("token", token);
      // }
      // sendEmail(emailAddress);
      // push("/Pagess/create/gender");
    } catch (error) {
      console.log("Error cought on last", error);
    }
  };

  useEffect(() => {
    if (tokenLink !== "" && tokenLink !== undefined && tokenLink !== null) {
      // Token link has been updated, call sendEmail
      sendEmail();
      setTokenLink("");
    }
  }, [tokenLink]);

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <div className="signUp-parent-signUp">
          <div className="logo-signUp" onClick={shiftToHome}>
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
                    if (/^(?=.*\d)[A-Za-z\d]{6,}$/.test(e.target.value)) {
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
                    Password must contain at least 6 characters, including
                    atleast one number
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
              <div className="imam-signIn" onClick={shiftToImam}>
                SignIn As Imam?
              </div>
              <div className="signGoogle-signIn">
                <div
                  onClick={signUpWithGoogle}
                  className="signIn-google-container-signIn"
                >
                  <SignUpGoogle />
                </div>
              </div>
              {error && (
                <div className="user-not-google-signIn">
                  User is already registered
                </div>
              )}
              <div className="no-acc-container-signUp">
                <div className="no-acc-signUp">
                  {t("signIn.already1")}{" "}
                  <span
                    onClick={shiftToSignIn}
                    style={{
                      color: "#b52d3b",
                      cursor: "pointer",
                    }}
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
