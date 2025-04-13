import { useTheme } from "../../Components/ThemeContext";

export default function DeleteConfirmation({ isOpen, onClose, onConfirm, transaction }) {
    
    const {darkMode} = useTheme()
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/70 bg-opacity-70 z-50 flex items-center justify-center p-4">
        <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-xl p-6 w-full max-w-md`}>
          <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
          <p className="mb-6">Are you sure you want to delete the transaction "{transaction?.title}"?</p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-md ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-200 hover:bg-gray-300'}`}
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm(transaction.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };