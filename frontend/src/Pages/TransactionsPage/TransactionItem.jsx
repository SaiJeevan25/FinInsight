export default function TransactionItem({ transaction, darkMode }) {
    return (
      <div className={`p-4 rounded-lg shadow-md ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'} ${transaction.type === 'income' ? 'border-l-4 border-blue-500' : 'border-l-4 border-red-500'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-200'}`}>
              {transaction.icon}
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
    );
  }
  