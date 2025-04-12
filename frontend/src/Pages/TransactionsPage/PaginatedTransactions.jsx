import React from 'react';
import { FiTrash2, FiEdit2, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useTheme } from '../../Components/ThemeContext';
import TransactionSkeleton from './TransactionSkeleton';
import Button from '../../Components/Button';



export function PerPageSelector({ transactionsPerPage, handleTransactionsPerPageChange }) {
  const { darkMode } = useTheme();
  return (
    <div className="flex justify-end mb-3">
      <div className={`flex items-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
        <span className="mr-2 text-sm">Show</span>
        <select
          value={transactionsPerPage}
          onChange={handleTransactionsPerPageChange}
          className={`rounded-md text-sm px-2 py-1 ${darkMode
            ? 'bg-gray-700 border-gray-600 text-white'
            : 'bg-white border-gray-300 text-gray-700'
            } border focus:outline-none focus:ring-1 focus:ring-indigo-500`}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>
    </div>
  )
}


export function GeneratePaginatedTransactions({ isLoading, paginatedTransactions,getCategoryIcon,handleEditClick,handleDeleteClick,currentPage,setCurrentPage,transactionsPerPage,filteredTransactions,setIsAddModalOpen,totalPages }) {
  const { darkMode } = useTheme();
  return (
    <div>
      {
        isLoading ? (
          <TransactionSkeleton />
        ) : paginatedTransactions?.length > 0 ? (
          <div className="space-y-3">
            {paginatedTransactions.map((transaction) => (
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
                        className={`p-2 rounded-full transition-colors ${darkMode
                          ? 'hover:bg-gray-700 text-gray-300 hover:text-white'
                          : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                          }`}
                      >
                        <FiEdit2 className="text-lg" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(transaction)}
                        className={`p-2 rounded-full transition-colors ${darkMode
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

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-6 pb-4">
              <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Showing {paginatedTransactions.length > 0
                  ? (currentPage - 1) * transactionsPerPage + 1
                  : 0} - {Math.min(currentPage * transactionsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md ${currentPage === 1
                    ? `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'}`
                    : `${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                    }`}
                >
                  <FiChevronLeft />
                </button>

                {/* Page numbers */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    pageNum > 0 && pageNum <= totalPages && (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 flex items-center justify-center rounded-md ${currentPage === pageNum
                          ? `${darkMode ? 'bg-indigo-600 text-white' : 'bg-indigo-500 text-white'}`
                          : `${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                          }`}
                      >
                        {pageNum}
                      </button>
                    )
                  );
                })}

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || totalPages === 0}
                  className={`p-2 rounded-md ${currentPage === totalPages || totalPages === 0
                    ? `${darkMode ? 'bg-gray-700 text-gray-500' : 'bg-gray-200 text-gray-400'}`
                    : `${darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`
                    }`}
                >
                  <FiChevronRight />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64">
            <p className="text-lg text-gray-500 mb-4">No transactions found</p>
            <Button text="Add New Transaction" func={() => setIsAddModalOpen(true)} />
          </div>
        )
      }
    </div>
  )
}

