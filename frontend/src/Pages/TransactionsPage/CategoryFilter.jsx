import { useState, useEffect } from "react";

export default function CategoryFilter({ selectedCategory, setCategory, filterType, darkMode }) {
  const [isOpen, setIsOpen] = useState(false);

  const incomeCategories = ["All", "Salary", "Freelance", "Interest", "Investments","Allowance", "Bonus", "Petty Cash", "Other"];
  const expenseCategories = ["All", "Food", "Shopping", "Transport", "Utilities", "Rent", "Entertainment", "Health", "Education", "Other"];

  const categories = filterType === "income" ? incomeCategories : expenseCategories;

  useEffect(() => {
    setCategory("All");
  }, [filterType, setCategory]);

  return (
    <div className="relative ">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className={`px-4 py-3 rounded-lg flex items-center gap-2 
        ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
      >
        <span>{selectedCategory || "Select Category"}</span>
      </button>

      {isOpen && (
        <div className={`absolute right-0 mt-2 w-40 rounded-lg shadow-lg z-10 
        ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-gray-900'}`}>
          <ul>
            {categories.map((category) => (
              <li key={category} 
                className={`px-4 py-2 cursor-pointer capitalize rounded-lg 
                ${selectedCategory === category ? `${darkMode ? 'bg-indigo-600' : 'bg-indigo-500'} text-white` : 'hover:bg-gray-400 hover:text-black'}`} 
                onClick={() => {
                  setCategory(category);
                  setIsOpen(false);
                }}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
