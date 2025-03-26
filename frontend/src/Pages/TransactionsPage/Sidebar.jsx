import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import Button from "../../Components/Button";

export default function Sidebar({sidebarOpen, currentMonthIndex, currentYear, handlePrevMonth, handleNextMonth, viewMode, handleViewModeChange, darkMode, setIsAddModalOpen }) {
  const monthNames = ["Jan", "Feb", "March", "April", "May", "June", "July", "August", "Sept", "October", "Nov", "Dec"];

  return (
    <div className={` ${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} fixed md:sticky md:top-0 left-0 w-56 p-5 rounded-lg shadow-md flex flex-col justify-between h-auto min-h-[22rem] ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} transition-all duration-300 z-20 md:translate-x-0 my-4 mx-4`}>
      <div>
        {/* Month Navigator */}
        <div className="flex items-center justify-between mb-6">
          <FiChevronLeft className="cursor-pointer text-xl hover:text-indigo-500" onClick={handlePrevMonth} />
          <div className="flex items-center gap-1">
            <FiCalendar className="text-indigo-500" />
            <p className="text-sm md:text-md lg:text-lg font-semibold">{monthNames[currentMonthIndex]} {currentYear}</p>
          </div>
          <FiChevronRight className="cursor-pointer text-xl hover:text-indigo-500" onClick={handleNextMonth} />
        </div>

        {/* View Mode Options */}
        <ul className="space-y-3 text-lg font-medium">
          {["Daily", "Monthly", "Yearly"].map(mode => (
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
      <div className="hidden md:block">
        <Button text="+ Add Transaction" func={() => setIsAddModalOpen(true)} className="w-full" />
      </div>
    </div>
  );
}
