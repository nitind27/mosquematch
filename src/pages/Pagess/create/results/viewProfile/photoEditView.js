import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useRef } from "react";
import ImageSlider from "react-simple-image-slider";
import NextImage from "next/image";


export default function PhotoEditView({ data, routerQuery }) {


  const [t, i18n] = useTranslation("global");
  const [userInfo, setUserInfo] = useState([]);
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState();

  const [images, setImages] = useState([
    { imageUrl: null, isBlurred: false, backup: null, imageBase64: "" },
  ]);

  //----------Storing input data in state----------------
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const [backup, setBackup] = useState(null);
  const imageRefs = useRef([]);
  const [msg, setMsg] = useState("");
  const [prevImages, setPrevImages] = useState([]);
  const [access, setAccess] = useState(false);

  //-----------------^^^^^^^^^^--------------------------
  // const StackBlur = require("stackblur-canvas");

  useEffect(() => {
    console.log("routerQuery", routerQuery);
    const userInfoString = routerQuery.name;
    if (userInfoString) {
      try {
        const userInfoArray = JSON.parse(userInfoString);
        setUserInfo(userInfoArray);
        localStorage.setItem("currentNavOption", "search");
      } catch (error) {
        console.error("Error parsing userInfo:", error);
      }
    } else {
      console.error("userInfo is not defined in query parameters");
    }
  }, [routerQuery]);
  useEffect(() => {
    setEmail(userInfo.email);
    setGender(userInfo.gender);
    let tempAccess = false;
    var getImg = async () => {
      //Getting access first to see if the user has access to the images
      try {
        const res = await fetch("/api/interest/getAccessImage", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            viewed: userInfo.email,
            viewer: localStorage.getItem("email"),
          }),
        });
        const data1 = await res.json();
        if (data1.error) {
          console.log("Error: ", data1.error);
          setAccess(false);
        } else {
          if (data1.access[0].status === "approved") {
            setAccess(true);
          } else if (
            data1.access[0].status === "" ||
            data1.access[0].status === "denied"
          ) {
            setAccess(false);
          }
        }
      } catch (error) {
        console.log("Error: ", error);
      }

      // Fetch images from /api/update/getProfileImgPublic
      try {
        const res = await fetch("/api/update/getProfileImgPublic", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: userInfo.email,
          }),
        });
        const data = await res.json();
        if (data.error) {
          setImageUrl(null);
        } else {
          const updatedImages = data.images.map((imageData) => {
            return {
              imageUrl: imageData.image,
              isBlurred: imageData.privacy === "yes",
              backup: imageData.backup,
              imageBase64: "data:image/jpeg;base64," + imageData.image,
            };
          });
          setPrevImages(updatedImages);
          setImages(updatedImages);
        }
      } catch (error) {
        console.log("Error: ", error);
      }

      // Fetch images from /api/createAcc/getProfileImg
      try {
        const res = await fetch("/api/createAcc/getProfileImg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("currentUserViewed"),
          }),
        });
        const data = await res.json();
        if (data.error) {
          console.log("Error: ", data.error);
          setImageUrl(null);
        } else {
          setImageUrl("data:image/jpeg;base64," + data.image);
          setBackup("data:image/jpeg;base64," + data.backup);
          if (data.privacy === "yes") {
            setIsBlurred(true);
          }
          //Also Set the image to the state
          setImage(data.image);
        }
        setLoading(true);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    getImg();
  }, [userInfo]);

  const handleImageRefLoaded = (index) => {
    const imageRef = imageRefs.current[index];
    // Do nothing if the imageRef is already set
    if (imageRef) return;

    // Set the imageRef once it's loaded
    imageRefs.current[index] = imageRef;
  };

  const imgs = userInfo.gender == "female" ? "/female.jpeg" : "/man.jpg";
  return (
    <div>
      <div className="public-contianer-photoEdit">
        {images.length > 0 ? (
          images.map((image, index) => (
            <div key={index}>
              <div>
                <canvas
                  ref={(ref) => (imageRefs.current[index] = ref)}
                  width={100}
                  height={100}
                  style={{
                    border: "1px solid black",
                    display: "none",
                  }}
                ></canvas>

                <div>
                  <ImageSlider
                    width={150}
                    height={150}
                    images={[
                      access ? image.backup || imgs : image.imageUrl || imgs,
                      access ? backup || imgs : imageUrl || imgs,
                    ]}
                    showBullets={false}
                    showNavs={true}
                    navMargin={-5}
                    navSize={30}
                    color={"red"}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <NextImage
              src={userInfo.gender == "female" ? "/female.jpeg" : "/man.jpg"}
              width={150}
              height={150}
              style={{ border: "1px solid black" }}
              alt="Female Placeholder"
            />
          </div>
        )}
      </div>
    </div>
  );
}
