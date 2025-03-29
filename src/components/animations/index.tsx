import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ParticlesContainer from '../ParticleEffects';

export interface AnimationProps {
  isActive: boolean;
  index?: number;
}

// Empty default animation (serves as a fallback)
const DefaultAnimation: React.FC<AnimationProps> = () => null;

// Flying Love Letters Animation
const FlyingLoveLetters: React.FC<AnimationProps> = ({ isActive }) => {
  const [letters, setLetters] = useState<Array<{
    id: number;
    text: string;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    color: string;
    delay: number;
  }>>([]);

  // Define love letter-related phrases
  const loveMessages = [
    'I Love You',
    'Forever Yours',
    'My Heart',
    'Be Mine',
    'XOXO',
    'Always & Forever',
  ];

  // Letter colors
  const letterColors = [
    '#FF6B6B', // Soft red
    '#FF85A1', // Pink
    '#FFA8B6', // Light pink
    '#D94A8C', // Rose
    '#FF5E78', // Coral
  ];

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
        delay: Math.random() * 3, // Delay between 0-3s
      };
    });

    setLetters(initialLetters);

    // Add new letters periodically
    const interval = setInterval(() => {
      const randomMessage = loveMessages[Math.floor(Math.random() * loveMessages.length)];
      
      // Create new letters from different positions
      const positions = [
        { x: Math.random() * 90 + 5, y: -10 }, // From top
        { x: -10, y: Math.random() * 90 + 5 }, // From left
        { x: Math.random() * 90 + 5, y: 110 }, // From bottom
        { x: 110, y: Math.random() * 90 + 5 }, // From right
      ];
      
      const position = positions[Math.floor(Math.random() * positions.length)];
      
      const newLetter = {
        id: Date.now(),
        text: randomMessage,
        x: position.x,
        y: position.y,
        rotation: Math.random() * 30 - 15,
        scale: Math.random() * 0.4 + 0.8,
        color: letterColors[Math.floor(Math.random() * letterColors.length)],
        delay: 0,
      };

      setLetters(prev => [...prev.slice(-15), newLetter]); // Keep maximum 15 letters
    }, 1500);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive || !letters.length) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {letters.map(letter => {
        // Determine animation target based on starting position
        let yTarget, xTarget;
        if (letter.y < 0) { // From top
          yTarget = ['0%', '30%', '60%', '120%'];
          xTarget = [`${letter.x}%`, `${letter.x + 10}%`, `${letter.x - 10}%`, `${letter.x + 5}%`];
        } else if (letter.x < 0) { // From left
          xTarget = ['0%', '30%', '60%', '120%'];
          yTarget = [`${letter.y}%`, `${letter.y - 10}%`, `${letter.y + 10}%`, `${letter.y - 5}%`];
        } else if (letter.y > 100) { // From bottom
          yTarget = ['0%', '-30%', '-60%', '-120%'];
          xTarget = [`${letter.x}%`, `${letter.x - 10}%`, `${letter.x + 10}%`, `${letter.x - 5}%`];
        } else if (letter.x > 100) { // From right
          xTarget = ['0%', '-30%', '-60%', '-120%'];
          yTarget = [`${letter.y}%`, `${letter.y + 10}%`, `${letter.y - 10}%`, `${letter.y + 5}%`];
        } else { // Initial letters
          yTarget = ['0%', '-20%', '-40%', '-80%'];
          xTarget = [`${letter.x}%`, `${letter.x + 8}%`, `${letter.x - 8}%`, `${letter.x + 4}%`];
        }
        
        return (
          <motion.div
            key={letter.id}
            className="absolute flex items-center justify-center"
            style={{
              left: `${letter.x}%`,
              top: `${letter.y}%`,
            }}
            initial={{
              opacity: 0,
              scale: 0,
              rotate: letter.rotation - 10,
            }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: yTarget,
              x: xTarget,
              scale: [0, letter.scale, letter.scale * 0.9, 0],
              rotate: [letter.rotation - 10, letter.rotation, letter.rotation + 10, letter.rotation - 5],
            }}
            transition={{
              duration: 12,
              delay: letter.delay,
              ease: "easeInOut",
              times: [0, 0.1, 0.8, 1],
            }}
          >
            <div 
              style={{
                color: letter.color,
                fontSize: `${Math.max(20, Math.min(32, 26 * letter.scale))}px`,
                fontWeight: 'bold',
                textShadow: `0 0 5px white, 0 0 8px ${letter.color}`,
              }}
            >
              {letter.text}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Rainbow Sparkles Animation
const RainbowSparkles: React.FC<AnimationProps> = ({ isActive }) => {
  const [sparkles, setSparkles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    delay: number;
    duration: number;
  }>>([]);
  
  useEffect(() => {
    if (!isActive) {
      setSparkles([]);
      return;
    }
    
    // Create initial sparkles
    const createInitialSparkles = () => {
      // Create sparkles that cover the entire screen
      const newSparkles = Array.from({ length: 80 }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // Spread across the entire width
        y: Math.random() * 100, // Spread across the entire height
        size: Math.random() * 12 + 4, // 4-16px
        color: `hsl(${Math.random() * 360}, 80%, 60%)`, // Random color
        delay: Math.random() * 3, // 0-3s delay
        duration: Math.random() * 3 + 2, // 2-5s duration
      }));
      
      setSparkles(newSparkles);
    };
    
    createInitialSparkles();
    
    // Add new sparkles periodically
    const interval = setInterval(() => {
      const newSparkle = {
        id: Date.now(),
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 12 + 4,
        color: `hsl(${Math.random() * 360}, 80%, 60%)`,
        delay: 0,
        duration: Math.random() * 3 + 2,
      };
      
      setSparkles(prev => [...prev.slice(-100), newSparkle]); // Keep maximum 100 sparkles
    }, 300);
    
    return () => clearInterval(interval);
  }, [isActive]);
  
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {sparkles.map(sparkle => (
        <motion.div
          key={sparkle.id}
          className="absolute rounded-full"
          style={{
            left: `${sparkle.x}%`,
            top: `${sparkle.y}%`,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            backgroundColor: sparkle.color,
            boxShadow: `0 0 ${sparkle.size/2}px ${sparkle.color}`,
          }}
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{ 
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: sparkle.duration,
            delay: sparkle.delay,
            ease: "easeInOut",
            times: [0, 0.5, 1],
          }}
        />
      ))}
    </div>
  );
};

