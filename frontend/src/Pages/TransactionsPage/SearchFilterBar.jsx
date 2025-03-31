import { useState, useEffect, useRef } from "react";
import { FiSearch, FiFilter, FiArrowUp, FiArrowDown } from "react-icons/fi";
import CategoryFilter from "./CategoryFilter";

export default function SearchFilterBar({
  searchTerm, handleSearch, filterType, setFilter,
  selectedCategory, setCategory, darkMode, order, setOrder, dateVisibility,
}) {
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef(null);

  // Close filter menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setIsFilterMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="mb-5 flex gap-1.5 md:gap-3 text-xs md:text-lg items-center  rounded-xl">
      {/* Search Bar */}
      <div className={`relative flex-grow rounded-lg overflow-hidden shadow-sm shadow-black ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={handleSearch}
          className={`w-full p-3 pl-10 pr-3 outline-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`}
        />
      </div>

      {/* Filter by Type */}
      <div className="relative" ref={filterMenuRef}>
        <button
          onClick={() => {
            setIsFilterMenuOpen(!isFilterMenuOpen);
          }}
          className={`px-4 py-3 rounded-lg duration-300 shadow-sm shadow-black flex items-center gap-2 
          ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          <FiFilter />
          <span>{filterType === "all" ? "All" : filterType === "income" ? "Income" : "Expenses"}</span>
        </button>

        {/* Dropdown Menu */}
        {isFilterMenuOpen && (
          <div className={`absolute shadow-lg shadow-black  right-0 mt-2 w-40 rounded-lg  z-10 
          ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} 
          max-h-[200px] overflow-y-auto  border-gray-300 dark:border-gray-600`}>
            <ul>
              {["all", "income", "expense"].map(type => (
                <li
                  key={type}
                  className={`px-4 py-2 cursor-pointer capitalize rounded-lg 
                  ${filterType === type ? `${darkMode ? 'bg-indigo-600' : 'bg-indigo-500'} text-white` : 'hover:bg-gray-400 hover:text-black'}`}
                  onClick={() => {
                    setFilter(type);
                    setIsFilterMenuOpen(false);
                  }}
                >
                  {type}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {filterType !== "all" && (
        <CategoryFilter
          selectedCategory={selectedCategory}
          setCategory={setCategory}
          filterType={filterType}
          darkMode={darkMode}
          isFilterMenuOpen={isFilterMenuOpen}
          setIsFilterMenuOpen={setIsFilterMenuOpen}
        />
      )}
      { dateVisibility &&
      <div>
          <button
            onClick={() => setOrder(prevOrder => !prevOrder)}
            className={`px-4 py-3 rounded-lg flex items-center gap-2 duration-300 shadow-sm shadow-black 
                ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
          >
            Date {order ? <FiArrowDown /> : <FiArrowUp />}
          </button>
      </div> 
      }
    </div>
  );
} 