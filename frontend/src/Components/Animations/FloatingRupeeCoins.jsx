import { useEffect, useState } from 'react';
import { useTheme } from '../ThemeContext';

export default function FloatingRupeeCoins() {
  const { darkMode } = useTheme();
  const [coins, setCoins] = useState([]);
  
  useEffect(() => {
    // Create coins distributed around the screen edges
    const newCoins = [
      // Top area
      {
        id: 0,
        x: 15,
        y: 15,  // Top
        size: 48, 
        speed: 0.1,
        rotationSpeed: 2.5,
        rotation: 0,
        position: 0,
      },
      {
        id: 1,
        x: 85,
        y: 20, // Top
        size: 45,
        speed: 0.2,
        rotationSpeed: 2.5,
        rotation: 45,
        position: 50,
      },
      // Bottom area
      {
        id: 2,
        x: 20,
        y: 80, // Bottom
        size: 48,
        speed: 0.2,
        rotationSpeed: 2.5,
        rotation: 90,
        position: 25,
      },
      {
        id: 3,
        x: 80,
        y: 85, // Bottom
        size: 46,
        speed: 0.1,
        rotationSpeed: 2,
        rotation: 135,
        position: 75,
      },
      // Left side
      {
        id: 4,
        x: 8, // Left edge
        y: 45,
        size: 68,
        speed: 0.15,
        rotationSpeed: 2.2,
        rotation: 180,
        position: 30,
      },
      // Right side
      {
        id: 5,
        x: 92, // Right edge
        y: 55,
        size: 58,
        speed: 0.12,
        rotationSpeed: 2.8,
        rotation: 225,
        position: 60,
      },
    ];
    
    setCoins(newCoins);
    
    // Animation loop
    let animationFrame;
    let lastTime = 0;
    
    const animate = (time) => {
      if (!lastTime) lastTime = time;
      const deltaTime = time - lastTime;
      lastTime = time;
      
      setCoins(prevCoins => 
        prevCoins.map(coin => {
          // Update position in animation cycle
          let newPosition = (coin.position + (coin.speed * deltaTime / 100)) % 100;
          
          // Update rotation
          let newRotation = (coin.rotation + (coin.rotationSpeed * deltaTime / 20)) % 360;
          
          return {
            ...coin,
            position: newPosition,
            rotation: newRotation
          };
        })
      );
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {coins.map(coin => {
        // Calculate position with subtle movement
        const yPos = coin.y + Math.sin(coin.position * 0.0628) * 5; // Very subtle vertical movement
        const xPos = coin.x + Math.cos(coin.position * 0.0628) * 3; // Even more subtle horizontal movement
        
        return (
          <div
            key={coin.id}
            className="absolute"
            style={{
              left: `${xPos}%`,
              top: `${yPos}%`,
              width: `${coin.size}px`,
              height: `${coin.size}px`,
              transformStyle: 'preserve-3d',
              transform: `rotateY(${coin.rotation}deg)`,
              zIndex: 5,
            }}
          >
            {/* Front face */}
            <div 
              className="absolute w-full h-full rounded-full flex items-center justify-center"
              style={{ 
                backfaceVisibility: 'hidden',
                background: darkMode ? 'linear-gradient(145deg, #ffdc73, #ffc107)' : 'linear-gradient(145deg, #ffdc73, #ffc107)',
                boxShadow: darkMode ? '0 0 10px rgba(255, 215, 0, 0.5)' : '0 0 10px rgba(255, 193, 7, 0.5)',
                
              }}
            >
              <span 
                className="text-gray-800 font-bold"
                style={{ fontSize: `${coin.size * 0.6}px` }}
              >
                ₹
              </span>
            </div>
            
            {/* Back face with black border rupee */}
            <div 
              className="absolute w-full h-full rounded-full flex items-center justify-center"
              style={{ 
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
                background: darkMode ? 'linear-gradient(145deg, #ffdc73, #ffc107)' : 'linear-gradient(145deg, #ffdc73, #ffc107)',
                boxShadow: darkMode ? '0 0 10px rgba(255, 215, 0, 0.5)' : '0 0 10px rgba(255, 193, 7, 0.5)',

              }}
            >
              <div 
                className="flex items-center justify-center"
                
              >
                <span 
                  className="text-black font-bold"
                  style={{ fontSize: `${coin.size * 0.6}px` }}
                >
                  ₹
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}