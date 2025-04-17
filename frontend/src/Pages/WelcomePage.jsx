import { useTheme } from "../Components/ThemeContext";

import Button from "../Components/Button";
import BarAnimation from "../Components/Animations/BarAnimation";
import Logo from "../Components/Logo";
import BgToggle from "../Components/BgToggle";

export default function WelcomePage() {
  const { darkMode, setDarkMode } = useTheme();

  return (
    <div className={`relative flex flex-col lg:flex-row justify-center items-center h-screen overflow-hidden duration-300 px-6 ${darkMode ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white' : 'bg-white text-gray-900'}`}>
      <div className='absolute z-20 top-4 w-full flex items-center justify-between px-4'>
        <Logo />
        <BgToggle />
      </div>
      <BarAnimation />

      <div className={`flex flex-col gap-10 items-center justify-center mt-7 backdrop-blur-md p-6 rounded-xl bg-gray-100 shadow-xl   ${darkMode ? 'bg-gray-800 text-white shadow-gray-600' : 'bg-white shadow-black text-gray-900'}`}>
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-indigo-500">
            Fin<span className={`${darkMode ? 'text-gray-400' : "text-gray-700"}`}>Insight</span>
          </h1>
          <p className={`mt-4 text-lg md:text-2xl text-gray-700 font-light ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            AI-Powered Financial Clarity
          </p>
        </div>
        <p className={`text-lg px-4 text-justify text-gray-700 max-w-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Seamlessly track your transactions and stay in control of your finances.
          Discover spending patterns through vibrant, interactive <span className="text-indigo-500">charts</span> and <span className="text-indigo-500">visual dashboards. </span>
          Experience the power of <span className="text-indigo-500">AI-driven</span> insights tailored to help you save smarter and plan better.
        </p>
        <div>
          <p className="flex flex-col justify-center items-center text-2xl text-indigo-500 font-extrabold">Get Started For Free</p>
          <div className="flex py-6 gap-4">
            <Button text="Log In" func={() => window.location.href = "/login"} />
            <Button func={() => window.location.href = "/signup"} text="Sign Up" />
          </div>
        </div>
      </div>
    </div>
  );
}
