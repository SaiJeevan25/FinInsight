import { useTheme } from "../Components/ThemeContext";
import Button from "../Components/Button";
import { useState, useEffect, useMemo } from "react";
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
  FiEdit,
  FiTrash2
} from "react-icons/fi";
import Sidebar from "./TransactionsPage/Sidebar";
import SummaryCards from "./TransactionsPage/SummaryCards";
import SearchFilterBar from "./TransactionsPage/SearchFilterBar";
import DeleteConfirmation from "./TransactionsPage/DeleteConfirmation";

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


export default function TransactionsPage() {
  const { darkMode } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentMonthIndex, setCurrentMonthIndex] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [viewMode, setViewMode] = useState("Daily");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);
  const [savingsTotal, setSavingsTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState(false); // false indicates Ascending order
  const [dateVisibility, setDateVisibility] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);

  // Fetch transactions from backend
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      let url = `http://localhost:8000/api/transactions`;
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      if (viewMode === "Daily") {
        url += `?day=${day}&month=${month}&year=${year}`;
      } else if (viewMode === "Month") {
        url += `?month=${month}&year=${year}`;
      } else if (viewMode === "Year") {
        url += `?year=${year}`;
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
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [viewMode, currentDate, searchTerm, filterType, selectedCategory]);


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
    const newDate = new Date(currentDate)
    if (viewMode === "Daily") {
      newDate.setDate(newDate.getDate() - 1);
      setCurrentDate(newDate);

    } else if (viewMode === "Month") {
      newDate.setMonth(newDate.getMonth() - 1)
      setCurrentDate(newDate)

    } else if (viewMode === "Year") {
      newDate.setFullYear(newDate.getFullYear() - 1)
      setCurrentDate(newDate)
    }
  };

  const handleNext = () => {
    const newDate = new Date(currentDate)
    if (viewMode === "Daily") {
      newDate.setDate(newDate.getDate() + 1);
      setCurrentDate(newDate);

    } else if (viewMode === "Month") {
      newDate.setMonth(newDate.getMonth() + 1)
      setCurrentDate(newDate)

    } else if (viewMode === "Year") {
      newDate.setFullYear(newDate.getFullYear() + 1)
      setCurrentDate(newDate)
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
    if (type === "all") {
      setSelectedCategory("");
    }
    setIsFilterMenuOpen(false);
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        const matchesSearch = transaction.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === "all" || transaction.type === filterType;
        const matchesCategory = selectedCategory === "All" || selectedCategory === "" || transaction.category === selectedCategory;
        return matchesSearch && matchesFilter && matchesCategory;
      })
      .sort((a, b) => order ? (new Date(b.date) - new Date(a.date)) : (new Date(a.date) - new Date(b.date)));
  }, [transactions, searchTerm, filterType, selectedCategory, order]);

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

  // Function to edit a transaction
  const editTransaction = async (updatedTransaction) => {
    try {
      const response = await fetch(`http://localhost:8000/api/transactions/${updatedTransaction.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedTransaction),
      });

      if (!response.ok) {
        throw new Error("Failed to update transaction");
      }

      const result = await response.json();
      console.log("Transaction updated:", result);
      fetchTransactions(); // Refresh the transactions list
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  // Function to delete a transaction
  const deleteTransaction = async (id) => {
    try {
      // Show some loading state if needed
      // setIsLoading(true);
      console.log(id)
      const response = await fetch(`http://localhost:8000/api/transactions/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete transaction");
      }
  
      console.log("Transaction deleted:", id);
      
      setIsDeleteConfirmOpen(false);
      setTransactionToDelete(null);
      
      // Refresh the transactions list
      await fetchTransactions();
      
    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle edit button click
  const handleEditClick = (transaction) => {
    setCurrentTransaction(transaction);
    console.log(transaction)
    setIsEditModalOpen(true);
  };

  // Function to handle delete button click
  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    console.log(transaction)
    setIsDeleteConfirmOpen(true);
  };

  // Function to handle view mode change
  const handleViewModeChange = (mode) => {
    if (mode === "Daily") {
      setDateVisibility(false);
    } else {
      setDateVisibility(true);
    }
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


  const TransactionSkeleton = () => (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className={`p-4 rounded-lg shadow-md animate-pulse
            ${darkMode ? 'bg-gray-800' : 'bg-white'}
            border-l-4 ${item % 2 === 0 ? 'border-blue-500' : 'border-red-500'}`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              <div>
                <div className={`h-4 w-24 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                <div className={`h-3 w-32 rounded mt-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
              </div>
            </div>
            <div className={`h-6 w-16 rounded ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Delete Confirmation Modal
  

  return (
    <div className="flex flex-col h-full mt- overflow-hidden">
      <SummaryCards
        incomeTotal={incomeTotal}
        expenseTotal={expenseTotal}
        savingsTotal={savingsTotal}
        darkMode={darkMode}
      />

      <div className="flex flex-1 relative">
        {/* Mobile Toggle Sidebar Button */}
        <button
          className="fixed top-[11.2rem] left-0 p-2 bg-indigo-500 text-white rounded-lg shadow-md lg:hidden z-30"
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
            order={order}
            setOrder={setOrder}
            darkMode={darkMode}
            dateVisibility={dateVisibility}
          />

          {/* Transactions List with Loading State */}
          {isLoading ? (
            <TransactionSkeleton />
          ) : filteredTransactions.length > 0 ? (
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
                    <div className="flex items-center gap-3">
                      <div className={`font-bold ${transaction.type === 'income' ? 'text-blue-500' : 'text-red-500'}`}>
                        {transaction.type === 'income' ? '+' : '-'} ₹
                        {String(transaction.amount).replace(/[^\d.-]/g, '')}
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditClick(transaction)}
                          className={`p-2 rounded-full transition-colors ${
                            darkMode 
                              ? 'hover:bg-gray-700 text-gray-300 hover:text-white' 
                              : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                          }`}
                        >
                          <FiEdit className="text-lg" />
                        </button>
                        <button 
                          onClick={() => handleDeleteClick(transaction)}
                          className={`p-2 rounded-full transition-colors ${
                            darkMode
                              ? 'hover:bg-red-900 text-gray-300 hover:text-red-300'
                              : 'hover:bg-red-100 text-gray-500 hover:text-red-600'
                          }`}
                        >
                          <FiTrash2 className="text-lg" />
                        </button>
                      </div>
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
        className="fixed bottom-6 right-6 bg-indigo-500 text-white p-4 rounded-full shadow-lg lg:hidden z-30"
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

      {/* Edit Transaction Modal */}
      {isEditModalOpen && currentTransaction && (
        <TransactionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setCurrentTransaction(null);
          }}
          onSave={editTransaction}
          transaction={currentTransaction}
          isEditing={true}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmation
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={deleteTransaction}
        transaction={transactionToDelete}
      />
    </div>
  );
}