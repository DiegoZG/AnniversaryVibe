import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface HeartConstellationProps {
  isActive: boolean;
  index?: number;
}

// Star colors with purple/pink theme
const starColors = [
  '#FF69B4', // Hot Pink
  '#FF1493', // Deep Pink
  '#C71585', // Medium Violet Red
  '#DB7093', // Pale Violet Red
  '#FFB6C1', // Light Pink
  '#FFC0CB', // Pink
  '#FFFFFF', // White
];

// Connection line color
const lineColor = 'rgba(255, 105, 180, 0.3)'; // Transparent hot pink

const HeartConstellation: React.FC<HeartConstellationProps> = ({ isActive }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [stars, setStars] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    delay: number;
    pulseDelay: number;
  }>>([]);
  
  useEffect(() => {
    if (!isActive) {
      setIsVisible(false);
      return;
    }
    
    // Delay visibility for a nice entrance effect
    const visibilityTimer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    return () => clearTimeout(visibilityTimer);
  }, [isActive]);
  
  useEffect(() => {
    if (!isVisible) {
      setStars([]);
      return;
    }
    
    // Create heart constellation stars
    const createHeartConstellation = () => {
      // Heart shape coordinates (normalized to 0-100 range)
      const heartPoints = [
        // Left curve
        { x: 50, y: 25 },
        { x: 40, y: 20 },
        { x: 30, y: 25 },
        { x: 25, y: 35 },
        { x: 30, y: 45 },
        { x: 40, y: 55 },
        // Bottom point
        { x: 50, y: 70 },
        // Right curve
        { x: 60, y: 55 },
        { x: 70, y: 45 },
        { x: 75, y: 35 },
        { x: 70, y: 25 },
        { x: 60, y: 20 },
        { x: 50, y: 25 },
        // Interior stars
        { x: 40, y: 35 },
        { x: 60, y: 35 },
        { x: 50, y: 45 },
        { x: 45, y: 60 },
        { x: 55, y: 60 },
      ];
      
      // Add some random stars around the heart
      const randomStars = Array.from({ length: 12 }, () => ({
        x: Math.random() * 80 + 10, // 10-90
        y: Math.random() * 80 + 10, // 10-90
      }));
      
      // Combine heart points and random stars
      const allPoints = [...heartPoints, ...randomStars];
      
      // Create star objects
      const starObjects = allPoints.map((point, i) => ({
        id: i,
        x: point.x,
        y: point.y,
        size: Math.random() * 2 + (i < heartPoints.length ? 2 : 1), // Heart stars are slightly larger
        color: starColors[Math.floor(Math.random() * starColors.length)],
        delay: Math.random() * 1.5,
        pulseDelay: Math.random() * 3,
      }));
      
      setStars(starObjects);
    };
    
    createHeartConstellation();
  }, [isVisible]);
  
  // Function to determine if two stars should be connected
  // For heart stars, we connect consecutive points and some interior connections
  const shouldConnect = (star1: any, star2: any) => {
    if (star1.id < 13 && star2.id < 13) {
      // Connect consecutive heart outline points
      if (Math.abs(star1.id - star2.id) === 1 || (star1.id === 0 && star2.id === 12) || (star1.id === 12 && star2.id === 0)) {
        return true;
      }
    }
    
    // Connect some interior stars to create a more complex constellation
    if ((star1.id < 13 && star2.id >= 13 && star2.id < 18) || 
        (star2.id < 13 && star1.id >= 13 && star1.id < 18)) {
      // Calculate distance between stars
      const distance = Math.sqrt(
        Math.pow(star1.x - star2.x, 2) + 
        Math.pow(star1.y - star2.y, 2)
      );
      
      // Connect if they're close enough
      return distance < 20;
    }
    
    return false;
  };
  
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      <svg className="absolute inset-0 w-full h-full">
        {/* Connection lines */}
        {isVisible && stars.map((star1, i) => (
          stars.slice(i + 1).map(star2 => {
            if (shouldConnect(star1, star2)) {
              return (
                <motion.line
                  key={`line-${star1.id}-${star2.id}`}
                  x1={`${star1.x}%`}
                  y1={`${star1.y}%`}
                  x2={`${star2.x}%`}
                  y2={`${star2.y}%`}
                  stroke={lineColor}
                  strokeWidth="1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    duration: 1.5,
                    delay: Math.max(star1.delay, star2.delay) + 0.5,
                  }}
                />
              );
            }
            return null;
          })
        ))}
      </svg>
      
      {/* Stars */}
      {stars.map(star => (
        <motion.div
          key={`star-${star.id}`}
          className="absolute rounded-full"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            backgroundColor: star.color,
            boxShadow: `0 0 ${star.size * 2}px ${star.color}`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: 1, 
            opacity: 1,
          }}
          transition={{
            duration: 1,
            delay: star.delay,
          }}
        >
          {/* Pulsing animation overlaid on each star */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ backgroundColor: star.color }}
            animate={{ 
              scale: [1, 1.8, 1],
              opacity: [1, 0, 1],
            }}
            transition={{
              duration: 3,
              delay: star.pulseDelay,
              repeat: Infinity,
              repeatDelay: Math.random() * 5 + 2,
            }}
          />
        </motion.div>
      ))}
      
      {/* Subtle glow in the center of the heart */}
      {isVisible && (
        <motion.div
          className="absolute rounded-full"
          style={{
            left: '50%',
            top: '45%',
            width: '50px',
            height: '50px',
            background: 'radial-gradient(circle, rgba(255,105,180,0.3) 0%, rgba(255,105,180,0) 70%)',
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: [0, 0.6, 0.3, 0.5, 0.2],
            scale: [0, 1.2, 1, 1.5, 1.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
      )}
      
      {/* Background stars */}
      {Array.from({ length: 30 }).map((_, index) => {
        const size = Math.random() * 1.5 + 0.5;
        const opacity = Math.random() * 0.7 + 0.3;
        
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
              opacity,
            }}
            animate={{
              opacity: [opacity, opacity * 1.5, opacity],
              scale: [1, 1.2, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 3 + 2,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
};

export default HeartConstellation; 