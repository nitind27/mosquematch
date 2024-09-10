import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PictureProfile from "./picture";

export default function BasicEdit() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const { push } = useRouter();

  //-------------Api to retrieve username------------------
  useEffect(() => {
    const fetchData = async () => {
      const email1 = localStorage.getItem("email");
      if (email1 === "" || !email1 || email1 === null) {
        console.log("Email 1 empty");
        return;
      }
      setEmail(email1);
      try {
        const res = await fetch("/api/message/getUsername", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email1 }),
        });
        if (!res.ok) {
          const errorMessage = await res.json();
          console.error("Error if:", errorMessage.error);
          return;
        }
        const response = await res.json();

        const fullName = response.user.split(" ");

        setFirstName(fullName[0]);
        setLastName(fullName[1]);
      } catch (error) {
        console.error("Error on first try fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  //-------------^^^^^^^^^^^^^^^^^^^^------------------

  //-------------Api to update username------------------

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Name: ", newFirstName, newLastName);

    const newName = newFirstName + " " + newLastName;

    try {
      const res = await fetch("/api/update/username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, name: newName }),
      });
      if (!res.ok) {
        const errorMessage = await res.json();
        console.error("Error if:", errorMessage.error);
        return;
      }
      const response = await res.json();
      if (response.message === "success") {
        setFirstName(newFirstName);
        setLastName(newLastName);
        alert("Username updated successfully");
      }
    } catch (error) {
      console.log(
        "Error on handleSubmit basicEdit.js in profile:",
        error.message
      );
    }
  };

  //-------------^^^^^^^^^^^^^^^^^^^^------------------

  return (
    <div className="basic-edit-container-basicEdit">
      <div className="container-heading-basicEdit">Basic Information</div>
      <div className="horizontal-seprator-edit"></div>

      <div className="firstName-basicEdit">
        <div className="first-basicEdit">First Name</div>
        <input
          type="text"
          placeholder={firstName}
          className="input-first-basicEdit"
          onChange={(e) => setNewFirstName(e.target.value)}
        />
        <div className="second-basicEdit">Last Name</div>
        <input
          type="text"
          placeholder={lastName}
          className="input-first-basicEdit"
          onChange={(e) => setNewLastName(e.target.value)}
        />
        <button className="save-basicEdit" onClick={(e) => handleSubmit(e)}>
          Save Changes
        </button>
      </div>
    </div>
  );
}
