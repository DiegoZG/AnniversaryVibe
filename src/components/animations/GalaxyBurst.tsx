import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface GalaxyBurstProps {
  isActive: boolean;
  index?: number;
}

// Galaxy colors
const galaxyColors = [
  '#9D00FF', // Purple
  '#7122FA', // Violet
  '#3B82F6', // Blue
  '#00BFFF', // Deep sky blue
  '#FF1493', // Deep pink
  '#FF007F', // Rose
  '#FF00FF', // Magenta
  '#F472B6', // Pink
];

const GalaxyBurst: React.FC<GalaxyBurstProps> = ({ isActive }) => {
  const [burstActive, setBurstActive] = useState(false);
  const [particles, setParticles] = useState<Array<{
    id: number;
    angle: number;
    distance: number;
    size: number;
    color: string;
    delay: number;
    duration: number;
    opacity: number;
  }>>([]);
  
  useEffect(() => {
    if (!isActive) {
      setBurstActive(false);
      setParticles([]);
      return;
    }
    
    // Set burst active after a small delay for the initial animation
    const timer = setTimeout(() => {
      setBurstActive(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [isActive]);
  
  useEffect(() => {
    if (!burstActive) return;
    
    // Create galaxy particles for the burst
    const createParticles = () => {
      const newParticles = Array.from({ length: 150 }, (_, i) => {
        const angle = Math.random() * Math.PI * 2; // Random angle in radians (0-2π)
        const distance = Math.random() * 80 + 20; // Distance from center (20-100)
        
        return {
          id: i,
          angle,
          distance,
          size: Math.random() * 4 + 1, // Size between 1-5px
          color: galaxyColors[Math.floor(Math.random() * galaxyColors.length)],
          delay: Math.random() * 0.5, // Delay between 0-0.5s
          duration: Math.random() * 5 + 7, // Duration between 7-12s
          opacity: Math.random() * 0.6 + 0.4, // Opacity between 0.4-1
        };
      });
      
      setParticles(newParticles);
    };
    
    createParticles();
    
    // Periodically refresh some particles for continuous effect
    const interval = setInterval(() => {
      if (!burstActive) return;
      
      setParticles(prev => {
        // Replace 20% of particles
        const keepCount = Math.floor(prev.length * 0.8);
        const newCount = prev.length - keepCount;
        
        const keptParticles = prev.slice(0, keepCount);
        const newParticles = Array.from({ length: newCount }, (_, i) => {
          const angle = Math.random() * Math.PI * 2;
          const distance = Math.random() * 80 + 20;
          
          return {
            id: Date.now() + i,
            angle,
            distance,
            size: Math.random() * 4 + 1,
            color: galaxyColors[Math.floor(Math.random() * galaxyColors.length)],
            delay: 0,
            duration: Math.random() * 5 + 7,
            opacity: Math.random() * 0.6 + 0.4,
          };
        });
        
        return [...keptParticles, ...newParticles];
      });
    }, 2000);
    
    return () => clearInterval(interval);
  }, [burstActive]);
  
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10">
      {/* Central galaxy burst */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Central glow */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: '60px',
            height: '60px',
            background: 'radial-gradient(circle, rgba(157, 0, 255, 0.8) 0%, rgba(157, 0, 255, 0) 70%)',
            filter: 'blur(5px)',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: burstActive ? [0, 2, 1.5, 2.5, 2] : 0,
            opacity: burstActive ? [0, 0.8, 0.6, 0.9, 0.7] : 0,
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          }}
        />
        
        {/* Galaxy spiral arms */}
        {galaxyColors.map((color, index) => (
          <motion.div
            key={`arm-${index}`}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              border: `1px solid ${color}10`,
              boxShadow: `0 0 15px ${color}40`,
            }}
            initial={{ rotate: index * 45, scale: 0, opacity: 0 }}
            animate={{ 
              rotate: burstActive ? index * 45 + 360 : index * 45,
              scale: burstActive ? [0, 1.2, 1] : 0,
              opacity: burstActive ? [0, 0.4, 0.2] : 0,
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
              delay: index * 0.2,
            }}
          />
        ))}
        
        {/* Particles */}
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              top: '50%',
              left: '50%',
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              backgroundColor: particle.color,
              boxShadow: `0 0 ${particle.size * 2}px ${particle.size / 2}px ${particle.color}`,
            }}
            initial={{ 
              x: 0, 
              y: 0, 
              opacity: 0,
              scale: 0,
            }}
            animate={{ 
              x: Math.cos(particle.angle) * particle.distance,
              y: Math.sin(particle.angle) * particle.distance,
              opacity: [0, particle.opacity, particle.opacity * 0.8, 0],
              scale: [0, 1, 0.8, 0],
              filter: [
                'blur(0px)',
                'blur(1px)',
                'blur(0px)',
                'blur(2px)',
              ],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              ease: 'easeOut',
              times: [0, 0.2, 0.8, 1],
            }}
          />
        ))}
      </div>
      
      {/* Background stars */}
      {Array.from({ length: 40 }).map((_, index) => {
        const size = Math.random() * 2 + 1;
        const opacity = Math.random() * 0.5 + 0.3;
        
        return (
          <motion.div
            key={`bg-star-${index}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              backgroundColor: galaxyColors[Math.floor(Math.random() * galaxyColors.length)],
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

export default GalaxyBurst; 