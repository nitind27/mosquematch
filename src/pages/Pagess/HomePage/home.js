import NavBar from "../navBar/nav";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Google from "../../../../public/googlesvg";
import Apple from "../../../../public/applesvg";
import Head from "next/head";
import Footer from "../footer/footer";
import { useEffect, useState } from "react";
import TextSlider from "./text-slider";

export default function HomePage() {
  const [t, i18n] = useTranslation("global");

  useEffect(() => {
    const GetResponse = async () => {
      console.log("Api call sent!");

      const res = await fetch("/api/createAcc/check", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify("hello"),
      });
      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error on resoponse:", errorMessage.error);
        return;
      } else {
        const msg = await res.json();
        console.log("Server connected!", msg);
      }
    };
    GetResponse();
  }, []);

  return (
    <div style={{ height: "auto" }}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="header-home-parent">
        <div className="navbar-parent-home">
          <NavBar />
        </div>
        <div className="image-home">
          <Image
            unoptimized
            src="/home/homeImageHead1.jpeg"
            alt="home"
            layout="fill"
          />
        </div>
        <div className="img-cover-home">
          <TextSlider />
        </div>
        <div className="works-title-home">How it Works!</div>
        <div className="works-sub-home">
          Your Perfect Local Match, Completely Free!
        </div>
        <div className="icons-container-home">
          <div className="icon-parent-home">
            <div className="register-text-home">Register</div>
            <div className="register-img-home">
              <Image
                unoptimized
                src="/home/register.jpeg"
                alt="register"
                layout="responsive"
                width={10}
                height={10}
              />
            </div>
            <div className="register-subtext-home">Register your Info</div>
          </div>
          <div className="icon-parent-home">
            <div className="register-text-home">Fill your Interests</div>
            <div className="register-img-home">
              <Image
                unoptimized
                src="/home/interest.jpeg"
                alt="register"
                layout="responsive"
                width={10}
                height={10}
              />
            </div>
            <div className="register-subtext-home">
              Tell us what you are looking
              <br />
              for
            </div>
          </div>
          <div className="icon-parent-home">
            <div className="register-text-home">Link to a Mosque</div>
            <div className="register-img-home">
              <Image
                unoptimized
                src="/home/mosque.jpeg"
                alt="register"
                layout="responsive"
                width={10}
                height={10}
              />
            </div>
            <div className="register-subtext-home">
              Link to a mosque and get
              <br />
              approved by the imam
            </div>
          </div>
          <div className="icon-parent-home">
            <div className="register-text-home">Connect</div>
            <div className="register-img-home">
              <Image
                unoptimized
                src="/home/connect.jpeg"
                alt="register"
                layout="responsive"
                width={10}
                height={10}
              />
            </div>
            <div className="register-subtext-home">
              Connect and find the right
              <br />
              partner
            </div>
          </div>
          <div className="icon-parent-home">
            <div className="register-text-home">Wali</div>
            <div className="register-img-home">
              <Image
                unoptimized
                src="/home/wali.jpeg"
                alt="register"
                layout="responsive"
                width={10}
                height={10}
              />
            </div>
            <div className="register-subtext-home">
              Talk to your partner's Wali to
              <br />
              get his approval
            </div>
          </div>
        </div>
        <div className="success-container-home">
          <div className="success-title-home">Success Stories</div>
          <div className="success-sub-home">
            Your Perfect Local Match, Completely Free!
          </div>
          <div className="stories-container-home">
            <div className="story-parent-home">
              <div className="title-story-home">Omar</div>
              <div className="story-detail-home">
                amidst digital spaces, thanks to Mosquematch. Our profiles
                aligned, hearts connected, and dreams intertwined. Together, we
                embarked on a beautiful journey, embracing love, faith, and
                everlasting companionship. Mosquematch, the catalyst of our
                blissful union.
              </div>
            </div>
            <div className="story-parent-home">
              <div className="title-story-home">Sara</div>
              <div className="story-detail-home">
                Mosquematch, I discovered my soulmate, a beacon of light in a
                digital realm. Our hearts synchronized, and with Allah's
                blessings, we embarked on an eternal journey of love, faith, and
                happiness.
              </div>
            </div>
            <div className="story-parent-home">
              <div className="title-story-home">Ahmed</div>
              <div className="story-detail-home">
                discovered my missing puzzle piece. Our hearts recognized each
                other's essence, and in the journey of love and devotion, we
                found solace, joy, and a lifelong partnership. Mosquematch, the
                divine matchmaker.
              </div>
            </div>
            <div className="story-parent-home">
              <div className="title-story-home">Adam</div>
              <div className="story-detail-home">
                Mosquematch unveiled a world of possibilities. Through its
                platform, I discovered my true love, a companion whose heart
                resonated with mine. Together, we embraced Islam, love, and a
                lifetime of cherished moments. Mosquematch, the gateway to
                eternal happiness.
              </div>
            </div>
          </div>
        </div>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

//f∂
