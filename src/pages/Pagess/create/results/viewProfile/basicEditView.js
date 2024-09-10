import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function BasicEditView({ data }) {
  const [firstName, setFirstName] = useState("");
  const router = useRouter();
  const { push } = useRouter();

  // Get the user info from the query parameters
  useEffect(() => {
    if (data) {
      setFirstName(data);
    } else {
      console.error("userInfo is not defined in query parameters");
    }
  }, [router.query]);

  return (
    <div>
      <div className="container-heading-basicEdit">Basic Information</div>
      <div className="horizontal-seprator-edit"></div>

      <div className="firstName-basicEdit">
        <div className="first-basicEdit">First Name</div>
        <input
          value={data}
          type="text"
          className="input-first-basicEdit"
          readOnly
        />
      </div>
    </div>
  );
}
