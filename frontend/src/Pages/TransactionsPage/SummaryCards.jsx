import { FiArrowUp, FiArrowDown } from "react-icons/fi";

export default function SummaryCards({ incomeTotal, expenseTotal, savingsTotal, darkMode }) {
  return (
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
        <p className="text-lg font-bold flex items-center justify-center gap-2">Total</p>
        <p className="text-xl font-extrabold">₹{savingsTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
    </div>
  );
}
