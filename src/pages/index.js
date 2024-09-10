import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { push } = useRouter();

  useEffect(() => {
    push("/Pagess/HomePage/home");
  }, []);

  return (
    <div>
      <div>Loading...</div>
    </div>
  );
}
