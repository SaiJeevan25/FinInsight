import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <motion.div
        className="w-16 h-16  border-4 border-t-indigo-500 border-gray-300 rounded-full animate-spin"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
      <p className="text-indigo-500 text-2xl mt-5">Things Getting Heated Up!!!</p>
    </div>
  );
}
