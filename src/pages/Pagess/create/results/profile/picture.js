import { useEffect, useState, useRef } from "react";
import NextImage from "next/image";
import * as StackBlur from "stackblur-canvas";

export default function PictureProfile() {
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
  const handleImageChange = (e) => {
    setMsg("");
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        let width = img.width;
        let height = img.height;

        if (width > 100 || height > 100) {
          if (width > height) {
            height *= 100 / width;
            width = 100;
          } else {
            width *= 100 / height;
            height = 100;
          }
        }
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        const resizedBase64 = canvas.toDataURL("image/jpeg");
        setImageUrl(resizedBase64);
        setBackup(resizedBase64);
        setImageBase64(resizedBase64.split(",")[1]);
      };

      img.src = reader.result;
    };

    reader.readAsDataURL(file);
  };
  const handleUpload = async () => {
    setMsg("Updating.....");
    let imageToUpload = "";
    let privacy = "";
    let type = "profile";
    let backupToSend = backup.split(",")[1];

    if (isBlurred) {
      imageToUpload = uploadBlur;
      privacy = "yes";
    } else {
      imageToUpload = imageUrl.split(",")[1];
      privacy = "no";
    }

    if (imageUrl == null) {
      setMsg("Error: Cannot Upload Default Image");
      return;
    }
    if (loading && email && email != "") {
      try {
        const res = await fetch("/api/createAcc/setProfileImg", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            type: type,
            privacy: privacy,
            image: imageToUpload,
            backup: backupToSend,
          }),
        });
        const data = await res.json();
        console.log("Data: ", data);
        if (data.error) {
          setMsg("Error: " + data.error);
        } else {
          setMsg("Image uploaded successfully");
        }
      } catch (error) {
        console.log("Error: ", error);
        setMsg("Error: Image not found");
      }
    } else {
      console.log("Image not found");
      setMsg("Error: Image not found");
    }
  };

  const toggleBlur = () => {
    if (imageUrl == null) {
      return;
    }

    setIsBlurred(!isBlurred); // Toggle blur state = true

    const canvas = document.createElement("canvas"); // Create a new canvas element
    const ctx = canvas.getContext("2d");

    // Set canvas width and height
    canvas.width = 100;
    canvas.height = 100;

    // Draw the image onto the canvas
    ctx.drawImage(imageRef.current, 0, 0, 100, 100);

    if (isBlurred === false) {
      canvas.remove();
      // Apply the blur effect if not already blurred
      StackBlur.canvasRGB(canvas, 0, 0, 100, 100, 10); // 10 is the blur radius
      const blurredImageUrl = canvas.toDataURL();
      const saveBlur = canvas.toDataURL("image/jpeg");
      setUploadBlur(saveBlur.split(",")[1]);
      setImageUrl(blurredImageUrl);
    } else {
      setImageUrl(backup);
    }
  };
  return (
    <div>
      {loading ? (
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
          <div className="hide-btn-picture" onClick={toggleBlur}>
            Hide
          </div>
        </div>
      ) : (
        <div className="loader">
          <div></div>
        </div>
      )}
      <div className="file-container-picture">
        {loading && (
          <input
            id="file-input-profile"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        )}
        <label
          className="profile-select-input"
          for="file-input-profile"
        ></label>

        <button onClick={handleUpload} className="profile-add-button">
          Set Image
        </button>
      </div>
      <div>{msg}</div>
    </div>
  );
}
