import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function WelcomePage() {
  const [points, setPoints] = useState([]);
  const [bars, setBars] = useState(new Array(20).fill(50));
  const [darkMode, setDarkMode] = useState(false);


  useEffect(() => {
      const generatePoints = () => {
        const newPoints = Array.from({ length: 25 }, (_, i) => ({
          x: i * 4 + 5,
          y: Math.random() * 50 + 20,
          delay: i * 0.2,
        }));
        setPoints(newPoints);
      };
      generatePoints();
  
      const interval = setInterval(() => {
        setBars(bars.map(() => Math.random() * 70 + 20));
      }, 900);
      return () => clearInterval(interval);
    }, [bars]);
  

  return (
    <div className={`relative flex flex-col lg:flex-row justify-center items-center h-screen overflow-hidden duration-300 px-6 ${darkMode ? 'bg-black text-white' : 'bg-white text-gray-900'}`}>

      <button
        className={`absolute z-20 top-2 right-2 md:top-6 md:right-6 px-4 py-2 text-lg font-bold cursor-pointer rounded-lg shadow-sm transition ${darkMode ? 'bg-gray-900 shadow-gray-400 ' : 'bg-gray-200 shadow-gray-900 '}`}
        onClick={() => setDarkMode(!darkMode)}
      >
        {darkMode ?
          <i className="fa-solid fa-sun "></i>
          :

          <i className="fa-solid fa-moon capitalize"></i>}
      </button>

      <div className="absolute inset-0 flex items-end justify-center gap-2 opacity-20">
        {bars.map((height, index) => (
          <motion.div
            key={index}
            className={`w-2  md:mx-3 md:w-6 rounded ${darkMode ? 'bg-indigo-300' : 'bg-indigo-900'}`}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />
        ))}
      </div>


      <div className="absolute inset-0">
        {points.map((point, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-indigo-400 rounded-full shadow-lg"
            style={{ left: `${point.x}%`, bottom: `${point.y}%` }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1.2 }}
            transition={{ duration: 1, delay: point.delay, repeat: Infinity, repeatType: "reverse" }}
          />
        ))}
      </div>

      <div className={`flex flex-col gap-10 items-center justify-center backdrop-blur-md p-6 rounded-xl bg-gray-100 shadow-lg border border-gray-300 ${darkMode ? 'bg-gray-800 text-white shadow-gray-600' : 'bg-white shadow-black text-gray-900'}`}>
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold text-indigo-500">
            FinInsight
          </h1>
          <p className={`mt-4 text-lg md:text-2xl text-gray-700 font-light ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            AI-Powered Financial Clarity
          </p>
        </div>
        <p className={`text-lg text-center text-gray-700 max-w-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          FinInsight uses AI to categorize expenses from bank statements and receipts. Track spending trends with interactive charts and personalized insights. Securely access reports across devices for smarter budgeting.
        </p>
        <div>
          <p className="flex flex-col justify-center items-center text-2xl text-indigo-500 font-extrabold">Get Started For Free</p>
          <div className="flex py-6 gap-4">
            <button className="border px-6 py-3 text-lg md:text-xl cursor-pointer rounded-xl font-extrabold text-indigo-500 hover:bg-indigo-500 hover:text-white transition">
              Log In
            </button>
            <button className="border px-6 py-3 text-lg md:text-xl cursor-pointer rounded-xl font-extrabold text-indigo-500 hover:bg-indigo-500 hover:text-white transition">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
