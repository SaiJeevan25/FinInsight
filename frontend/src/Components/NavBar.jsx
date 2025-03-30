import { useTheme } from "../Components/ThemeContext";
import Logo from "../Components/Logo";
import BgToggle from "../Components/BgToggle";
import { useState } from "react";
import { FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function NavBar({ activeTab, setActiveTab, userName }) { 
  const { darkMode } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const navItems = ["Transactions", "Stats", "Profile"]; 
  const navigate = useNavigate();

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
    <div className={`fixed top-2 left-4 right-4 rounded-xl flex items-center justify-between px-6 py-3 shadow-sm shadow-indigo-500 z-50 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} transition-all duration-300`}>
      
      <div className="flex items-center gap-4">
        <Logo />
        <p className="text-md font-medium">({userName})</p>
      </div>

      <div className="hidden md:flex gap-6">
        {navItems.map((item) => (
          <p
            key={item}
            className={`cursor-pointer text-lg hover:text-indigo-500 ${
              activeTab === item ? 'font-extrabold text-indigo-500 underline' : 'font-medium'
            }`}
            onClick={() => {
              console.log("Switching to:", item); 
              setActiveTab(item); 
            }}
          >
            {item}
          </p>
        ))}
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={handleLogout}
          disabled={loading}
          className="flex cursor-pointer items-center gap-2 text-red-500 hover:text-red-600 transition-colors duration-300"
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
            <p
              key={item}
              className={`cursor-pointer text-lg transition-all duration-300 hover:text-indigo-500 ${
                activeTab === item ? 'font-extrabold text-indigo-500' : 'font-medium'
              }`}
              onClick={() => {
                console.log("Switching to:", item); 
                setActiveTab(item);
                setMenuOpen(false); 
              }}
            >
              {item}
            </p>
          ))}
          
          <button
            className="cursor-pointer text-lg border-none text-red-500 hover:text-red-600 transition-colors duration-300"
            onClick={() => {
              if (!loading) {
                handleLogout();
                setMenuOpen(false);
              }
            }}
          >
            {loading ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      )}
    </div>
  );
}