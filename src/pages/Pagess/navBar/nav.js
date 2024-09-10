import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function NavBar() {
  const [t, i18n] = useTranslation("global");

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  const { push } = useRouter();

  const shiftToSignin = () => {
    console.log("Login Clicked");
    push("/Pagess/sign/signIn/signIn");
  };

  return (
    <div>
      <div className="navbar-parent-container-nav">
        <div className="navbar-logo-nav">
          <span style={{ color: "#358fa1" }}>{t("nav.first")}</span>
          <span style={{ color: "#b52d3b" }}>{t("nav.second")}</span>
        </div>
        <div className="navbar-right-container-nav">
          {/* <div className="select-language-nav">
            <select onChange={handleLanguageChange}>
              <option value="en">English</option>
              <option value="es">español</option>
              <option value="fr">Français</option>
              <option value="de">Deutsch</option>
              <option value="ru">русский</option>
              <option value="it">Italiano</option>
              <option value="pt">Português</option>
              <option value="ru">русский</option>
              <option value="it">Italiano</option>
            </select>
          </div> */}
          <div>
            <button onClick={shiftToSignin} className="login-button-imam-nav">
              Login user
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                push("/Pagess/sign/signUp/signUp");
              }}
              className="login-button-imam-nav"
            >
              SignUp User
            </button>
          </div>
          <div>
            <button
              onClick={() => {
                push("/Pagess/imam/sign/signIn/imamIn");
              }}
              className="login-button-imam-nav"
            >
              Login imam
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
