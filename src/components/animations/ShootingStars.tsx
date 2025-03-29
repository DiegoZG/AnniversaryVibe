import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ShootingStarsProps {
  isActive: boolean;
  index?: number;
}

// Star colors
const starColors = [
  '#FFFFFF', // White
  '#E6E6FA', // Lavender
  '#ADD8E6', // Light Blue
  '#87CEFA', // Sky Blue
  '#B0E0E6', // Powder Blue
  '#F0F8FF', // Alice Blue
  '#FFFFCC', // Light Yellow
];

const ShootingStars: React.FC<ShootingStarsProps> = ({ isActive }) => {
  const [stars, setStars] = useState<Array<{
    id: number;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
    size: number;
    color: string;
    delay: number;
    duration: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    if (!isActive) {
      setStars([]);
      return;
    }

    // Generate a shooting star with randomized properties
    const generateStar = (id: number, delay = 0) => {
      // Determine a random diagonal path across a portion of the screen
      const quadrant = Math.floor(Math.random() * 4); // 0: top-left, 1: top-right, 2: bottom-left, 3: bottom-right
      
      let startX, startY, endX, endY;
      
      switch (quadrant) {
        case 0: // top-left to bottom-right
          startX = Math.random() * 30;
          startY = Math.random() * 30;
          endX = startX + 40 + Math.random() * 30;
          endY = startY + 40 + Math.random() * 30;
          break;
        case 1: // top-right to bottom-left
          startX = 70 + Math.random() * 30;
          startY = Math.random() * 30;
          endX = startX - 40 - Math.random() * 30;
          endY = startY + 40 + Math.random() * 30;
          break;
        case 2: // bottom-left to top-right
          startX = Math.random() * 30;
          startY = 70 + Math.random() * 30;
          endX = startX + 40 + Math.random() * 30;
          endY = startY - 40 - Math.random() * 30;
          break;
        case 3: // bottom-right to top-left
        default:
          startX = 70 + Math.random() * 30;
          startY = 70 + Math.random() * 30;
          endX = startX - 40 - Math.random() * 30;
          endY = startY - 40 - Math.random() * 30;
          break;
      }
      
      return {
        id,
        startX,
        startY,
        endX,
        endY,
        size: Math.random() * 2 + 1, // 1-3px
        color: starColors[Math.floor(Math.random() * starColors.length)],
        delay,
        duration: Math.random() * 1.5 + 0.8, // 0.8-2.3s
        opacity: Math.random() * 0.3 + 0.7, // 0.7-1.0
      };
    };

    // Create initial stars
    const initialStars = Array.from({ length: 6 }, (_, i) => 
      generateStar(i, Math.random() * 5)
    );

    setStars(initialStars);

    // Add new stars periodically
    const interval = setInterval(() => {
      const newStar = generateStar(Date.now());
      setStars(prev => [...prev.slice(-15), newStar]); // Keep maximum 15 stars
    }, 800);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {stars.map(star => (
        <React.Fragment key={star.id}>
          {/* Main shooting star */}
          <motion.div
            className="absolute rounded-full"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              width: `${star.size * 3}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              boxShadow: `0 0 ${star.size * 2}px ${star.color}, 0 0 ${star.size * 6}px ${star.color}`,
              opacity: star.opacity,
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              left: `${star.endX}%`,
              top: `${star.endY}%`,
              scale: [0, 1, 0.8, 0],
              opacity: [0, star.opacity, star.opacity * 0.7, 0],
            }}
            transition={{
              duration: star.duration,
              delay: star.delay,
              ease: "easeOut",
            }}
          />
          
          {/* Star trail */}
          <motion.div
            className="absolute"
            style={{
              left: `${star.startX}%`,
              top: `${star.startY}%`,
              width: `${Math.abs(star.endX - star.startX)}%`,
              height: `${star.size * 0.5}px`,
              background: `linear-gradient(to right, transparent, ${star.color})`,
              transformOrigin: 'left center',
              rotate: `${Math.atan2(star.endY - star.startY, star.endX - star.startX) * (180 / Math.PI)}deg`,
            }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{
              scaleX: [0, 1, 0],
              opacity: [0, star.opacity * 0.7, 0],
            }}
            transition={{
              duration: star.duration * 0.8,
              delay: star.delay,
              ease: "easeOut",
            }}
          />
          
          {/* Star burst at end */}
          <motion.div
            className="absolute"
            style={{
              left: `${star.endX}%`,
              top: `${star.endY}%`,
              width: `${star.size * 8}px`,
              height: `${star.size * 8}px`,
              background: `radial-gradient(circle, ${star.color} 0%, rgba(255,255,255,0) 70%)`,
              transform: 'translate(-50%, -50%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: [0, 1.5, 0],
              opacity: [0, star.opacity * 0.8, 0],
            }}
            transition={{
              duration: star.duration * 0.5,
              delay: star.delay + star.duration * 0.7,
              ease: "easeOut",
            }}
          />
        </React.Fragment>
      ))}
      
      {/* Background stars (static) */}
      {Array.from({ length: 30 }).map((_, index) => {
        const size = Math.random() * 2 + 1;
        const blinkDuration = Math.random() * 3 + 2;
        
        return (
          <motion.div
            key={`bg-star-${index}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: starColors[Math.floor(Math.random() * starColors.length)],
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: blinkDuration,
              ease: "easeInOut",
            }}
          />
        );
      })}
    </div>
  );
};

export default ShootingStars; 