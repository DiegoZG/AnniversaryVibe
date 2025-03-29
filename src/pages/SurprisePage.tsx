import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSurpriseById } from '../lib/supabase';
import AnimationRenderer from '../components/animations';
import PhotoSlideshow from '../components/PhotoSlideshow';
import { ANIMATION_OPTIONS, Surprise } from '../types';

const SurprisePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [surprise, setSurprise] = useState<Surprise | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [animationType, setAnimationType] = useState<string>('confetti');
  const [showAnimation, setShowAnimation] = useState<boolean>(true);

  useEffect(() => {
    const fetchSurprise = async () => {
      try {
        if (!id) {
          setError('No surprise ID provided');
          setLoading(false);
          return;
        }

        const data = await getSurpriseById(id);
        if (!data) {
          setError('Surprise not found');
          setLoading(false);
          return;
        }

        setSurprise(data);
        // Set the animation type if it's saved in the database
        if (data.animation_type) {
          setAnimationType(data.animation_type);
        }
        
        // Start the animation
        setShowAnimation(true);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching surprise:', err);
        setError('Failed to load the surprise. Please try again later.');
        setLoading(false);
      }
    };

    fetchSurprise();
  }, [id]);

  const handleAnimationToggle = () => {
    setShowAnimation(prev => !prev);
  };

  const handleAnimationChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setAnimationType(event.target.value);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-red-100 p-4">
        <div className="text-center">
          <div className="animate-pulse text-6xl mb-4">❤️</div>
          <p className="text-lg text-pink-700">Loading your surprise...</p>
        </div>
      </div>
    );
  }

  if (error || !surprise) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-red-100 p-4">
        <div className="text-center">
          <div className="text-6xl mb-4">💔</div>
          <h1 className="text-xl font-bold text-red-700 mb-2">Oops! Something went wrong.</h1>
          <p className="text-lg text-pink-700">{error || 'Unable to load surprise'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-100 to-red-100 relative overflow-hidden">
      {/* Animation overlay */}
      <div className="absolute inset-0 z-20">
        <AnimationRenderer animationType={animationType} isActive={showAnimation} />
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-30">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-pink-700">
            {surprise.title}
          </h1>
        </div>
        
        <div className="max-w-3xl mx-auto mt-12 bg-white/90 backdrop-blur-sm rounded-lg shadow-xl p-6 md:p-8">
          {/* Message */}
          <div className="mb-8">
            <h2 className="text-xl text-pink-700 font-semibold mb-3">A Special Message For You</h2>
            <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
              {surprise.message}
            </div>
          </div>
          
          {/* Photos */}
          {surprise.photo_urls && surprise.photo_urls.length > 0 && (
            <div>
              <h2 className="text-xl text-pink-700 font-semibold mb-3">Our Beautiful Memories</h2>
              <PhotoSlideshow 
                photos={surprise.photo_urls} 
                animationType={surprise.image_animation || 'fade'}
              />
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="max-w-3xl mx-auto mt-6 flex justify-center space-x-4">
          <button 
            onClick={handleAnimationToggle}
            className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-full shadow-md transition-colors"
          >
            {showAnimation ? 'Pause Animation' : 'Play Animation'}
          </button>
          
          <select
            value={animationType}
            onChange={handleAnimationChange}
            className="px-4 py-2 bg-white text-pink-600 rounded-full shadow-md border border-pink-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
          >
            <option value="confetti">Confetti</option>
            <option value="flying-love-letters">Flying Love Letters</option>
            <option value="rainbow-sparkles">Rainbow Sparkles</option>
            <option value="shooting-stars">Shooting Stars</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default SurprisePage; 