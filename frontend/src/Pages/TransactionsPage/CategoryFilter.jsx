import { useState, useEffect, useRef } from "react";

export default function CategoryFilter({ 
  selectedCategory, setCategory, filterType, darkMode, 
  isFilterMenuOpen, setIsFilterMenuOpen 
}) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const incomeCategories = ["All", "Salary", "Freelance", "Interest", "Investments", "Allowance", "Bonus", "Petty Cash", "Other"];
    const expenseCategories = ["All", "Food", "Shopping", "Transport", "Utilities", "Rent", "Entertainment", "Health", "Education", "Other"];
    const categories = filterType === "income" ? incomeCategories : expenseCategories;

    useEffect(() => {
        setCategory("All");
    }, [filterType, setCategory]);

    // Close dropdowns when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Dropdown Button */}
            <button
                onClick={() => {
                    setIsOpen(!isOpen);
                    setIsFilterMenuOpen(false); // Close the Type dropdown
                }}
                className={`px-4 py-3 duration-300 shadow-sm shadow-black rounded-lg flex items-center gap-2 
        ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-300'}`}
            >
                <span>{selectedCategory || "Select Category"}</span>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className={`absolute right-0 top-15  w-44 rounded-lg shadow-lg z-10 
        ${darkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-900'} 
        max-h-[250px] overflow-y-auto duration-300 shadow-sm shadow-black border-gray-600`}>
                    <ul className="space-y-1 m-1">
                        {categories.map((category) => (
                            <li key={category}
                                className={`px-4 py-2 mt-0.5 cursor-pointer capitalize rounded-lg 
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
