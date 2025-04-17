import { useTheme } from "../Components/ThemeContext";
import Button from "../Components/Button";
import { useState, useEffect, useMemo } from "react";
import TransactionModal from "./TransactionsPage/TransactionModel";
import {
  FiPlus,
  FiMenu,
  FiTruck,
  FiMonitor,
  FiCoffee,
  FiShoppingBag,
  FiHome,
  FiDollarSign,
  FiFilm,
  FiBook,
  FiGift,
  FiBriefcase,
  FiStar,
  FiPieChart
} from "react-icons/fi";
import { FaHeartbeat } from 'react-icons/fa';
import Sidebar from "./TransactionsPage/Sidebar";
import SummaryCards from "./TransactionsPage/SummaryCards";
import TransactionSkeleton from "./TransactionsPage/TransactionSkeleton";
import SearchFilterBar from "./TransactionsPage/SearchFilterBar";
import DeleteConfirmation from "./TransactionsPage/DeleteConfirmation";
import { PerPageSelector, GeneratePaginatedTransactions } from "./TransactionsPage/PaginatedTransactions";


const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function TransactionsPage() {
  const { darkMode } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
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
  const [order, setOrder] = useState(false);
  const [dateVisibility, setDateVisibility] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [transactionsPerPage, setTransactionsPerPage] = useState(10);

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
      // Reset to first page when new data is loaded
      setCurrentPage(1);
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
  }, [viewMode, currentDate, isAddModalOpen, searchTerm, filterType, selectedCategory]);


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
    setCurrentPage(1); // Reset to first page on search
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
    setCurrentPage(1); // Reset to first page on filter change
  };

  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(transaction => {
        const matchesSearch = transaction.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          transaction.category?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === "all" || transaction.type.toLowerCase() === filterType.toLowerCase();
        const matchesCategory = selectedCategory === "All" || selectedCategory === "" || transaction.category.toLowerCase() === selectedCategory.toLowerCase();
        return matchesSearch && matchesFilter && matchesCategory;
      })
      .sort((a, b) => order ? (new Date(b.date) - new Date(a.date)) : (new Date(a.date) - new Date(b.date)));
  }, [transactions, searchTerm, filterType, selectedCategory, order]);

  const paginatedTransactions = useMemo(() => {
    const indexOfLastTransaction = currentPage * transactionsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
    return filteredTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);
  }, [filteredTransactions, currentPage, transactionsPerPage]);
  const totalPages = Math.ceil(filteredTransactions.length / transactionsPerPage);

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
      fetchTransactions();
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const editTransaction = async (updatedTransaction) => {
    setIsLoading(true);
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
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update transaction");
      }

      console.log("Transaction updated:", updatedTransaction.id);
      setIsEditModalOpen(false);
      setCurrentTransaction(null);
      await fetchTransactions();

    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Failed to update transaction: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };


  const deleteTransaction = async (id) => {
    try {
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

      await fetchTransactions();

    } catch (error) {
      console.error("Error deleting transaction:", error);
      alert("Failed to delete transaction: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (transaction) => {
    setCurrentTransaction(transaction);
    console.log(transaction)
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (transaction) => {
    setTransactionToDelete(transaction);
    console.log(transaction)
    setIsDeleteConfirmOpen(true);
  };

  const handleViewModeChange = (mode) => {
    if (mode === "Daily") {
      setDateVisibility(false);
    } else {
      setDateVisibility(true);
    }
    setViewMode(mode);
  };

  const getCategoryIcon = (category) => {
    switch (category.toLowerCase()) {
      case 'food': return <FiCoffee />;
      case 'shopping': return <FiShoppingBag />;
      case 'transport': return <FiTruck />;
      case 'utilities': return <FiMonitor />;
      case 'rent': return <FiHome />;
      case 'entertainment': return <FiFilm />;
      case 'health': return <FaHeartbeat />;
      case 'education': return <FiBook />;
      case 'other': return <FiGift />;
      case 'salary': return <FiBriefcase />;
      case 'freelance': return <FiDollarSign />;
      case 'interest': return <FiPieChart />;
      case 'investments': return <FiPieChart />;
      case 'allowance': return <FiGift />;
      case 'bonus': return <FiStar />;
      case 'petty cash': return <FiDollarSign />;
  
      default: return <span className="text-lg font-bold">₹</span>;
    }
  };




  // Function to handle transactions per page change
  const handleTransactionsPerPageChange = (e) => {
    setTransactionsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

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

          {/* Transactions Per Page Selector */}
          <PerPageSelector
            handleTransactionsPerPageChange={handleTransactionsPerPageChange}
            transactionsPerPage={transactionsPerPage}
          />

          <GeneratePaginatedTransactions
            isLoading={isLoading}
            paginatedTransactions={paginatedTransactions}
            getCategoryIcon={getCategoryIcon}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            transactionsPerPage={transactionsPerPage}
            filteredTransactions={filteredTransactions}
            setIsAddModalOpen={setIsAddModalOpen}
            totalPages={totalPages}
          />
        </div>
      </div>


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