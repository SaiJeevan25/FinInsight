import { FiChevronLeft, FiChevronRight, FiCalendar } from "react-icons/fi";
import Button from "../../Components/Button";

export default function Sidebar({ 
  sidebarOpen,  
  currentDate,
  handlePrev, 
  handleNext, 
  viewMode, 
  handleViewModeChange, 
  darkMode, 
  setIsAddModalOpen,
  getFormattedDateForDisplay
}) {
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];
  return (
    <div className={` ${sidebarOpen ? 'translate-x-2' : '-translate-x-74'} fixed lg:sticky lg:top-0 left-0 py-2 px-4 rounded-lg shadow-sm   flex flex-col shadow-indigo-500 justify-evenly max-h-[calc(7rem+4.5rem)] min-h-[19rem] lg:min-h-[25rem]  ${darkMode ? 'bg-gray-900 text-white ' : 'bg-white text-gray-900'} transition-all duration-300 z-20 lg:translate-x-0 my-[1.43rem] mx-4`}>
      <div className="space-y-4">
        {/* Date/Month/Year Navigator */}
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Date</h3>
            <div className={`flex items-center justify-between p-2 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              <button 
                onClick={handlePrev}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                &lt;
              </button>
              <p style={{ }} className="text-sm md:text-md lg:text-lg text-center  font-semibold">
              {viewMode === "Daily"
                ? `${currentDate.getDate()} ${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                : viewMode === "Month"
                ? `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`
                : `${currentDate.getFullYear()}`}
              </p>
              <button 
                onClick={handleNext}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                }`}
              >
                &gt;
              </button>
            </div>
          </div>
        {/* View Mode Options */}
        <div className="space-y-3">
            <h3 className="text-lg font-medium">View Mode</h3>
            <div className={`flex flex-col  gap-2 p-1 w-full rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-gray-200'
            }`}>
              {["Daily", "Month", "Year"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleViewModeChange(mode)}
                  className={`py-2 px-3 rounded-lg text-center text-sm transition-colors ${
                    viewMode === mode 
                      ? `${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'}`
                      : `${darkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
      </div>

      {/* Add Transaction Button */}
      <div className="hidden lg:block mt-4" >
        <Button text="+ Add Transaction" func={() => setIsAddModalOpen(true)} className="w-full" />
      </div>
    </div>
  );
}