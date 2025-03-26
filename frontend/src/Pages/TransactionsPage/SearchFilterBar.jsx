import { FiSearch, FiFilter } from "react-icons/fi";
import CategoryFilter from "./CategoryFilter";

export default function SearchFilterBar({ 
  searchTerm, handleSearch, filterType, setFilter, 
  selectedCategory, setCategory, isFilterMenuOpen, toggleFilterMenu, darkMode 
}) {
  return (
    <div className="mb-6 flex gap-4 items-center">
      {/* Search Bar */}
      <div className={`flex-grow relative rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={handleSearch}
          className={`w-full p-3 pl-10 pr-4 outline-none ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'}`}
        />
        <FiSearch className="absolute left-3 top-3.5 text-gray-500" />
      </div>

      {/* Filter by Type */}
      <div className="relative">
        <button onClick={toggleFilterMenu} 
          className={`px-4 py-3 rounded-lg flex items-center gap-2 
          ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
        >
          <FiFilter />
          <span>{filterType === "all" ? "All" : filterType === "income" ? "Income" : "Expenses"}</span>
        </button>

        {isFilterMenuOpen && (
          <div className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-10 
          ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}>
            <ul>
              {["all", "income", "expense"].map(type => (
                <li key={type} 
                  className={`px-4 py-2 cursor-pointer capitalize rounded-lg 
                  ${filterType === type ? `${darkMode ? 'bg-indigo-600' : 'bg-indigo-500'} text-white` : 'hover:bg-gray-400 hover:text-black'}`} 
                  onClick={() => setFilter(type)}
                >
                  {type}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Category Filter */}
      {filterType !== "all" && (
        <CategoryFilter 
          selectedCategory={selectedCategory} 
          setCategory={setCategory} 
          filterType={filterType} 
          darkMode={darkMode} 
        />
      )}
    </div>
  );
}
