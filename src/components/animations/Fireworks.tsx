import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface FireworksProps {
  isActive: boolean;
  index?: number;
}

// Firework colors
const fireworkColors = [
  '#FF3131', // Red
  '#FF5F1F', // Orange
  '#FFDE59', // Yellow
  '#7EC8E3', // Light Blue
  '#FF1493', // Deep Pink
  '#9D00FF', // Purple
  '#50C878', // Emerald
  '#FFFFFF', // White
];

const Fireworks: React.FC<FireworksProps> = ({ isActive }) => {
  const [fireworks, setFireworks] = useState<{
    id: number;
    x: number;
    y: number;
    size: number;
    color: string;
    duration: number;
    delay: number;
    particleCount: number;
  }[]>([]);

  // Generate firework explosion particles
  const generateParticles = (count: number, color: string) => {
    return Array.from({ length: count }, (_, i) => {
      const angle = (i * (360 / count)) * (Math.PI / 180);
      const distance = Math.random() * 50 + 30; // 30-80px
      const delay = Math.random() * 0.5;
      const duration = Math.random() * 1.5 + 1; // 1-2.5s
      const size = Math.random() * 4 + 2; // 2-6px
      
      return { angle, distance, delay, duration, size };
    });
  };

  useEffect(() => {
    if (!isActive) {
      setFireworks([]);
      return;
    }

    // Fire initial fireworks
    const initialFireworks = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10, // 10-90%
      y: Math.random() * 50 + 10, // 10-60%
      size: Math.random() * 6 + 4, // 4-10px
      color: fireworkColors[Math.floor(Math.random() * fireworkColors.length)],
      duration: Math.random() * 0.5 + 0.8, // 0.8-1.3s
      delay: Math.random() * 2, // 0-2s delay
      particleCount: Math.floor(Math.random() * 8) + 8, // 8-16 particles
    }));

    setFireworks(initialFireworks);

    // Fire new fireworks periodically
    const interval = setInterval(() => {
      const newFirework = {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: Math.random() * 50 + 10,
        size: Math.random() * 6 + 4,
        color: fireworkColors[Math.floor(Math.random() * fireworkColors.length)],
        duration: Math.random() * 0.5 + 0.8,
        delay: 0,
        particleCount: Math.floor(Math.random() * 8) + 8,
      };
      
      setFireworks(prev => [...prev.slice(-12), newFirework]); // Keep max 12 fireworks
    }, 800);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {fireworks.map(firework => (
        <div
          key={firework.id}
          className="absolute"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
          }}
        >
          {/* Rocket trail */}
          <motion.div
            initial={{ 
              height: 0,
              opacity: 0,
              bottom: '-20vh',
              left: '50%',
              width: '2px',
              marginLeft: '-1px',
            }}
            animate={{ 
              height: '20vh', 
              opacity: [0, 0.3, 0],
              bottom: 0,
            }}
            transition={{ 
              duration: firework.duration * 0.8,
              delay: firework.delay,
              ease: "easeOut",
            }}
            className="absolute bg-gradient-to-b from-transparent to-white"
          />
          
          {/* Explosion center */}
          <motion.div
            initial={{ 
              scale: 0,
              opacity: 0,
            }}
            animate={{ 
              scale: [0, 1.5, 0],
              opacity: [0, 1, 0],
            }}
            transition={{ 
              duration: firework.duration,
              delay: firework.delay + firework.duration * 0.8,
              ease: "easeOut",
            }}
            className="absolute w-1 h-1 rounded-full"
            style={{ 
              background: firework.color,
              boxShadow: `0 0 ${firework.size * 2}px ${firework.size}px ${firework.color}`,
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          
          {/* Explosion particles */}
          {generateParticles(firework.particleCount, firework.color).map((particle, index) => (
            <motion.div
              key={index}
              initial={{ 
                x: 0,
                y: 0,
                scale: 0,
                opacity: 0,
              }}
              animate={{ 
                x: Math.cos(particle.angle) * particle.distance,
                y: Math.sin(particle.angle) * particle.distance,
                scale: [0, 1, 0],
                opacity: [0, 0.8, 0],
              }}
              transition={{ 
                duration: particle.duration,
                delay: firework.delay + firework.duration * 0.8 + particle.delay,
                ease: "easeOut",
              }}
              className="absolute w-1 h-1 rounded-full"
              style={{ 
                background: firework.color,
                boxShadow: `0 0 ${particle.size}px ${particle.size / 2}px ${firework.color}`,
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Fireworks; 