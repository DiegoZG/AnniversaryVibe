import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RainbowSparklesProps {
  isActive: boolean;
  index?: number;
}

// Rainbow colors
const rainbowColors = [
  '#FF0000', // Red
  '#FF7F00', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#9400D3', // Violet
  '#FF1493', // Pink
  '#FFD700', // Gold
];

const RainbowSparkles: React.FC<RainbowSparklesProps> = ({ isActive }) => {
  const [sparkles, setSparkles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    delay: number;
    duration: number;
    rotation: number;
  }>>([]);

  useEffect(() => {
    if (!isActive) {
      setSparkles([]);
      return;
    }

    // Create initial sparkles
    const initialSparkles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 8 + 4, // 4-12px
      color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
      delay: Math.random() * 5,
      duration: Math.random() * 2 + 2, // 2-4s
      rotation: Math.random() * 360,
    }));

    setSparkles(initialSparkles);

    // Add new sparkles periodically
    const interval = setInterval(() => {
      const newSparkle = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 8 + 4,
        color: rainbowColors[Math.floor(Math.random() * rainbowColors.length)],
        delay: 0,
        duration: Math.random() * 2 + 2,
        rotation: Math.random() * 360,
      };

      setSparkles(prev => [...prev.slice(-80), newSparkle]); // Keep maximum 80 sparkles
    }, 200);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {sparkles.map(sparkle => (
        <motion.div
          key={sparkle.id}
          className="absolute"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
          }}
          initial={{
            scale: 0,
            opacity: 0,
            rotate: sparkle.rotation,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
            rotate: [sparkle.rotation, sparkle.rotation + 180],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
        >
          {/* SVG sparkle */}
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: `drop-shadow(0 0 2px ${sparkle.color})`,
              width: '100%',
              height: '100%',
            }}
          >
            <path
              d="M12 0L13.2 10.8L24 12L13.2 13.2L12 24L10.8 13.2L0 12L10.8 10.8L12 0Z"
              fill={sparkle.color}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default RainbowSparkles; 