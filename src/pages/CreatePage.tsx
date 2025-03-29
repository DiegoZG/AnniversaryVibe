import { useState, FormEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ImageUploader from '../components/ImageUploader';
import { ANIMATION_OPTIONS, AnimationType, IMAGE_ANIMATION_OPTIONS, ImageAnimationType } from '../types';
import { uploadImages, createSurprise } from '../lib/supabase';

const CreatePage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [animationType, setAnimationType] = useState<AnimationType>('confetti');
  const [secondaryAnimation, setSecondaryAnimation] = useState<AnimationType | ''>('');
  const [imageAnimation, setImageAnimation] = useState<ImageAnimationType>('fade');
  const [files, setFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imgPreviews, setImgPreviews] = useState<string[]>([]);

  // Sync secondary animation when primary changes to prevent duplicates
  useEffect(() => {
    if (secondaryAnimation && secondaryAnimation === animationType) {
      setSecondaryAnimation('');
    }
  }, [animationType, secondaryAnimation]);

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    
    // Generate previews for the thumbnails
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    
    // Clean up old previews to prevent memory leaks
    imgPreviews.forEach(url => URL.revokeObjectURL(url));
    
    setImgPreviews(newPreviews);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate input
    if (title.trim().length === 0) {
      setError('Please enter a title');
      return;
    }

    if (message.trim().length === 0) {
      setError('Please enter a message');
      return;
    }

    if (message.length > 500) {
      setError('Message must be less than 500 characters');
      return;
    }

    if (files.length < 1) {
      setError('Please upload at least 5 images');
      return;
    }

    if (files.length > 10) {
      setError('You can upload a maximum of 10 images');
      return;
    }

    // No need to check for duplicate animations here since we prevent it in the UI
    
    try {
      setIsLoading(true);
      
      // 1. Upload images to Supabase Storage
      const imageUrls = await uploadImages(files);
      
      // 2. Save data to Supabase with animations
      // Store both animations in the animation_type field separated by a comma if secondary exists
      const animationValue = secondaryAnimation 
        ? `${animationType},${secondaryAnimation}` 
        : animationType;
      
      const surpriseId = await createSurprise(
        title,
        message, 
        imageUrls, 
        animationValue,
        imageAnimation
      );
      
      // 3. Navigate to the surprise page
      navigate(`/surprise/${surpriseId}`);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      imgPreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imgPreviews]);

  return (
    <div className="flex-grow flex flex-col items-center justify-center w-full py-8 px-4 mb-8">
      <div className="w-full max-w-5xl">
        <div className="card w-full">
          <h2 className="text-2xl font-bold text-purple-700 mb-8 text-center">
            Create Your Romantic Surprise
          </h2>
          
          <div className="md:flex md:gap-8 items-start">
            <div className="md:w-1/2">
              <p className="text-gray-600 mb-8">
                Upload photos, write a heartfelt message, and choose animation styles. 
                Then share the unique link with your special someone!
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title input */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                    className="form-input"
                    placeholder="e.g. Happy Anniversary!, Happy Birthday!, I Love You!"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {title.length}/100 characters
                  </p>
                </div>
                
                {/* Message input */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    maxLength={500}
                    className="form-input"
                    placeholder="Write your romantic message here..."
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {message.length}/500 characters
                  </p>
                </div>

                {/* Primary Animation Selection */}
                <div className="mb-6">
                  <label htmlFor="animationType" className="block text-sm font-medium text-gray-700 mb-1">
                    Primary Animation
                  </label>
                  <select
                    id="animationType"
                    className="w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    value={animationType}
                    onChange={(e) => setAnimationType(e.target.value as AnimationType)}
                  >
                    <option value="confetti">Confetti</option>
                    <option value="flying-love-letters">Flying Love Letters</option>
                    <option value="rainbow-sparkles">Rainbow Sparkles</option>
                    <option value="shooting-stars">Shooting Stars</option>
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Choose the main animation for your surprise.</p>
                </div>
                
                {/* Secondary Animation selection (optional) */}
                <div>
                  <label htmlFor="secondaryAnimation" className="block text-sm font-medium text-gray-700 mb-1">
                    Secondary Animation <span className="text-gray-400">(optional)</span>
                  </label>
                  <select
                    id="secondaryAnimation"
                    value={secondaryAnimation}
                    onChange={(e) => setSecondaryAnimation(e.target.value as AnimationType | '')}
                    className="form-select"
                  >
                    <option value="">None</option>
                    {animationType !== 'confetti' && <option value="confetti">Confetti</option>}
                    {animationType !== 'flying-love-letters' && <option value="flying-love-letters">Flying Love Letters</option>}
                    {animationType !== 'rainbow-sparkles' && <option value="rainbow-sparkles">Rainbow Sparkles</option>}
                    {animationType !== 'shooting-stars' && <option value="shooting-stars">Shooting Stars</option>}
                  </select>
                  <p className="text-sm text-gray-500 mt-1">Add a second animation to enhance your surprise.</p>
                </div>
                
                {/* Image Animation selection */}
                <div>
                  <label htmlFor="imageAnimation" className="block text-sm font-medium text-gray-700 mb-1">
                    Photo Transition Effect <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="imageAnimation"
                    value={imageAnimation}
                    onChange={(e) => setImageAnimation(e.target.value as ImageAnimationType)}
                    className="form-select"
                    required
                  >
                    {IMAGE_ANIMATION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose how images will transition between each other
                  </p>
                </div>

                {/* Upload images */}
                <ImageUploader
                  maxFiles={10}
                  minFiles={5}
                  onImagesChange={handleFilesChange}
                />

                {/* Error message */}
                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-md border border-red-200">
                    {error}
                  </div>
                )}

                {/* Submit button */}
                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`btn btn-primary w-full ${
                      isLoading ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isLoading ? 'Creating...' : 'Create Surprise'}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-8 md:mt-0 md:w-1/2">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <h3 className="text-lg font-semibold text-purple-700 mb-4">Preview</h3>
                
                <h4 className="text-xl font-bold text-center mb-3 text-purple-800">
                  {title || "Your Title Will Appear Here"}
                </h4>
                
                <div className="aspect-[4/3] bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  {files.length > 0 ? (
                    <img 
                      src={imgPreviews[0]} 
                      alt="Preview" 
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <p className="text-gray-400">Image preview will appear here</p>
                  )}
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-gray-700 italic line-clamp-4 break-words">
                    {message || "Your message will appear here"}
                  </p>
                </div>

                <div className="mt-4 text-sm text-gray-500">
                  <p>Primary Animation: {ANIMATION_OPTIONS.find(opt => opt.value === animationType)?.label}</p>
                  {secondaryAnimation && (
                    <p>Secondary Animation: {ANIMATION_OPTIONS.find(opt => opt.value === secondaryAnimation)?.label}</p>
                  )}
                  <p>Image Animation: {IMAGE_ANIMATION_OPTIONS.find(opt => opt.value === imageAnimation)?.label}</p>
                  <p>Images: {files.length} / 10</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage; 