// Shooting Stars Animation
const ShootingStars: React.FC<AnimationProps> = ({ isActive }) => {
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
  }>>([]);
  
  // Star colors
  const starColors = [
    '#FFFFFF', // White
    '#E6E6FA', // Lavender
    '#ADD8E6', // Light Blue
    '#87CEFA', // Sky Blue
    '#FFFFCC', // Light Yellow
  ];
  
  useEffect(() => {
    if (!isActive) {
      setStars([]);
      return;
    }
    
    // Create initial stars
    const generateStar = (id: number, delay = 0) => {
      // Determine a random diagonal path across the screen
      const quadrant = Math.floor(Math.random() * 4); // 0-3 for different directions
      
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
      };
    };
    
    // Create initial stars
    const initialStars = Array.from({ length: 8 }, (_, i) => 
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
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
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
              opacity: 0.8,
            }}
            initial={{ scale: 0 }}
            animate={{
              left: `${star.endX}%`,
              top: `${star.endY}%`,
              scale: [0, 1, 0.8, 0],
              opacity: [0, 0.8, 0.6, 0],
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
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: star.duration * 0.8,
              delay: star.delay,
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

// Animation mapping - only include working animations
export const animations: Record<string, React.FC<AnimationProps>> = {
  'confetti': ({ isActive }) => isActive ? <ParticlesContainer type="confetti" /> : null,
  'flying-love-letters': FlyingLoveLetters,
  'rainbow-sparkles': RainbowSparkles,
  'shooting-stars': ShootingStars
};

export interface AnimationRendererProps {
  animationType: string;
  isActive: boolean;
  index?: number;
}

const AnimationRenderer: React.FC<AnimationRendererProps> = ({ animationType, isActive, index }) => {
  const Animation = animations[animationType] || DefaultAnimation;
  return <Animation isActive={isActive} index={index} />;
};

export default AnimationRenderer; 