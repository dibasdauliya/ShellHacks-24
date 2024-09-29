import { MobileHomeScreen } from "@/components/mobile-home-screen";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function App() {
  const [isChildren, setIsChildren] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    if (accessToken !== "undefined" && accessToken !== null) {
      setIsChildren(true);
      setLoading(false);
    } else {
      setIsChildren(false);
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (isChildren) {
    return <MobileHomeScreen />;
  } else {
    navigate("/dashboard");
    return null;
  }
}

export default App;
