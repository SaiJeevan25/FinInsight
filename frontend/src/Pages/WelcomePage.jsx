import { useState, useEffect } from "react";
import { useTheme } from "../Components/ThemeContext";
import { Star } from "lucide-react";

import Button from "../Components/Button";
import BarAnimation from "../Components/Animations/BarAnimation";
import Logo from "../Components/Logo";
import BgToggle from "../Components/BgToggle";

export default function WelcomePage() {
  const { darkMode, setDarkMode } = useTheme();
  const [showContent, setShowContent] = useState(false);
  const [showBadge, setShowBadge] = useState(false);
  
  useEffect(() => {
    // Staggered animation
    setTimeout(() => setShowContent(true), 400);
    setTimeout(() => setShowBadge(true), 800);
  }, []);

  return (
    <div className={`relative h-screen overflow-hidden duration-500 ${
      darkMode 
        ? 'bg-black text-white' 
        : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 text-gray-900'
    }`}>
      <div className="absolute z-20 top-6 w-full flex items-center justify-between px-8">
        <Logo />
        <BgToggle />
      </div>

      <div className={`absolute w-[800px] h-[800px] rounded-full blur-3xl opacity-20 -top-1/4 -right-1/4 ${
        darkMode ? 'bg-indigo-600' : 'bg-indigo-400'
      }`} />
      
      <BarAnimation />

      <div className="relative z-10 flex flex-col h-full justify-center items-center px-6">
        <div className={`transform transition-all duration-700 ease-out ${
          showContent ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>          

          <div className={`backdrop-blur-md p-8 rounded-2xl max-w-2xl ${
            darkMode 
              ? 'bg-gray-900/40 shadow-lg shadow-indigo-500/10 border border-gray-800' 
              : 'bg-white/70 shadow-xl shadow-indigo-200/30'
          }`}>

            <div className="text-center">
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight tracking-tight">
              <span className={`bg-clip-text text-transparent ${
                  darkMode ? 'bg-gradient-to-r from-indigo-400 to-indigo-500' : 'bg-gradient-to-r from-indigo-600 to-indigo-400'
                }`}>
                  Fin
                </span>
                <span className={darkMode ? 'text-gray-200' : 'text-gray-900'}>
                  Insight
                </span>
              </h1>
              <p className={`mt-4 text-xl md:text-2xl font-light ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                AI-Powered Financial Clarity
              </p>
            </div>


            <p className={`mt-6 text-lg text-center max-w-xl mx-auto ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Discover your <span className="text-indigo-500 font-medium">spending patterns</span> through vibrant dashboards. 
              Experience <span className="text-indigo-500 font-medium">AI-driven insights</span> that help you save smarter.
            </p>

            <div className="mt-10 flex flex-col items-center">
              <p className="flex flex-col justify-center items-center text-xl text-indigo-500 font-bold mb-4">
                Get Started For Free
              </p>
              <div className="flex py-4 gap-4">
                <Button text="Log In" func={() => window.location.href = "/login"} />
                <Button func={() => window.location.href = "/signup"} text="Sign Up" />
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
}