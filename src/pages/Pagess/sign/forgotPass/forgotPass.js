import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import emailjs from "emailjs-com";

export default function ForgotPass() {
  const [t, i18n] = useTranslation("global");
  const [email, setEmail] = useState("");
  const [tokenLink, setTokenLink] = useState("");

  const { push } = useRouter();
  const jwt = require("jsonwebtoken"); //To decode the token we recieve from backend

  //------------------Email send-----------------------
  const sendEmail = () => {
    const templateId = "template_i3b962y";
    console.log("token recieved before: ", tokenLink);
    if (tokenLink === "" || tokenLink === undefined || tokenLink === null) {
      console.log("Token link is empty");
      return;
    }
    const templateParams = {
      to_email: email,
      message: tokenLink,
    };
    console.log(tokenLink);
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

    alert("Email sent, please check your inbox");
    push("/Pagess/sign/signIn/signIn");
  };

  //------------------^^^^^^^^^^^^^---------------------

  //---------------Form Submission-----------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    //First checking if email is valid
    const checkEmail = email;
    const res = await fetch("/api/forgotPass/forgot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: checkEmail }),
    });
    if (!res.ok) {
      const errorMessage = await res.json();
      console.error("Error on forgotPass:", errorMessage.error);
      return;
    }
    const data = await res.json();
    console.log("Data:", data);
    if (data.check === false) {
      alert("Email not found");
      return;
    }

    try {
      const res2 = await fetch("/api/forgotPass/getToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: email }),
      });
      if (!res2.ok) {
        const errorMessage = await res2.json();
        console.error("Error if:", errorMessage.error);
        return;
      }
      const data2 = await res2.json();
      const userEmail = email;
      console.log("userEmail: ", userEmail);
      setTokenLink(
        (prevTokenLink) =>
          `https://www.mosquematch.com/Pagess/sign/forgotPass/resetPass/${userEmail}/${data2.token}`
      );

      localStorage.setItem("email", email);
    } catch (error) {
      console.log("Error while getting token on forgot pass: ", error);
    }
  };

  useEffect(() => {
    if (tokenLink !== "" && tokenLink !== undefined && tokenLink !== null) {
      // Token link has been updated, call sendEmail
      sendEmail();
      setTokenLink("");
    }
  }, [tokenLink]);

  //---------------^^^^^^^^^^^^--------------------

  return (
    <form onSubmit={() => handleSubmit(e)}>
      <div className="parent-forgot">
        <div className="logo-forgot">
          <span style={{ color: "#358fa1" }}>{t("nav.first")}</span>
          <span style={{ color: "#b52d3b" }}>{t("nav.second")}</span>
        </div>
        <div className="parent-container-forgot">
          <div className="box-forgot">
            <div className="text1-forgot">{t("signIn.forgot2")}</div>
            <div className="text2-forgot">{t("signIn.forgot3")}</div>
            <div className="email-container-forgot">
              <div>Email</div>
              <div className="email-input-container-forgot">
                <input
                  className="email-input-forgot"
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </div>
              <div className="submit-container-forgot">
                <button
                  className="submit-forgot"
                  onClick={(e) => handleSubmit(e)}
                >
                  Submit
                </button>
              </div>
              <div className="remember-container-forgot">
                <div
                  className="remember-forgot"
                  onClick={() => {
                    push("/Pagess/sign/signIn/signIn");
                  }}
                >
                  {t("signIn.remember")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
