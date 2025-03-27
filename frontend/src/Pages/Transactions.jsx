import { useTheme } from "../Components/ThemeContext";
import Button from "../Components/Button";
import { useState, useEffect } from "react";
import TransactionModal from "./TransactionsPage/TransactionModel";
import {
  FiPlus,
  FiMenu,
  FiDollarSign,
  FiCoffee,
  FiShoppingBag,
  FiHome,
  FiTruck,
  FiMonitor,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiArrowUp,
  FiArrowDown,
  FiFilter,
  FiSearch
} from "react-icons/fi";
import Sidebar from "./TransactionsPage/Sidebar";
import SummaryCards from "./TransactionsPage/SummaryCards";
import SearchFilterBar from "./TransactionsPage/SearchFilterbar";

const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function TransactionsPage() {
  const { darkMode } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [viewMode, setViewMode] = useState("Daily");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [savingsTotal, setSavingsTotal] = useState(0);

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    try {
      let url = `http://localhost:8000/api/transactions`;
      
      if (viewMode === "Daily") {
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        url += `?day=${day}&month=${month}&year=${year}`;
      } else if (viewMode === "Month") {
        url += `?month=${currentMonthIndex + 1}&year=${currentYear}`;
      } else if (viewMode === "Year") {
        url += `?year=${currentYear}`;
      }

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await res.json();
      setTransactions(data);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentMonthIndex, currentYear, viewMode, currentDate]);

  // Calculate totals whenever transactions change
  useEffect(() => {
    let income = 0;
    let expense = 0;

    transactions.forEach(transaction => {
      const amount = parseFloat(String(transaction.amount).replace(/[^\d.-]/g, ''));
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

  const handlePrev = () => {
    if (viewMode === "Daily") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() - 1);
      setCurrentDate(newDate);
    } else if (viewMode === "Month") {
      setCurrentMonthIndex((prev) => {
        if (prev === 0) {
          setCurrentYear((year) => year - 1);
          return 11; // December
        }
        return prev - 1;
      });
    } else if (viewMode === "Year") {
      setCurrentYear((year) => year - 1);
    }
  };

  const handleNext = () => {
    if (viewMode === "Daily") {
      const newDate = new Date(currentDate);
      newDate.setDate(newDate.getDate() + 1);
      setCurrentDate(newDate);
    } else if (viewMode === "Month") {
      setCurrentMonthIndex((prev) => {
        if (prev === 11) {
          setCurrentYear((year) => year + 1);
          return 0; // January
        }
        return prev + 1;
      });
    } else if (viewMode === "Year") {
      setCurrentYear((year) => year + 1);
    }
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
  const filteredTransactions = transactions
  .filter(transaction => {
    const matchesSearch = transaction.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.category?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || transaction.type === filterType;
    const matchesCategory = selectedCategory === "All" || selectedCategory === "" || transaction.category === selectedCategory;
    return matchesSearch && matchesFilter && matchesCategory;
  })
  .sort((a, b) => new Date(a.date) - new Date(b.date)); // Sorting by date in descending order


  // Function to add a new transaction
  const addTransaction = async (newTransaction) => {
    try {
      const response = await fetch("http://localhost:8000/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(newTransaction),
      });

      if (!response.ok) {
        throw new Error("Failed to add transaction");
      }

      const result = await response.json();
      console.log("Transaction added:", result);
      fetchTransactions(); // Refresh the transactions list
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

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

  // Format date for display
  const formatDateDisplay = () => {
    if (viewMode === "Daily") {
      return currentDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    } else if (viewMode === "Month") {
      return `${monthNames[currentMonthIndex]} ${currentYear}`;
    } else {
      return `${currentYear}`;
    }
  };

  return (
    <div className="flex flex-col h-full mt-20 overflow-hidden">
      <SummaryCards
        incomeTotal={incomeTotal}
        expenseTotal={expenseTotal}
        savingsTotal={savingsTotal}
        darkMode={darkMode}
      />

      <div className="flex flex-1 mt-2 relative">
        {/* Mobile Toggle Sidebar Button */}
        <button
          className="fixed top-[22rem] left-4 p-2 bg-indigo-500 text-white rounded-lg shadow-md lg:hidden z-30"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FiMenu className="text-xl" />
        </button>

        {/* Sidebar */}
        <Sidebar
          sidebarOpen={sidebarOpen}
          currentMonthIndex={currentMonthIndex}
          currentYear={currentYear}
          currentDate={currentDate}
          handlePrev={handlePrev}
          handleNext={handleNext}
          viewMode={viewMode}
          handleViewModeChange={handleViewModeChange}
          darkMode={darkMode}
          setIsAddModalOpen={setIsAddModalOpen}
          formatDateDisplay={formatDateDisplay}
        />

        {/* Main Content */}
        <div className={`flex-1 p-4 md:p-6 ${sidebarOpen ? 'ml-0 lg:ml-10' : 'ml-0'} transition-all duration-300 overflow-y-auto`}>
          {/* Search and Filter Bar */}
          <SearchFilterBar
            searchTerm={searchTerm}
            handleSearch={handleSearch}
            filterType={filterType}
            setFilter={setFilter}
            selectedCategory={selectedCategory}
            setCategory={setSelectedCategory}
            isFilterMenuOpen={isFilterMenuOpen}
            toggleFilterMenu={toggleFilterMenu}
            darkMode={darkMode}
          />

          {/* Transactions List */}
          {filteredTransactions.length > 0 ? (
            <div className="space-y-3">
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
                      {transaction.type === 'income' ? '+' : '-'} ₹
                      {String(transaction.amount).replace(/[^\d.-]/g, '')}
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
          onSave={addTransaction}
        />
      )}
    </div>
  );
}