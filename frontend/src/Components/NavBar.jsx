import { useTheme } from "../Components/ThemeContext";
import Logo from "../Components/Logo";
import BgToggle from "../Components/BgToggle";
import { useState } from "react";
import { FiMenu, FiX, FiLogOut, FiActivity, FiBarChart2, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function NavBar({ activeTab, setActiveTab, userName }) { 
  const { darkMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const navItems = [
    { name: "Transactions", icon: <FiActivity /> },
    { name: "Stats", icon: <FiBarChart2 /> },
    { name: "Profile", icon: <FiUser /> }
  ];

  const handleLogout = async () => {
    try {
      setLoading(true);
      logout();
    } catch (error) {
      console.error("Logout failed:", error);
      setLoading(false);
    }
  };

  return (
    <div className={`sticky top-0 z-50 mx-2 mt-3 bg-opacity-95 backdrop-blur-sm hover:shadow-lg left-4 right-4 rounded-xl flex items-center justify-between px-6 py-3 shadow-sm shadow-indigo-500 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} transition-all duration-300`}>
      
      <div className="flex items-center gap-4">
        <Logo />
        <p className="text-sm md:text-md font-medium">({userName})</p>
      </div>
      
      <div className="hidden text-lg md:flex gap-6">
        {navItems.map((item) => (
          <div
            key={item.name}
            className={`relative cursor-pointer group`}
            onClick={() => {
              setActiveTab(item.name); 
            }}
          >
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-300 hover:bg-opacity-10 hover:">
             
              <span className={`${
                activeTab === item.name 
                  ? 'font-bold text-indigo-500 '
                  : 'font-medium'
              }`}>
                {item.name}
              </span>
            </div>
            <div className={`absolute bottom-0 left-0 h-0.5 bg-indigo-500 transition-all duration-300 ${
              activeTab === item.name ? 'w-full' : 'w-0 group-hover:w-full '
            }`}></div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={handleLogout}
          disabled={loading}
          className="flex cursor-pointer p-2 rounded-md hover:bg-red-800 hover:text-gray-200 items-center gap-2 text-red-500 transition-colors duration-300"
        >
          <FiLogOut className="hidden md:block text-lg" />
          <span className="hidden sm:inline">{loading ? 'Logging out...' : 'Logout'}</span>
        </button>
        <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
        
        <BgToggle />
      </div>

      {menuOpen && (
        <div className={`absolute top-16 left-0 w-full bg-opacity-90 shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} flex flex-col items-center py-4 gap-4 md:hidden rounded-b-xl`}>
          {navItems.map((item) => (
            <div
              key={item.name}
              className={`flex items-center gap-2 w-4/5 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
                activeTab === item.name 
                  ? darkMode 
                    ? 'bg-gray-700 text-indigo-400' 
                    : 'bg-indigo-50 text-indigo-600'
                  : darkMode
                    ? 'hover:bg-gray-700' 
                    : 'hover:bg-gray-100'
              }`}
              onClick={() => {
                console.log("Switching to:", item.name); 
                setActiveTab(item.name);
                setMenuOpen(false); 
              }}
            >
              <span className={`text-lg ${activeTab === item.name ? 'text-indigo-500' : ''}`}>
                {item.icon}
              </span>
              <span className={`${
                activeTab === item.name ? 'font-bold' : 'font-medium'
              }`}>
                {item.name}
              </span>
            </div>
          ))}
          
          <button
            className="flex items-center gap-2 w-4/5 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900 dark:hover:bg-opacity-20"
            onClick={() => {
              if (!loading) {
                handleLogout();
                setMenuOpen(false);
              }
            }}
          >
            <FiLogOut className="text-lg" />
            <span>{loading ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      )}
    </div>
  );
}