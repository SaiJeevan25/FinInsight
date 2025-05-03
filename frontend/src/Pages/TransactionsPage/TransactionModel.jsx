import React, { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import Button from "../../Components/Button";
import { useTheme } from "../../Components/ThemeContext";
import { FiCalendar } from "react-icons/fi";

export default function TransactionModal({ isOpen, onClose, onSave, transaction, isEditing }) {
  const { darkMode } = useTheme();
  const [transactionData, setTransactionData] = useState({
    title: "",
    amount: "",
    category: "Food",
    type: "expense",
    date: new Date().toISOString().split('T')[0]
  });

  const expenseCategories = [
    "Food", "Shopping", "Transport", "Utilities", "Investments", "Rent", "Entertainment",
    "Health", "Education", "Other"
  ];

  const incomeCategories = [
    "Salary", "Freelance", "Interest", "Returns", "Allowance", "Bonus",
    "Petty Cash", "Other"
  ];

  const paymentTypes = [
    "UPI", "Credit Card", "Debit Card", "Cash", "Net Banking", "Other"
  ];

  useEffect(() => {
    if (isEditing && transaction) {
      const cleanAmount = String(transaction.amount).replace(/[^\d.-]/g, '');
      
      setTransactionData({
        id: transaction.id, 
        title: transaction.title || "",
        amount: cleanAmount || "",
        category: transaction.category || "",
        type: transaction.type || "expense",
        date: transaction.date || new Date().toISOString().split('T')[0]
      });
    }
  }, [isEditing, transaction]);

  useEffect(() => {
    if (!isEditing) {
      if (transactionData.type === "expense") {
        setTransactionData(prev => ({
          ...prev,
          category: "Food"
        }));
      } else {
        setTransactionData(prev => ({
          ...prev,
          category: "Salary"
        }));
      }
    }
  }, [transactionData.type, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransactionData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (type) => {
    setTransactionData(prev => ({
      ...prev,
      type: type
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(transactionData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-70" onClick={onClose}></div>
      <div className={`relative w-full max-w-md p-6 rounded-lg  ${darkMode ? 'bg-gray-800  text-white' : 'bg-white text-gray-900'}`}>
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <FiX size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4">
          {isEditing ? 'Edit Transaction' : 'Add New Transaction'}
        </h2>

        {/* Transaction Type Tabs */}
        <div className="flex mb-6  rounded-md overflow-hidden">
          <button
            type="button"
            onClick={() => handleTypeChange("expense")}
            className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${transactionData.type === "expense"
                ? darkMode
                  ? "bg-red-600 text-white"
                  : "bg-red-500 text-white"
                : darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange("income")}
            className={`flex-1 py-2 px-4 text-center font-medium transition-colors ${transactionData.type === "income"
                ? darkMode
                  ? "bg-green-600 text-white"
                  : "bg-green-500 text-white"
                : darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={transactionData.title}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Amount</label>
            <div className="relative">
              <span className="absolute left-3 top-2">₹</span>
              <input
                type="number"
                name="amount"
                value={transactionData.amount}
                onChange={handleChange}
                className={`w-full p-2 pl-8 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium">Category</label>
            <select
              name="category"
              value={transactionData.category}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
            >
              {transactionData.type === "expense" ? (
                expenseCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))
              ) : (
                incomeCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))
              )}
            </select>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Date</label>
            <input
              type="date"
              name="date"
              value={transactionData.date}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
              className={`w-full p-2 border rounded-md ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
              required
            />
          </div>

          <div className="flex justify-end space-x-4">
            <Button
              text={isEditing ? "Update Transaction" : "Save Transaction"}
              type="submit"
              className={transactionData.type === "expense"
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"}
            />
          </div>
        </form>
      </div>
    </div>
  );
};