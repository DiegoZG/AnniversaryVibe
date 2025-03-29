import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface BalloonsProps {
  isActive: boolean;
  index?: number;
}

// Balloon colors
const balloonColors = [
  '#FF9AA2', // Light pink
  '#FFB7B2', // Salmon
  '#FFDAC1', // Light peach
  '#E2F0CB', // Light green
  '#B5EAD7', // Mint
  '#C7CEEA', // Periwinkle
  '#F8B3D9', // Light magenta
  '#FFAEBC', // Light coral
];

const Balloons: React.FC<BalloonsProps> = ({ isActive }) => {
  const [balloons, setBalloons] = useState<{
    id: number;
    x: number;
    color: string;
    size: number;
    delay: number;
    duration: number;
    swayFactor: number;
    rotation: number;
  }[]>([]);

  useEffect(() => {
    if (!isActive) {
      setBalloons([]);
      return;
    }

    // Create initial balloons with different properties
    const initialBalloons = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 90 + 5, // 5-95% to stay within the screen
      color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
      size: Math.random() * 30 + 20, // 20-50px
      delay: Math.random() * 5, // 0-5s delay
      duration: Math.random() * 10 + 15, // 15-25s to float up
      swayFactor: Math.random() * 20 + 10, // 10-30px sway
      rotation: Math.random() * 20 - 10, // -10 to 10 degrees
    }));

    setBalloons(initialBalloons);

    // Add new balloons periodically
    const interval = setInterval(() => {
      const newBalloon = {
        id: Date.now(),
        x: Math.random() * 90 + 5,
        color: balloonColors[Math.floor(Math.random() * balloonColors.length)],
        size: Math.random() * 30 + 20,
        delay: 0,
        duration: Math.random() * 10 + 15,
        swayFactor: Math.random() * 20 + 10,
        rotation: Math.random() * 20 - 10,
      };
      
      setBalloons(prev => [...prev.slice(-25), newBalloon]); // Keep max 25 balloons
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {balloons.map(balloon => (
        <motion.div
          key={balloon.id}
          initial={{ 
            x: `${balloon.x}vw`,
            y: '100vh', 
            opacity: 0,
            rotate: balloon.rotation,
          }}
          animate={{ 
            x: [
              `${balloon.x}vw`,
              `${balloon.x - balloon.swayFactor / 80}vw`,
              `${balloon.x + balloon.swayFactor / 80}vw`,
              `${balloon.x}vw`,
            ],
            y: '-10vh',
            opacity: [0, 0.8, 0.8, 0],
            rotate: [
              balloon.rotation,
              balloon.rotation - 5,
              balloon.rotation + 5,
              balloon.rotation,
            ],
          }}
          transition={{ 
            duration: balloon.duration,
            delay: balloon.delay,
            ease: "easeOut",
            times: [0, 0.3, 0.7, 1],
            opacity: {
              times: [0, 0.1, 0.9, 1]
            }
          }}
          className="absolute"
          style={{
            width: `${balloon.size}px`,
            height: `${balloon.size * 1.2}px`, // slightly taller for balloon shape
          }}
        >
          {/* SVG Balloon */}
          <svg
            viewBox="0 0 32 40"
            className="w-full h-full animate-sway filter drop-shadow(0 2px 3px rgba(0,0,0,0.2))"
          >
            {/* Balloon body */}
            <path
              d="M16 2C9.373 2 4 7.373 4 14c0 4.127 2.075 7.766 5.235 9.958C10.214 25.052 11 26.828 11 28h10c0-1.172 0.786-2.948 1.765-4.042C25.925 21.766 28 18.127 28 14 28 7.373 22.627 2 16 2z"
              fill={balloon.color}
              className="animate-shimmer"
            />
            {/* String */}
            <path
              d="M16 28v10"
              stroke="#FFFFFF"
              strokeWidth="0.7"
              fill="none"
              className="animate-sway"
              style={{ 
                animationDelay: `${Math.random()}s`,
                transformOrigin: 'top' 
              }}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  );
};

export default Balloons; 