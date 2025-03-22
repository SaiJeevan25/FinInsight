import { useTheme } from "../Components/ThemeContext";
import NavBar from "../Components/NavBar";
import Button from "../Components/Button";
import { useState, useEffect } from "react";
import TransactionModal from "../Components/TransactionModel";
import {
  FiPlus,
  FiChevronLeft,
  FiChevronRight,
  FiMenu,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
  FiFilter,
  FiSearch,
  FiDollarSign,
  FiCoffee,
  FiShoppingBag,
  FiHome,
  FiTruck,
  FiMonitor
} from "react-icons/fi";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function TransactionsPage() {
  const { darkMode } = useTheme();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [viewMode, setViewMode] = useState("Daily");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [savingsTotal, setSavingsTotal] = useState(0);

  // Fetch transactions from backend (to be implemented)
  useEffect(() => {
    // Replace with actual API call when backend is connected
    // fetchTransactions(currentMonthIndex, currentYear);
  }, [currentMonthIndex, currentYear]);

  // Calculate totals whenever transactions change
  useEffect(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {
      // Remove currency symbol and convert to number
      const amount = parseFloat(transaction.amount.replace(/[^\d.-]/g, ''));

      if (transaction.type === 'income') {
        income += amount;
      } else {
        expense += amount;
      }
    });

    setIncomeTotal(income);
    setExpenseTotal(expense);
    setSavingsTotal(income - expense);
  }, [transactions]);

  const handlePrevMonth = () => {
    setCurrentMonthIndex((prev) => {
      if (prev === 0) {
        setCurrentYear(year => year);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonthIndex((prev) => {
      if (prev === 11) {
        setCurrentYear(year => year );
        return 0;
      }
      return prev + 1;
    });
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen);
  };

  const setFilter = (type) => {
    setFilterType(type);
    setIsFilterMenuOpen(false);
  };

  // Filter transactions based on searchTerm and filterType
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Function to handle view mode change
  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  // Get appropriate icon for transaction category
  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'food': return <FiCoffee />;
      case 'shopping': return <FiShoppingBag />;
      case 'salary':
      case 'income':
      case 'interest':
      case 'freelance': return <FiDollarSign />;
      case 'rent': return <FiHome />;
      case 'transport': return <FiTruck />;
      case 'utilities': return <FiMonitor />;
      default: return <span className="text-lg font-bold">₹</span>;
    }
  };

  return (
    <div className="flex flex-col h-full mt-20 overflow-hidden">
      {/* Summary Cards */}
      <div className={`flex flex-col md:flex-row justify-evenly p-4 mt-2 mx-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
        <div className="text-center p-4">
          <p className="text-lg font-bold text-blue-500 flex items-center justify-center gap-2">
            <FiArrowDown /> Income
          </p>
          <p className="text-xl font-extrabold">₹{incomeTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="text-center p-4">
          <p className="text-lg font-bold text-red-500 flex items-center justify-center gap-2">
            <FiArrowUp /> Expenses
          </p>
          <p className="text-xl font-extrabold">₹{expenseTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="text-center p-4">
          <p className="text-lg font-bold flex items-center justify-center gap-2">
            Total
          </p>
          <p className="text-xl font-extrabold">₹{savingsTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      <div className="flex flex-1 mt-2 relative">
        {/* Mobile Toggle Sidebar Button */}
        <button
          className="fixed top-[22rem] left-4 p-2 bg-indigo-500 text-white rounded-lg shadow-md lg:hidden z-30"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FiMenu className="text-xl" />
        </button>

        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-64'} 
  fixed md:sticky md:top-0 left-0 w-56 p-5 rounded-lg shadow-md 
  flex flex-col justify-between h-auto min-h-[22rem]
  ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-900'} 
  transition-all duration-300 z-20 md:translate-x-0 my-4 mx-4`}
        >
          <div>
            {/* Month Navigator */}
            <div className="flex items-center justify-between mb-6">
              <FiChevronLeft
                className="cursor-pointer text-xl hover:text-indigo-500"
                onClick={handlePrevMonth}
              />
              <div className="flex items-center gap-1">
                <FiCalendar className="text-indigo-500" />
                <p className="text-sm md:text-md lg:text-lg font-semibold">{monthNames[currentMonthIndex]} {currentYear}</p>
              </div>
              <FiChevronRight
                className="cursor-pointer text-xl hover:text-indigo-500"
                onClick={handleNextMonth}
              />
            </div>

            {/* View Mode Options */}
            <ul className="space-y-3 text-lg font-medium">
              {["Daily", "Monthly", "Yearly"].map(mode => (
                <li
                  key={mode}
                  className={`cursor-pointer p-2 rounded-lg 
                    ${viewMode === mode
                      ? `${darkMode ? 'bg-indigo-600' : 'bg-indigo-500'} text-white`
                      : 'hover:bg-indigo-500 hover:text-white'}`}
                  onClick={() => handleViewModeChange(mode)}
                >
                  {mode}
                </li>
              ))}
            </ul>
          </div>

          {/* Add Transaction Button */}
          <div className=" hidden md:block">
            <Button
              text="+ Add Transaction"
              func={() => setIsAddModalOpen(true)}
              className="w-full "
            />
          </div>
        </div>

        {/* Main Content */}
        <div className={`flex-1 p-4 md:p-6 ${sidebarOpen ? 'ml-0 lg:ml-10' : 'ml-0'} transition-all duration-300 overflow-y-auto`}>
          {/* Search and Filter Bar */}
          <div className="mb-6 flex gap-4 items-center">
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

            <div className="relative">
              <button
                onClick={toggleFilterMenu}
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
                      <li
                        key={type}
                        className={`px-4 py-2 cursor-pointer capitalize first:rounded-t-lg last:rounded-b-lg
                          ${filterType === type
                            ? `${darkMode ? 'bg-indigo-600' : 'bg-indigo-500'} text-white`
                            : `hover:${darkMode ? 'bg-gray-600' : 'bg-gray-100'}`}`}
                        onClick={() => setFilter(type)}
                      >
                        {type}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Transactions List */}
          {filteredTransactions.length > 0 ? (
            <div className="space-y-3 overflow-x-clip">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className={`p-4 rounded-lg shadow-md
                    ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'}
                    ${transaction.type === 'income' ? 'border-l-4 border-blue-500' : 'border-l-4 border-red-500'}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-full ${transaction.type === 'income'
                        ? `${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-600'}`
                        : `${darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-600'}`}`}>
                        {transaction.icon || getCategoryIcon(transaction.category)}
                      </div>
                      <div>
                        <h3 className="font-medium">{transaction.title}</h3>
                        <p className="text-sm text-gray-500">{transaction.category} • {transaction.date}</p>
                      </div>
                    </div>
                    <div className={`font-bold ${transaction.type === 'income' ? 'text-blue-500' : 'text-red-500'}`}>
                      {transaction.type === 'income' ? '+' : '-'} {transaction.amount}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64">
              <p className="text-lg text-gray-500 mb-4">No transactions found</p>
              <Button text="Add New Transaction" func={() => setIsAddModalOpen(true)} />
            </div>
          )}
        </div>
      </div>



      {/* Mobile Add Button */}
      <button
        className="fixed bottom-6 right-6 bg-indigo-500 text-white p-4 rounded-full shadow-lg md:hidden z-30"
        onClick={() => setIsAddModalOpen(true)}
      >
        <FiPlus className="text-2xl" />
      </button>

      {/* Add Transaction Modal */}
      {isAddModalOpen && (
        <TransactionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={(newTransaction) => {
            // This would be replaced with an API call to your backend

            // Format date for display
            const date = new Date(newTransaction.date);
            const formattedDate = `${date.getDate()} ${monthNames[date.getMonth()].slice(0, 3)}`;

            // Format amount with currency
            const formattedAmount = `₹${parseFloat(newTransaction.amount).toLocaleString('en-IN', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}`;

            // Get appropriate icon
            const icon = getCategoryIcon(newTransaction.category);

            // Create transaction object (backend will provide ID)
            const finalTransaction = {
              id: Date.now(), // Temporary ID until backend provides one
              date: formattedDate,
              type: newTransaction.type,
              category: newTransaction.category,
              title: newTransaction.note || newTransaction.category,
              amount: formattedAmount,
              icon
            };

            // Add to transactions list at the beginning (will be replaced by API call)
            setTransactions([finalTransaction, ...transactions]);
          }}
        />
      )}
    </div>
  );
}