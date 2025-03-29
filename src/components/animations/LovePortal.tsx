import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface LovePortalProps {
  isActive: boolean;
  index?: number;
}

const LovePortal: React.FC<LovePortalProps> = ({ isActive }) => {
  const [portalOpen, setPortalOpen] = useState(false);
  
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        setPortalOpen(true);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else {
      setPortalOpen(false);
    }
  }, [isActive]);
  
  if (!isActive) return null;
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-10 flex items-center justify-center">
      {/* Background overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 2 }}
        className="absolute inset-0 bg-gradient-to-r from-purple-900 to-pink-900"
      />
      
      {/* Portal outer ring */}
      <motion.div
        initial={{ 
          scale: 0,
          rotate: 0,
          opacity: 0,
        }}
        animate={{ 
          scale: portalOpen ? [0, 1, 1.2, 1] : 0,
          rotate: portalOpen ? [0, 30, 0, -20, 0] : 0,
          opacity: portalOpen ? 1 : 0,
        }}
        transition={{ 
          duration: 3,
          ease: "easeInOut"
        }}
        className="relative w-[300px] h-[300px] rounded-full flex items-center justify-center"
        style={{
          background: 'conic-gradient(from 0deg, #ff0080, #7928ca, #ff0080)',
          boxShadow: '0 0 80px 20px rgba(255, 0, 128, 0.5)',
        }}
      >
        {/* Portal middle ring */}
        <motion.div
          initial={{ 
            scale: 0,
            rotate: 0,
          }}
          animate={{ 
            scale: portalOpen ? [0, 0.8, 1] : 0,
            rotate: portalOpen ? [0, -45, 0, 30, 0] : 0,
          }}
          transition={{ 
            duration: 2.5,
            delay: 0.5,
            ease: "easeOut"
          }}
          className="absolute w-[240px] h-[240px] rounded-full flex items-center justify-center"
          style={{
            background: 'conic-gradient(from 180deg, #7928ca, #ff0080, #7928ca)',
            boxShadow: 'inset 0 0 30px 10px rgba(121, 40, 202, 0.5)',
          }}
        >
          {/* Portal inner ring */}
          <motion.div
            initial={{ 
              scale: 0,
              rotate: 0,
            }}
            animate={{ 
              scale: portalOpen ? [0, 0.7, 1] : 0,
              rotate: portalOpen ? [0, 60, 0, -40, 0] : 0,
            }}
            transition={{ 
              duration: 2,
              delay: 1,
              ease: "easeOut"
            }}
            className="absolute w-[180px] h-[180px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 0%, rgba(255, 192, 203, 0.9) 40%, rgba(255, 0, 128, 0.8) 100%)',
              boxShadow: '0 0 50px 15px rgba(255, 255, 255, 0.7)',
            }}
          />
        </motion.div>
      </motion.div>
      
      {/* Floating hearts */}
      {portalOpen && Array.from({ length: 20 }).map((_, i) => {
        const size = Math.random() * 15 + 10; // 10-25px
        const angle = Math.random() * 360; // Random angle in degrees
        const distance = 40 + Math.random() * 140; // Distance from center (40-180px)
        const delay = Math.random() * 3;
        const duration = 3 + Math.random() * 5;
        const x = Math.cos(angle * Math.PI / 180) * distance;
        const y = Math.sin(angle * Math.PI / 180) * distance;
        
        return (
          <motion.div
            key={i}
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0,
              opacity: 0 
            }}
            animate={{ 
              x: x,
              y: y,
              scale: [0, 1, 0.8, 1.2, 0.9, 1],
              opacity: [0, 0.8, 0.6, 1, 0.7, 0.9],
              rotate: [0, 20, -10, 15, -5, 0],
            }}
            transition={{ 
              duration: duration,
              delay: delay,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute"
            style={{
              fontSize: `${size}px`,
              color: `hsl(${330 + Math.random() * 30}, 100%, 70%)`,
              textShadow: '0 0 10px rgba(255, 255, 255, 0.7)',
              zIndex: 15,
            }}
          >
            {Math.random() > 0.5 ? '❤️' : '💕'}
          </motion.div>
        );
      })}
      
      {/* Portal energy rays */}
      {portalOpen && Array.from({ length: 12 }).map((_, i) => {
        const angle = i * (360 / 12);
        const length = 130 + Math.random() * 100; // 130-230px
        
        return (
          <motion.div
            key={`ray-${i}`}
            initial={{ 
              width: 0,
              opacity: 0,
            }}
            animate={{ 
              width: `${length}px`,
              opacity: [0, 0.6, 0.3, 0.5, 0.2, 0.4],
            }}
            transition={{ 
              duration: 3,
              delay: 1.5 + i * 0.1,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            className="absolute h-[2px] origin-left"
            style={{
              background: 'linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0))',
              transform: `rotate(${angle}deg)`,
              zIndex: 5,
            }}
          />
        );
      })}
    </div>
  );
};

export default LovePortal; 