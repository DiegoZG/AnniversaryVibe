import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface RomanticMessageProps {
  message: string;
  effect?: 'typewriter' | 'fade-in' | 'floating';
}

const RomanticMessage: React.FC<RomanticMessageProps> = ({
  message,
  effect = 'typewriter',
}) => {
  const [displayedMessage, setDisplayedMessage] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (effect !== 'typewriter') return;

    let index = 0;
    setDisplayedMessage('');
    setIsComplete(false);

    const interval = setInterval(() => {
      if (index < message.length) {
        setDisplayedMessage(prev => prev + message.charAt(index));
        index++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, 40); // Speed of typing

    return () => clearInterval(interval);
  }, [message, effect]);

  const renderContent = () => (
    <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg w-full p-6">
      <p className="text-xl md:text-2xl font-serif text-pink-800 text-center break-words">
        {effect === 'typewriter' ? (
          <>
            {displayedMessage}
            {!isComplete && <span className="animate-pulse">|</span>}
          </>
        ) : (
          message
        )}
      </p>
    </div>
  );

  if (effect === 'typewriter') {
    return (
      <div className="w-full">
        {renderContent()}
      </div>
    );
  }

  if (effect === 'fade-in') {
    return (
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        {renderContent()}
      </motion.div>
    );
  }

  if (effect === 'floating') {
    return (
      <motion.div
        className="w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, -10, 0] }}
        transition={{ 
          opacity: { duration: 1 }, 
          y: { repeat: Infinity, duration: 3, ease: "easeInOut" }
        }}
      >
        {renderContent()}
      </motion.div>
    );
  }

  // Default fallback
  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};

export default RomanticMessage; 