import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface PetalRainProps {
  isActive: boolean;
  index?: number;
}

// Different petal shapes and colors
const petalShapes = ['🌸', '🌷', '🌹', '🥀', '🌺', '🌻', '🌼', '💐', '🍀', '🍁', '🍂', '🍃'];
const petalColors = [
  'rgb(255, 192, 203)', // Pink
  'rgb(255, 105, 180)', // Hot Pink
  'rgb(255, 0, 0)',     // Red
  'rgb(255, 255, 255)', // White
  'rgb(255, 215, 0)',   // Gold
  'rgb(255, 165, 0)',   // Orange
  'rgb(255, 222, 173)', // Navajo White
];

const PetalRain: React.FC<PetalRainProps> = ({ isActive }) => {
  const [petals, setPetals] = useState<{
    id: number;
    shape: string;
    x: number;
    size: number;
    rotation: number;
    color: string;
    delay: number;
    duration: number;
    swingFactor: number;
  }[]>([]);

  useEffect(() => {
    if (!isActive) {
      setPetals([]);
      return;
    }

    // Create initial petals
    const initialPetals = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      shape: petalShapes[Math.floor(Math.random() * petalShapes.length)],
      x: Math.random() * 100, // Position across screen width (0-100%)
      size: Math.random() * 15 + 15, // 15-30px
      rotation: Math.random() * 360, // Random initial rotation
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      delay: Math.random() * 10, // 0-10s delay for staggered effect
      duration: Math.random() * 10 + 8, // 8-18s to fall
      swingFactor: Math.random() * 30 + 10, // 10-40% swing
    }));

    setPetals(initialPetals);

    // Add new petals periodically
    const interval = setInterval(() => {
      setPetals(prev => [
        ...prev,
        {
          id: Date.now(),
          shape: petalShapes[Math.floor(Math.random() * petalShapes.length)],
          x: Math.random() * 100,
          size: Math.random() * 15 + 15,
          rotation: Math.random() * 360,
          color: petalColors[Math.floor(Math.random() * petalColors.length)],
          delay: 0,
          duration: Math.random() * 10 + 8,
          swingFactor: Math.random() * 30 + 10,
        }
      ].slice(-60)); // Keep maximum 60 petals to maintain performance
    }, 800);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {petals.map(petal => {
        // Calculate how much the petal will swing left and right
        const swingAmount = petal.swingFactor;
        
        return (
          <motion.div
            key={petal.id}
            initial={{ 
              x: `${petal.x}vw`, 
              y: '-10vh',
              rotate: petal.rotation,
              opacity: 0
            }}
            animate={{ 
              x: [
                `${petal.x}vw`, 
                `${petal.x - swingAmount / 2}vw`, 
                `${petal.x + swingAmount}vw`, 
                `${petal.x - swingAmount}vw`, 
                `${petal.x + swingAmount / 2}vw`
              ],
              y: ['0vh', '25vh', '50vh', '75vh', '120vh'],
              rotate: [
                petal.rotation,
                petal.rotation + 40,
                petal.rotation + 20,
                petal.rotation + 60,
                petal.rotation + 30
              ],
              opacity: [0, 0.8, 1, 0.9, 0]
            }}
            transition={{ 
              duration: petal.duration,
              delay: petal.delay,
              ease: "linear",
              times: [0, 0.25, 0.5, 0.75, 1]
            }}
            className="absolute"
            style={{
              fontSize: `${petal.size}px`,
              textShadow: `0 0 5px ${petal.color}`,
              zIndex: Math.floor(petal.size),
            }}
          >
            {petal.shape}
          </motion.div>
        );
      })}
    </div>
  );
};

export default PetalRain; 