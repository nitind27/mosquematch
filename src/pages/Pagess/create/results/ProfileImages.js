import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useRef } from "react";

// import PictureProfile from "./picture";
import * as StackBlur from "stackblur-canvas";

import { Draggable } from "react-beautiful-dnd";
export default function ProfileImages() {
  const { push } = useRouter();
  const [t, i18n] = useTranslation("global");

  // const StackBlur = require("stackblur-canvas");

  const [email, setEmail] = useState("");
  const [images, setImages] = useState([
    { imageUrl: null, isBlurred: false, backup: null, imageBase64: "" },
  ]);

  //----------Storing input data in state----------------
  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState(null);
  const imageRefs = useRef([]);
  const [msg, setMsg] = useState("");
  const [prevImages, setPrevImages] = useState([]);

  //-----------------^^^^^^^^^^--------------------------

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
    var getImg = async () => {
      try {
        const res = await fetch("/api/update/getProfileImgPublic", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("email"),
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
        // setLoading(true);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    getImg();
  }, []);




  //------------------BLUR 1------------------



  const handleImageRefLoaded = (index) => {
    const imageRef = imageRefs.current[index];
    // Do nothing if the imageRef is already set
    if (imageRef) return;

    // Set the imageRef once it's loaded
    imageRefs.current[index] = imageRef;
  };


  return (
    <div style={{ paddingBottom: "40px" }}>
      <div className="picture-container-basicEdit">
        
        <div className="img-container-basicEdit">
          <PictureProfile />
        </div>
      </div>
      <div className="public-contianer-photoEdit">
        <label className="input-image-photoEdit">
        
        </label>
        {images.map((image, index) => (
          <div key={index}>
            {image.imageUrl && loading ? (
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

                <img
                  ref={(ref) => (imageRefs.current[index] = ref)}
                  src={image.imageUrl || "/female.jpeg"}
                  width={100}
                  height={100}
                  alt=""
                  onLoad={() => handleImageRefLoaded(index)}
                />
            
               
              </div>
            ) : (
              image.imageUrl && (
                <div className="loader">
                  <div></div>
                </div>
              )
            )}
          </div>
        ))}
      </div>

     
    </div>
  );
}

export function PictureProfile() {
  // const StackBlur = require("stackblur-canvas");

  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [isBlurred, setIsBlurred] = useState(false);
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [backup, setBackup] = useState(null);
  const [uploadBlur, setUploadBlur] = useState(null);

  useEffect(() => {
    setEmail(localStorage.getItem("email"));
    var getImg = async () => {
      try {
        const res = await fetch("/api/createAcc/getProfileImg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: localStorage.getItem("email"),
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
          //Adso Set the image to the state
          setImage(data.image);
        }
        setLoading(true);
      } catch (error) {
        console.log("Error: ", error);
      }
    };
    getImg();
  }, []);


 
  return (
    <div>
          <canvas
            ref={canvasRef}
            width={100}
            height={100}
            style={{
              border: "1px solid black",
              display: "none",
            }}
          ></canvas>

          <img
            ref={imageRef}
            src={imageUrl ? imageUrl : "/female.jpeg"}
            width={100}
            height={100}
            alt=""
          />
        
        </div>
     
  );
}
