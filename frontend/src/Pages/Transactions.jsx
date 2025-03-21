import { useTheme } from "../Components/ThemeContext";
import NavBar from "../Components/NavBar"; 
import Button from "../Components/Button";
import { useState } from "react";
import { FiPlus, FiChevronLeft, FiChevronRight, FiMenu } from "react-icons/fi";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function TransactionsPage() {
  const { darkMode } = useTheme();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar state

  const handlePrevMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 0 ? 11 : prev - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => (prev === 11 ? 0 : prev + 1));
  };

  return (
    <div className={`relative flex flex-col h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      
      <NavBar />

      {/* Financial Overview */}
      <div className={`flex justify-around py-4 mt-22 mx-4 rounded-lg shadow-md shadow-gray-600 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div className="text-center">
          <p className="text-lg font-bold text-blue-500">Income</p>
          <p className="text-xl font-extrabold">₹1,50,000.00</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-red-500">Expenses</p>
          <p className="text-xl font-extrabold">₹50,000.00</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold">Total</p>
          <p className="text-xl font-extrabold">₹1,00,000.00</p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 mt-4">

        {/* Sidebar Toggle (Mobile View) */}
        <button className="fixed top-24 left-4 p-2 bg-indigo-500 text-white rounded-lg shadow-md lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FiMenu className="text-2xl" />
        </button>

        {/* Sidebar */}
        <div className={`fixed left-4 top-[calc(7rem+4.5rem)] h-[73vh] transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} w-56 p-5 rounded-lg shadow-md shadow-gray-600 flex flex-col justify-between ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} lg:translate-x-0`}>
          
          {/* Month Selector */}
          <div className="flex items-center justify-between mb-6">
            <FiChevronLeft className="cursor-pointer text-xl hover:text-indigo-500" onClick={handlePrevMonth} />
            <p className="text-lg font-semibold">{monthNames[currentMonthIndex]} 2025</p>
            <FiChevronRight className="cursor-pointer text-xl hover:text-indigo-500" onClick={handleNextMonth} />
          </div>

          {/* Sidebar Options */}
          <ul className="space-y-6 text-lg font-medium">
            <li className="cursor-pointer p-2 rounded-lg transition-all duration-200 hover:bg-indigo-500 hover:text-white">Daily</li>
            <li className="cursor-pointer p-2 rounded-lg transition-all duration-200 hover:bg-indigo-500 hover:text-white">Monthly</li>
            <li className="cursor-pointer p-2 rounded-lg transition-all duration-200 hover:bg-indigo-500 hover:text-white">Calendar</li>
          </ul>

          {/* Add Button Inside Sidebar */}
          <Button text=" + Add " />
        </div>

        {/* Main Content (With Sidebar Offset) */}
        <div className={`flex-1 p-6 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 overflow-y-auto`}>
          <p className="text-center text-lg">Transaction details go here...</p>
        </div>
      </div>

      {/* Floating Add Button (For Mobile Only) */}
      <button className="fixed bottom-6 right-6 bg-indigo-500 text-white p-4 rounded-lg shadow-lg md:hidden">
        <FiPlus className="text-2xl" />
      </button>

    </div>
  );
}
