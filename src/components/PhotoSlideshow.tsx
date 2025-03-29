import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageAnimationType } from '../types';

interface PhotoSlideshowProps {
  photos: string[];
  autoplaySpeed?: number; // in ms
  showControls?: boolean;
  animationType?: ImageAnimationType;
}

const PhotoSlideshow: React.FC<PhotoSlideshowProps> = ({
  photos,
  autoplaySpeed = 5000,
  showControls = true,
  animationType = 'fade',
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || autoplaySpeed <= 0 || photos.length <= 1) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
    }, autoplaySpeed);

    return () => clearInterval(interval);
  }, [autoplaySpeed, photos.length, isAutoPlaying]);

  const goToNext = () => {
    setIsAutoPlaying(false); // Pause autoplay when manually navigating
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
  };

  const goToPrev = () => {
    setIsAutoPlaying(false); // Pause autoplay when manually navigating
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + photos.length) % photos.length);
  };

  const goToIndex = (index: number) => {
    setIsAutoPlaying(false); // Pause autoplay when manually navigating
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  if (!photos.length) {
    return <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">No photos</div>;
  }

  // Animation variants based on the selected type
  const getVariants = () => {
    switch (animationType) {
      case 'fade':
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1, transition: { duration: 0.8 } },
          exit: { opacity: 0, transition: { duration: 0.8 } },
        };
      case 'slide':
        return {
          initial: { x: direction * 300, opacity: 0 },
          animate: { x: 0, opacity: 1, transition: { duration: 0.5 } },
          exit: { x: direction * -300, opacity: 0, transition: { duration: 0.5 } },
        };
      case 'zoom':
        return {
          initial: { scale: 0.8, opacity: 0 },
          animate: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
          exit: { scale: 1.2, opacity: 0, transition: { duration: 0.5 } },
        };
      case 'flip':
        return {
          initial: { rotateY: direction * 90, opacity: 0 },
          animate: { rotateY: 0, opacity: 1, transition: { duration: 0.7 } },
          exit: { rotateY: direction * -90, opacity: 0, transition: { duration: 0.7 } },
        };
      case 'bounce':
        return {
          initial: { y: 50, opacity: 0 },
          animate: { 
            y: 0, 
            opacity: 1, 
            transition: { 
              type: 'spring',
              stiffness: 300,
              damping: 20,
              duration: 0.6 
            } 
          },
          exit: { y: -50, opacity: 0, transition: { duration: 0.4 } },
        };
      case 'rotate':
        return {
          initial: { rotate: direction * 90, scale: 0.8, opacity: 0 },
          animate: { rotate: 0, scale: 1, opacity: 1, transition: { duration: 0.5 } },
          exit: { rotate: direction * -90, scale: 0.8, opacity: 0, transition: { duration: 0.5 } },
        };
      default: // 'none' or fallback
        return {
          initial: { opacity: 1 },
          animate: { opacity: 1 },
          exit: { opacity: 1 },
        };
    }
  };

  const variants = getVariants();

  return (
    <div className="relative w-full overflow-hidden rounded-lg aspect-[4/3] bg-black shadow-xl">
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={currentIndex}
          custom={direction}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          className="absolute inset-0 w-full h-full"
        >
          <img
            src={photos[currentIndex]}
            alt={`Photo ${currentIndex + 1}`}
            className="w-full h-full object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {/* Photo counter */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
        {photos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToIndex(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-110 ${
              index === currentIndex 
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg ring-2 ring-white/30' 
                : 'bg-white/50 backdrop-blur-sm hover:bg-white/80'
            }`}
            aria-label={`Go to photo ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation controls */}
      {showControls && photos.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 shadow-lg z-20"
            aria-label="Previous photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 shadow-lg z-20"
            aria-label="Next photo"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </>
      )}
      
      {/* Photo counter text */}
      <div className="absolute top-3 right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm z-20">
        {currentIndex + 1} / {photos.length}
      </div>

      {/* Autoplay toggle */}
      <button
        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
        className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1.5 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-20"
        aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
      >
        {isAutoPlaying ? 'Pause' : 'Play'}
      </button>
    </div>
  );
};

export default PhotoSlideshow; 