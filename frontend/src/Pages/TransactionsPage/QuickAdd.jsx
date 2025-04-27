import React from "react";
import { FiZap } from "react-icons/fi";

const QuickAdd = ({ predefinedTransactions, handleTypeChange, handleQuickAdd }) => {
  return (
    <div className="mb-4">
        <div className="flex gap-2 items-center ">
          <FiZap />
          <h1>Quick Add</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 overflow-auto">
          {predefinedTransactions.map((transaction, index) => (
            
              <button
                key={index}
                onClick={() => handleQuickAdd(transaction)}
                className={`flex items-center p-4 rounded-lg transition-all ${ transaction.type==="expense" ? "bg-red-100 hover:bg-red-200 text-red-800" : "bg-green-100 hover:bg-green-200 text-green-800"} `}
              >
                <span className="mr-3 p-2 rounded-full bg-opacity-20 bg-white">{transaction.icon}</span>
                <div className="flex flex-col items-start">
                  <span className="text-md font-medium">{transaction.title}</span>
                  <span className="text-sm">₹{transaction.amount}</span>
                </div>
              </button>
          ))}
        </div>

    </div>
  );
};

export default QuickAdd;
