import React from "react";
import { useEffect } from "react";
import { FiXCircle, FiCheckCircle, FiX } from "react-icons/fi";
export default function Notification({ type, message, onClose }) {
    useEffect(() => {

      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      
      return () => clearTimeout(timer);
    }, [onClose]);
    
    const bgColor = type === 'error' ? 'bg-red-100' : 'bg-green-100';
    const textColor = type === 'error' ? 'text-red-700' : 'text-green-700';
    const borderColor = type === 'error' ? 'border-red-400' : 'border-green-400';
    const iconColor = type === 'error' ? 'text-red-500' : 'text-green-500';
    
    return (
      <div className="fixed top-4 md:top-20 left-7 z-50 max-w-lg transition-transform duration-500 ease-out translate-x-0">
        <div className={`${bgColor} border ${borderColor} rounded-lg p-4 shadow-md flex items-start gap-2`}>
          <div className={`${iconColor} flex-shrink-0 mt-0.5`}>
            {type === 'error' ? (
                <FiXCircle className="h-5 w-5 text-red-500" />
            ) : (
                <FiCheckCircle className="h-5 w-5 text-green-500" />
            )}
          </div>
          <div className="flex-grow">
            <p className={`${textColor} font-medium`}>{type === 'error' ? 'Error' : 'Success'}</p>
            <p className={`${textColor} text-sm`}>{message}</p>
          </div>
          <button 
            onClick={onClose} 
            className={`${iconColor} hover:bg-gray-200 rounded-full p-1`}
          >
            <FiX className="h-4 w-5"/>
          </button>
        </div>
      </div>
    );
  };