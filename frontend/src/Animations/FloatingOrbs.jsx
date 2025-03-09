import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function FloatingOrbs() {
  const [orbs, setOrbs] = useState([]);

  useEffect(() => {
    const generateOrbs = () => {
      const newOrbs = Array.from({ length: 8 }, () => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 80 + 40,
        delay: Math.random() * 2,
      }));
      setOrbs(newOrbs);
    };
    generateOrbs();
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {orbs.map((orb, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-indigo-500 opacity-30 blur-2xl"
          style={{ width: orb.size, height: orb.size, left: `${orb.x}%`, top: `${orb.y}%` }}
          initial={{ opacity: 0.3, scale: 0.9 }}
          animate={{ opacity: 0.7, scale: 1.1 }}
          transition={{ duration: 3, delay: orb.delay, repeat: Infinity, repeatType: "reverse" }}
        />
      ))}
    </div>
  );
}
