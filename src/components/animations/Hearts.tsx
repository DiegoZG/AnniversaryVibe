import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface HeartsProps {
  isActive: boolean;
  index?: number;
}

// Heart colors for a nice gradient effect
const heartColors = [
  '#ff86b6', // Light pink
  '#ff5c8d', // Pink
  '#ff477e', // Hot pink
  '#ff0a54', // Deep pink
  '#ff7096', // Rose
  '#ffb3c6', // Light rose
];

const Hearts: React.FC<HeartsProps> = ({ isActive }) => {
  const [hearts, setHearts] = useState<{
    id: number;
    x: number;
    size: number;
    opacity: number;
    color: string;
    delay: number;
    duration: number;
    rotate: number;
  }[]>([]);

  useEffect(() => {
    if (!isActive) {
      setHearts([]);
      return;
    }

    // Create initial hearts with different sizes and positions
    const initialHearts = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 90 + 5, // 5-95% to stay away from edges
      size: Math.random() * 20 + 10, // 10-30px
      opacity: Math.random() * 0.3 + 0.3, // 0.3-0.6 opacity (subtle)
      color: heartColors[Math.floor(Math.random() * heartColors.length)],
      delay: Math.random() * 5, // 0-5s delay
      duration: Math.random() * 10 + 15, // 15-25s to float up
      rotate: Math.random() * 30 - 15, // -15 to 15 degrees rotation
    }));

    setHearts(initialHearts);

    // Add new hearts periodically
    const interval = setInterval(() => {
      const newHeart = {
        id: Date.now(),
        x: Math.random() * 90 + 5,
        size: Math.random() * 20 + 10,
        opacity: Math.random() * 0.3 + 0.3,
        color: heartColors[Math.floor(Math.random() * heartColors.length)],
        delay: 0,
        duration: Math.random() * 10 + 15,
        rotate: Math.random() * 30 - 15,
      };
      
      setHearts(prev => [...prev.slice(-40), newHeart]); // Keep max 40 hearts
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {hearts.map(heart => (
        <motion.div
          key={heart.id}
          initial={{ 
            x: `${heart.x}vw`,
            y: '100vh', 
            opacity: 0,
            rotate: heart.rotate,
          }}
          animate={{ 
            y: '-10vh',
            opacity: [0, heart.opacity, heart.opacity, 0],
            rotate: heart.rotate,
          }}
          transition={{ 
            duration: heart.duration,
            delay: heart.delay,
            ease: "easeOut",
            opacity: {
              times: [0, 0.1, 0.9, 1]
            }
          }}
          className="absolute animate-sway"
          style={{
            width: `${heart.size}px`,
            height: `${heart.size}px`,
          }}
        >
          {/* SVG Heart instead of emoji */}
          <svg 
            viewBox="0 0 24 24" 
            fill={heart.color}
            className="w-full h-full animate-shimmer"
          >
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default Hearts; 