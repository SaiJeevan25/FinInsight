import { useTheme } from "../Components/ThemeContext";
import NavBar from "../Components/NavBar"; 
import { useState } from "react";
import TransactionsPage from "./Transactions";
import StatsPage from "./Stats";
import ProfilePage from "./Profile";

export default function Dashboard() {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("Transactions");

  return (
    <div className={`relative flex flex-col  min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <NavBar activeTab = {activeTab} setActiveTab={setActiveTab}/>
      {activeTab === "Transactions" && <TransactionsPage/>}
      {activeTab === "Stats" && <StatsPage/>}
      {activeTab === "Profile" && <ProfilePage/>}
      
    </div>
  );
}
