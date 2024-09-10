import { useTranslation } from "react-i18next";
import { signIn, useSession, signOut } from "next-auth/react";
import { use } from "i18next";
import SignGoogle from "../../../../../../public/signGooglesvg";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function ImamIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session } = useSession();
  const [showPassword, setShowPassword] = useState(false);
  const [t, i18n] = useTranslation("global");
  const { push } = useRouter();

  const shiftToUserSignIn = () => {
    push("/Pagess/sign/signIn/signIn");
  };
  const shiftToImamSignUp = () => {
    push("/Pagess/imam/sign/signUp/imamUp");
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const shiftToHome = () => {
    push("/");
  };

  //------------Signin With GOOGLE----------------->
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
        localStorage.setItem("token", token);
        localStorage.setItem("email", session.user.email);
        localStorage.setItem("username", session.user.name);
        console.log("res", responseData);

        push("/Pagess/imam/create/imamResult");
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
          console.log("USER FOUND", responseData);
          if (responseData.user === true) {
            fetchToken();
          } else {
            //-----------USER DOESNOT EXIST-----------
            console.log("USER IS NOT REGISTERED");
            setRegistered(false);
            localStorage.setItem("goog", 2);
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

  const signInWithGoogle = async () => {
    if (navigator.userAgent.includes("Mac")) {
      if (!localStorage.getItem("goog")) {
        localStorage.setItem("goog", 1);
      }
    }
    await signIn("google");
  };

  //---------------^^^^^^^^^-----------------------------
  const SignIn = async () => {
    let data = {
      email: email,
      password: password,
    };
    const res = await fetch("/api/imam/signInImam", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error if:", errorMessage.error);
      return;
    }
    const response = await res.json();
    console.log("Response: ", response);

    const token = response.token;
    const msg = response.email;
    const username = response.name;
    console.log("msg", msg);

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("email", msg);
      localStorage.setItem("username", username);
      console.log("token", token);
      push("/Pagess/imam/create/imamResult");
    }
  };
  return (
    <div>
      <div className="signIn-parent-signIn">
        <div className="logo-signIn" onClick={shiftToHome}>
          <span style={{ color: "#358fa1" }}>{t("nav.first")}</span>
          <span style={{ color: "#b52d3b" }}>{t("nav.second")}</span>
        </div>
        <div className="parent-container-signIn">
          <div className="box-signIn">
            <div className="fields-container-signIn">
              <div className="name-signIn">{t("signIn.email")}</div>
              <input
                type="email"
                className="input-signIn"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
            <div className="fields-container-signIn">
              <div className="name-signIn">{t("signIn.password")}</div>

              <Input
                disableUnderline
                className="input-password-signIn"
                type={showPassword ? "text" : "password"}
                onChange={(e) => {
                  setPassword(e.target.value);
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
            </div>

            <div className="terms-container-signIn">
              <div className="terms-signIn">
                {t("signIn.terms1")}{" "}
                <span style={{ fontWeight: "bold" }}>{t("signIn.terms2")}</span>{" "}
                Policy
              </div>
            </div>
            <div className="forgot-container-signIn">
              <div
                className="forgot-signIn"
                onClick={() => {
                  push("/Pagess/sign/forgotPass/forgotPass");
                }}
              >
                {t("signIn.forgot")}
              </div>
            </div>
            <div className="signIn-btn-container-signIn">
              <button className="signIn-button-signIn" onClick={SignIn}>
                {t("signIn.login")}
              </button>
            </div>
            <div className="or-container-signIn">
              <div className="or-left-signIn"></div>
              <div className="or-signIn">OR</div>
              <div className="or-right-signIn"></div>
            </div>
            <div className="signGoogle-signIn">
              <div
                onClick={() => {
                  signInWithGoogle();
                }}
                className="signIn-google-container-signIn"
              >
                <SignGoogle />
              </div>
            </div>
            <div className="no-acc-container-signIn">
              <div className="no-acc-signIn">
                {t("signIn.acc1")}{" "}
                <span
                  style={{ color: "#b52d3b", cursor: "pointer" }}
                  onClick={shiftToImamSignUp}
                >
                  {t("signIn.acc2")}
                </span>
              </div>
              <div className="no-acc-imam-signIn" onClick={shiftToUserSignIn}>
                {t("signIn.user")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
