import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import Button from "../../Components/Button";

export default function Sidebar({ 
  sidebarOpen, 
  currentMonthIndex, 
  currentYear, 
  currentDate,
  handlePrev, 
  handleNext, 
  viewMode, 
  handleViewModeChange, 
  darkMode, 
  setIsAddModalOpen 
}) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className={` ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} fixed lg:sticky lg:top-0 left-0 w-56 p-5 rounded-lg shadow-sm  shadow-black flex flex-col justify-between max-h-[calc(7rem+4.5rem)] min-h-[18rem] lg:min-h-[23rem] ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} transition-all duration-300 z-20 lg:translate-x-0 my-[1.43rem] mx-4`}>
      <div>
        {/* Date/Month/Year Navigator */}
        <div className="flex items-center justify-between mb-6">
          <FiChevronLeft className="cursor-pointer text-xl hover:text-indigo-500" onClick={handlePrev} />
          <div className="flex items-center gap-1">
            <FiCalendar className="text-indigo-500" />
            <p style={{ }} className="text-sm md:text-md lg:text-lg text-center  font-semibold">
              {viewMode === "Daily"
                ? `${currentDate.getDate()} ${monthNames[currentMonthIndex]} ${currentYear}`
                : viewMode === "Month"
                ? `${monthNames[currentMonthIndex]} ${currentYear}`
                : `${currentYear}`}
            </p>
          </div>
          <FiChevronRight className="cursor-pointer text-xl hover:text-indigo-500" onClick={handleNext} />
        </div>

        {/* View Mode Options */}
        <ul className="space-y-3 text-lg font-medium " style={{}} >
          {["Daily", "Month", "Year"].map(mode => (
            <li
              key={mode}
              className={`cursor-pointer p-2 rounded-lg ${viewMode === mode ? `${darkMode ? 'bg-indigo-600' : 'bg-indigo-500'} text-white` : 'hover:bg-indigo-500 hover:text-white'}`}
              onClick={() => handleViewModeChange(mode)}
            >
              {mode}
            </li>
          ))}
        </ul>
      </div>

      {/* Add Transaction Button */}
      <div className="hidden lg:block " >
        <Button text="+ Add Transaction" func={() => setIsAddModalOpen(true)} className="w-full mt-2" />
      </div>
    </div>
  );
}
