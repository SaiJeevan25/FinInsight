import React from "react";
import { motion } from "framer-motion";
import FloatingOrbs from "../Animations/FloatingOrbs";

export default function Login() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-100 dark:bg-gray-900">
      <FloatingOrbs />
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">Login</h2>
        <input type="text" placeholder="Email" className="w-full p-3 mb-4 border rounded dark:bg-gray-700 dark:text-white" />
        <input type="password" placeholder="Password" className="w-full p-3 mb-4 border rounded dark:bg-gray-700 dark:text-white" />
        <button className="w-full py-3 bg-indigo-600 text-white rounded hover:bg-indigo-500">Sign In</button>
      </motion.div>
    </div>
  );
}
k