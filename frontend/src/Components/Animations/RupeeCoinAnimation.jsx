import { useEffect, useRef } from 'react';
import { useTheme } from '../ThemeContext';

export default function RupeeCoinAnimation() {
  const coinRef = useRef(null);
  const { darkMode } = useTheme();
  
  useEffect(() => {
    const coin = coinRef.current;
    let animationFrame;
    let rotation = 0;
    
    const animate = () => {
      rotation += 2;
      if (coin) {
        coin.style.transform = `rotateY(${rotation}deg)`;
      }
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <div className="flex justify-center items-center mt-3 mb-6">
      <div 
        ref={coinRef}
        className="relative w-16 h-16 transform-style-preserve-3d transition-transform duration-300 ease-linear"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front face - Rupee symbol */}
        <div className="absolute w-full h-full rounded-full flex items-center justify-center backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            background: darkMode ? 'linear-gradient(145deg, #ffdc73, #ffc107)' : 'linear-gradient(145deg, #ffdc73, #ffc107)',
            boxShadow: darkMode ? '0 0 15px rgba(255, 215, 0, 0.5)' : '0 0 15px rgba(255, 193, 7, 0.5)',
            border: '4px solid #ffd700'
          }}>
          <span className="text-4xl font-bold text-gray-800">₹</span>
        </div>
        
        {/* Back face - Rupee coin pattern */}
        <div className="absolute w-full h-full rounded-full flex items-center justify-center backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background: darkMode ? 'linear-gradient(145deg, #ffd700, #ffc107)' : 'linear-gradient(145deg, #ffd700, #ffc107)',
            boxShadow: darkMode ? '0 0 15px rgba(255, 215, 0, 0.5)' : '0 0 15px rgba(255, 193, 7, 0.5)',
            border: '4px solid #ffd700'
          }}>
          <div className="w-16 h-16 rounded-full   flex items-center justify-center">
            <span className="text-4xl font-bold text-gray-800">₹</span>
          </div>
        </div>
      </div>
    </div>
  );
}