import { useTheme } from "../Components/ThemeContext";
import Logo from "../Components/Logo";
import BgToggle from "../Components/BgToggle";
import { useState } from "react";
import { FiMenu, FiX } from "react-icons/fi";

export default function NavBar() {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("Transactions");
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = ["Transactions", "Stats", "Accounts", "Profile"];

  return (
    <div className={`fixed top-2 left-4 right-4 rounded-xl  flex items-center justify-between px-6 py-3 shadow-sm shadow-indigo-500 z-50 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} transition-all duration-300`}>
      
      {/* Logo (Always Visible) */}
      <Logo />

      {/* Desktop Navigation (Hidden on Small Screens) */}
      <div className="hidden md:flex gap-6">
        {navItems.map((item) => (
          <p
            key={item}
            className={`cursor-pointer text-lg transition-allduration-300 ${activeTab === item ? 'font-extrabold text-indigo-500 underline' : 'font-medium'}`}
            onClick={() => setActiveTab(item)}
          >
            {item}
          </p>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* BgToggle (Always Visible) */}
      <BgToggle />

      {/* Mobile Menu (Only Shows on Small Screens) */}
      {menuOpen && (
        <div className={`absolute top-16 left-0 w-full bg-opacity-90 shadow-md ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'} flex flex-col items-center py-4 gap-4 md:hidden`}>
          {navItems.map((item) => (
            <p
              key={item}
              className={`cursor-pointer text-lg transition-all  ${activeTab === item ? 'font-extrabold text-indigo-500' : 'font-medium'}`}
              onClick={() => {
                setActiveTab(item);
                setMenuOpen(false); // Close menu on selection
              }}
            >
              {item}
            </p>
          ))}
        </div>
      )}
      
    </div>
  );
}
