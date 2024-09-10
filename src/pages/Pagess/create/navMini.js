import { useTranslation } from "react-i18next";

export default function NavMini() {
  const [t, i18n] = useTranslation("global");

  return (
    <div style={{ zIndex: "1" }}>
      <div className="navbar-parent-container-miniNav">
        <div className="navbar-logo-miniNav">
          <span style={{ color: "#358fa1" }}>{t("nav.first")}</span>
          <span style={{ color: "#b52d3b" }}>{t("nav.second")}</span>
        </div>
      </div>
    </div>
  );
}
