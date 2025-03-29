import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FlyingLoveLettersProps {
  isActive: boolean;
}

// Define love letter-related phrases
const loveMessages = [
  'I Love You',
  'Forever Yours',
  'My Heart',
  'Be Mine',
  'Soul Mate',
  'Always & Forever',
  'Meant To Be',
  'Love Always',
  'XOXO',
  'Miss You',
];

// Define colors for the letters
const letterColors = [
  '#FF6B6B', // Soft red
  '#FF85A1', // Pink
  '#FFA8B6', // Light pink
  '#D94A8C', // Rose
  '#FF5E78', // Coral
];

const FlyingLoveLetters: React.FC<FlyingLoveLettersProps> = ({ isActive }) => {
  const [letters, setLetters] = useState<Array<{
    id: number;
    text: string;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    color: string;
    delay: number;
    duration: number;
  }>>([]);

  useEffect(() => {
    if (!isActive) {
      setLetters([]);
      return;
    }

    // Create initial letters
    const initialLetters = Array.from({ length: 10 }, (_, i) => {
      const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
      return {
        id: i,
        text: randomMessage,
        x: Math.random() * 90 + 5, // Position between 5-95% of screen width
        y: Math.random() * 90 + 5, // Position between 5-95% of screen height
        rotation: Math.random() * 30 - 15, // Rotation between -15 and 15 degrees
        scale: Math.random() * 0.4 + 0.8, // Scale between 0.8 and 1.2
        color: letterColors[Math.floor(Math.random() * letterColors.length)],
        delay: Math.random() * 5, // Delay between 0-5s
        duration: Math.random() * 8 + 12, // Duration between 12-20s
      };
    });

    setLetters(initialLetters);

    // Add new letters periodically
    const interval = setInterval(() => {
      const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
      const newLetter = {
        id: Date.now(),
        text: randomMessage,
        x: Math.random() * 90 + 5,
        y: -10, // Start from above the viewport
        rotation: Math.random() * 30 - 15,
        scale: Math.random() * 0.4 + 0.8,
        color: letterColors[Math.floor(Math.random() * letterColors.length)],
        delay: 0,
        duration: Math.random() * 8 + 12,
      };

      setLetters(prev => [...prev.slice(-15), newLetter]); // Keep maximum 15 letters
    }, 2000);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive || !letters.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {letters.map(letter => (
        <motion.div
          key={letter.id}
          className="absolute flex items-center justify-center"
          style={{
            left: `${letter.x}%`,
            top: `${letter.y}%`,
            color: letter.color,
            fontFamily: "'Dancing Script', cursive, sans-serif",
            textShadow: `0 0 2px white, 0 0 4px ${letter.color}`,
            fontSize: `${Math.max(16, Math.min(28, 22 * letter.scale))}px`,
            fontWeight: 600,
          }}
          initial={{
            opacity: 0,
            scale: 0,
            rotate: letter.rotation - 10,
          }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: ['0%', '-10%', '-60%', '-120%'],
            scale: [0, letter.scale, letter.scale * 0.9, 0],
            rotate: [letter.rotation - 10, letter.rotation, letter.rotation + 10, letter.rotation - 5],
          }}
          transition={{
            duration: letter.duration,
            delay: letter.delay,
            ease: "easeInOut",
            times: [0, 0.1, 0.8, 1],
          }}
        >
          {/* SVG envelope with love letter */}
          <div className="relative">
            <svg
              width={Math.max(80, Math.min(120, 100 * letter.scale))}
              height={Math.max(60, Math.min(90, 75 * letter.scale))}
              viewBox="0 0 100 75"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: `drop-shadow(0px 2px 4px rgba(0,0,0,0.2))` }}
            >
              {/* Envelope background */}
              <rect x="5" y="15" width="90" height="55" rx="2" fill="white" />
              
              {/* Envelope flap */}
              <path
                d="M5 17L50 45L95 17V15C95 13.8954 94.1046 13 93 13H7C5.89543 13 5 13.8954 5 15V17Z"
                fill={`${letter.color}33`} // Semi-transparent version of color
              />
              
              {/* Envelope body */}
              <rect x="5" y="15" width="90" height="55" rx="2" stroke={letter.color} strokeWidth="1.5" />
              
              {/* Envelope fold lines */}
              <path d="M5 15L50 45L95 15" stroke={letter.color} strokeWidth="1.5" />
              
              {/* Heart wax seal */}
              <path
                d="M50 62C51.5 59.5 55 56.5 58 59.5C61 62.5 57 66.5 50 70C43 66.5 39 62.5 42 59.5C45 56.5 48.5 59.5 50 62Z"
                fill={letter.color}
              />
            </svg>
            
            {/* Text overlay */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center"
              style={{
                fontSize: `${Math.max(10, Math.min(14, 12 * letter.scale))}px`,
                color: letter.color,
                fontWeight: 'bold',
                textShadow: '0px 0px 2px white',
                maxWidth: '80%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {letter.text}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default FlyingLoveLetters; 