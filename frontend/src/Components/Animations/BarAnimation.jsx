import React from 'react'
import { useTheme } from '../ThemeContext';
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function BarAnimation(props) {
    const [points, setPoints] = useState([]);
    const { darkMode } = useTheme();
    const [bars, setBars] = useState(new Array(20).fill(50));


    useEffect(() => {
        const generatePoints = () => {
            const newPoints = Array.from({ length: 25 }, (_, i) => ({
                x: i * 4 + 5,
                y: Math.random() * 50 + 20,
                delay: i * 0.2,
            }));
            setPoints(newPoints);
        };
        generatePoints();

        const interval = setInterval(() => {
            setBars(bars.map(() => Math.random() * 70 + 20));
        }, 900);
        return () => clearInterval(interval);
    }, [bars]);


    return (
        <div className=''>
            <div className="absolute inset-0 flex items-end justify-center gap-2  opacity-20">
                {bars.map((height, index) => (
                    <motion.div
                        key={index}
                        className={`w-2 hidden md:block  md:mx-3 md:w-6 rounded ${darkMode ? 'bg-gray-100' : 'bg-gray-900'}`}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 0.8, ease: "easeInOut" }}
                    />
                ))}
            </div>


            <div className='absolute overflow-hidden inset-0 '>
                {points.map((point, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 bg-indigo-600 rounded-full shadow-lg"
                        style={{ left: `${point.x}%`, bottom: `${point.y}%` }}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1.2 }}
                        transition={{ duration: 1, delay: point.delay, repeat: Infinity, repeatType: "reverse" }}
                    />
                ))}
            </div>
        </div> 
  )
}
