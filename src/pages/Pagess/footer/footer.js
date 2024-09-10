import { useTranslation } from "react-i18next";
import { useRef } from "react";
import { useRouter } from "next/navigation";

export default function Footer() {
  const [t, i18n] = useTranslation("global");
  const { push } = useRouter();
  const scrollRef = useRef(null);

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div>
      <div className="parent-container-footer">
        <div className="info-parent-footer">
          <div className="sitemap-container-footer">
            <div className="title-info-footer">Sitemap</div>
            <div
              className="first-info-footer"
              onClick={scrollToTop}
              ref={scrollRef}
            >
              Home
            </div>
            <div
              className="second-info-footer"
              onClick={() => {
                push("/Pagess/sign/signIn/signIn");
              }}
            >
              User Login
            </div>
            <div
              className="second-info-footer"
              onClick={() => {
                push("/Pagess/sign/signUp/signUp");
              }}
            >
              User Register
            </div>
            <div
              className="second-info-footer"
              onClick={() => {
                push("/Pagess/imam/sign/signIn/imamIn");
              }}
            >
              Imam Login
            </div>
            <div
              className="second-info-footer"
              onClick={() => {
                push("/Pagess/imam/sign/signUp/imamUp");
              }}
            >
              Imam Register
            </div>
          </div>
          <div className="sitemap-container-footer">
            <div className="title-info-footer">Our Social </div>
            <div className="first-info-footer ">
              <a
                href="https://www.facebook.com"
                target="_blank"
                className="info-face-footer"
              >
                Facebook
              </a>
            </div>
            <div className="second-info-footer">
              {" "}
              <a
                href="https://www.twitter.com"
                target="_blank"
                className="info-face-footer"
              >
                Twitter
              </a>
            </div>
            <div className="second-info-footer">
              {" "}
              <a
                href="https://www.youtube.com"
                target="_blank"
                className="info-face-footer"
              >
                Youtube
              </a>
            </div>
          </div>
          <div className="sitemap-container-footer">
            <div className="title-info-footer">About Us</div>
            <div className="first-info-footer" style={{ cursor: "default" }}>
              At Mosque Match, we are dedicated to fostering meaningful
              connections within the Muslim community. Our platform is designed
              to empower individuals to discover mosques, connect with fellow
              muslims, and build lasting relationships grounded in faith and
              shared values.
            </div>
          </div>
        </div>
        <div className="bar-footer "></div>
        <div className="copy-footer">
          <div>Copyright 2021 MosqueMatch.Co. All Rights are reserved</div>
          <div>Privacy Policy | Terms of use</div>
        </div>
      </div>
    </div>
  );
}
