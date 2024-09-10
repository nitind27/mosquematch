import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";

export default function ResetPassPage() {
  const router = useRouter();
  const { params } = router.query;
  const [userEmail, setUserEmail] = useState("");
  
  let token = "";
  const [t, i18n] = useTranslation("global");
  const { push } = useRouter();

  useEffect(() => {
    if (params) {
      const encryptedEmail = params[0];
      const decryptedEmail = atob(encryptedEmail); // Decrypt email using atob
      setUserEmail(decryptedEmail);
      token = params[4];
    }
  }, [params]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/createAcc/confirmAcc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userEmail,
          user_status: '1',
        }),
      });
      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error on frontend:", errorMessage.error);
        return;
      }
      const data = await res.json();
      console.log("Data received from backend: ", data);
      if (data.check === true) {
        push("/Pagess/sign/signIn/signIn");
      } else {
        alert("Error on updating user status, please try again.");
      }
    } catch (error) {
      console.log("Could not update user status", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="parent-reset">
        <div className="logo-reset">
          <span style={{ color: "#358fa1" }}>{t("nav.first")}</span>
          <span style={{ color: "#b52d3b" }}>{t("nav.second")}</span>
        </div>
        <div className="parent-container-reset">
          <div className="box-reset">
            <div className="text-container-reset">
              <div className="text-reset">Confirm Email {userEmail}</div>
            </div>
            <div className="email-container-reset">
              <div className="submit-container-reset">
                <button
                  className="submit-reset"
                  onClick={handleSubmit}
                >
                  Confirm
                </button>
              </div>
              <div className="remember-container-reset">
                <div
                  className="remember-reset"
                  onClick={() => {
                    push("/Pagess/sign/signIn/signIn");
                  }}
                >
                  Go back to Login?
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
