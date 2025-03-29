import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface MessageInABottleProps {
  isActive: boolean;
  index?: number;
}

const MessageInABottle: React.FC<MessageInABottleProps> = ({ isActive, index = 0 }) => {
  const [bottles, setBottles] = useState<Array<{ id: number; position: number; delay: number }>>([]);
  
  // Use different colors for bottles and messages based on index
  const bottleColors = [
    'text-blue-500', // Default blue
    'text-cyan-600',
    'text-teal-500',
    'text-emerald-600',
  ];
  
  const messageColors = [
    'text-red-500', // Default red
    'text-pink-500',
    'text-purple-500',
    'text-orange-500',
  ];
  
  const bottleColor = bottleColors[index % bottleColors.length];
  const messageColor = messageColors[index % messageColors.length];

  useEffect(() => {
    if (!isActive) return;

    // Create initial bottles
    const initialBottles = Array.from({ length: 4 }, (_, i) => ({
      id: i,
      position: Math.random() * 80 + 10, // 10-90% width
      delay: Math.random() * 4,
    }));

    setBottles(initialBottles);

    // Add more bottles periodically
    const interval = setInterval(() => {
      if (bottles.length > 20) {
        setBottles(prev => prev.slice(1)); // Remove oldest bottle
      }
      
      const newBottle = {
        id: Date.now(),
        position: Math.random() * 80 + 10,
        delay: 0,
      };
      
      setBottles(prev => [...prev, newBottle]);
    }, 5000); // New bottle every 5 seconds

    return () => clearInterval(interval);
  }, [isActive, bottles.length]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {bottles.map(bottle => (
        <motion.div
          key={bottle.id}
          className="absolute flex items-center justify-center"
          style={{ 
            left: `${bottle.position}%`,
            bottom: '-20%',
          }}
          initial={{ 
            y: 0, 
            opacity: 0,
            rotate: Math.random() * 20 - 10 
          }}
          animate={{ 
            y: '-130vh', 
            opacity: [0, 1, 0.8, 0.5],
            rotate: [
              Math.random() * 20 - 10,
              Math.random() * 20 - 10,
              Math.random() * 20 - 10
            ]
          }}
          transition={{ 
            duration: 15 + Math.random() * 5,
            delay: bottle.delay,
            ease: "linear",
            rotate: {
              duration: 15,
              times: [0, 0.5, 1],
              ease: "easeInOut"
            }
          }}
        >
          <div className="relative">
            {/* Bottle */}
            <div className={`text-4xl md:text-5xl lg:text-6xl ${bottleColor}`}>🍾</div>
            
            {/* Message heart (appearing from bottle) */}
            <motion.div 
              className={`absolute top-0 ${messageColor} text-xl md:text-2xl`}
              style={{ left: '50%', marginLeft: '-0.5em', marginTop: '-0.5em' }}
              animate={{ 
                y: [0, -15, -10], 
                opacity: [0, 1, 0.8],
                scale: [0.5, 1, 0.9]
              }}
              transition={{
                duration: 3,
                delay: bottle.delay + 3 + Math.random() * 2,
                repeat: 0,
                ease: "easeOut"
              }}
            >
              ❤️
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MessageInABottle; 