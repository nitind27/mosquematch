import { useTranslation } from "react-i18next";
import { use } from "i18next";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export default function AdminIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [t, i18n] = useTranslation("global");
  const { push } = useRouter();

  const shiftToAdminSignUp = () => {
    push("/Pagess/admin/adminSignUp");
  };
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  //---------------^^^^^^^^^-----------------------------
  const SignIn = async () => {
    let data = {
      email: email,
      password: password,
    };
    const res = await fetch("/api/admin/signInAdmin", {
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
      push("/Pagess/admin/adminResult");
    }
  };
  return (
    <div>
      <div className="signIn-parent-signIn">
        <div className="logo-signIn">
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

            <div className="no-acc-container-signIn">
              <div className="no-acc-signIn">
                {t("signIn.acc1")}{" "}
                <span
                  style={{ color: "#b52d3b", cursor: "pointer" }}
                  onClick={shiftToAdminSignUp}
                >
                  {t("signIn.acc2")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
