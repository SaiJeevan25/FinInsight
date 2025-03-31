import { useEffect, useState } from "react";
import { useTheme } from "../Components/ThemeContext";
import NavBar from "../Components/NavBar"; 
import TransactionsPage from "./Transactions";
import StatsPage from "./Stats";
import ProfilePage from "./Profile";
import LoadingSpinner from "../Components/LoadingSpinner";

export default function Dashboard() {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("Transactions");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      setError("");
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8000/api/user/profile", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Failed to fetch user data");

        setUser(data); // Store user data in state
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <LoadingSpinner />; 
  if (error) return <div className="text-center text-red-500 mt-10">{error}</div>;
  return (
    <div className={`relative flex flex-col min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <NavBar activeTab={activeTab} setActiveTab={setActiveTab} userName={user.firstName} />
      {activeTab === "Transactions" && <TransactionsPage user={user} />}
      {activeTab === "Stats" && <StatsPage user={user} />}
      {activeTab === "Profile" && <ProfilePage user={user} />}
    </div>
  );
}
