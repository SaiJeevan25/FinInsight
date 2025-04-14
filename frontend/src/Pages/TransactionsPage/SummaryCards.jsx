import { FiArrowUp, FiArrowDown, FiTrendingDown, FiTrendingUp } from "react-icons/fi";

export default function SummaryCards({ incomeTotal, expenseTotal, savingsTotal, darkMode }) {
  return (
    <div className={`flex flex-row shadow-indigo-500 justify-evenly mt-4 md:mt-4 mx-1 md:mx-4 rounded-lg shadow-sm ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <div className="text-center p-4">
        <p className="text-xs md:text-lg font-bold text-blue-500 flex items-center justify-center gap-2">
          <FiArrowDown /> Income
        </p>
        <p className="text-sm md:text-xl font-extrabold">₹{incomeTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      <div className="text-center p-4">
        <p className="text-xs md:text-lg font-bold text-red-500 flex items-center justify-center gap-2">
          <FiArrowUp /> Expenses
        </p>
        <p className="text-sm md:text-xl font-extrabold">₹{expenseTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
      <div className="text-center p-4">
        <p className="text-xs md:text-lg font-bold flex items-center justify-center gap-2">
        {savingsTotal > 0 ? <FiTrendingUp className="text-green-500"/>: savingsTotal === 0? "" : <FiTrendingDown  className="text-red-500"/>}
          Total</p>
        <p className="text-sm md:text-xl font-extrabold">₹{savingsTotal.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
      </div>
    </div>
  );
}