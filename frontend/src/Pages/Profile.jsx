import { useTheme } from "../Components/ThemeContext";
import { useState } from "react";
import { FiEdit2, FiSave, FiUser, FiMail, FiDollarSign, FiPhone, FiPieChart, FiBriefcase } from "react-icons/fi";
import Button from "../Components/Button";

export default function ProfilePage() {
  const { darkMode } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("Jeevan");
  const [email, setEmail] = useState("saijevan@gmail.com");
  const [totalIncome, setTotalIncome] = useState("₹1,50,000.00");
  const [totalExpenses, setTotalExpenses] = useState("₹50,000.00");
  const [totalSavings, setTotalSavings] = useState("₹1,00,000.00");
  const [phoneNumber, setPhoneNumber] = useState("9948021183");
  const [occupation, setOccupation] = useState("NA");

  const handleSave = () => {zz
    setIsEditing(false);
    // Here you would typically save the data to your backend
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6 gap-6 mt-30">
     

      {/* Main Profile Content */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Profile Details Card */}
        <div className={`flex-1 p-6 rounded-lg shadow-md shadow-gray-600 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Profile Details</h2>
            <button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
            >
              {isEditing ? (
                <>
                  <FiSave /> Save
                </>
              ) : (
                <>
                  <FiEdit2 /> Edit
                </>
              )}
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 w-32">
                <FiUser className="text-indigo-500" />
                <label className="font-semibold">Name:</label>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`flex-1 p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border`}
                />
              ) : (
                <span className="flex-1">{name}</span>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 w-32">
                <FiMail className="text-indigo-500" />
                <label className="font-semibold">Email:</label>
              </div>
              {isEditing ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`flex-1 p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border`}
                />
              ) : (
                <span className="flex-1">{email}</span>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 w-32">
                <FiPhone className="text-indigo-500" />
                <label className="font-semibold">Number:</label>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className={`flex-1 p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border`}
                />
              ) : (
                <span className="flex-1">{phoneNumber}</span>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
              <div className="flex items-center gap-2 w-32">
                <FiBriefcase className="text-indigo-500" />
                <label className="font-semibold">Occupation:</label>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className={`flex-1 p-2 rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} border`}
                />
              ) : (
                <span className="flex-1">{occupation}</span>
              )}
            </div>
          </div>
        </div>

        {/* Financial Summary Card */}
        <div className={`flex-1 p-6 rounded-lg shadow-md shadow-gray-600 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <FiPieChart className="text-indigo-500" />
            Financial Summary
          </h2>
          
          <div className="space-y-6">
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                    Income
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-blue-600">
                    {totalIncome}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                <div style={{ width: "100%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"></div>
              </div>
            </div>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">
                    Expenses
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-red-600">
                    {totalExpenses}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-red-200">
                <div style={{ width: "33%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-red-500"></div>
              </div>
            </div>
            
            <div className="relative pt-1">
              <div className="flex mb-2 items-center justify-between">
                <div>
                  <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                    Savings
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-semibold inline-block text-green-600">
                    {totalSavings}
                  </span>
                </div>
              </div>
              <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-green-200">
                <div style={{ width: "67%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Button text="View Detailed Report" />
          </div>
        </div>
      </div>
    </div>
  );
}