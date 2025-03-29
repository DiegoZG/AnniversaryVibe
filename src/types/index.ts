export type AnimationType = 
  | 'confetti'
  | 'flying-love-letters'
  | 'rainbow-sparkles'
  | 'shooting-stars';

export type ImageAnimationType =
  | 'fade'
  | 'slide'
  | 'zoom'
  | 'flip'
  | 'bounce'
  | 'rotate'
  | 'none';

export interface Surprise {
  id: string;
  title: string;
  message: string;
  photo_urls: string[];
  animation_type: AnimationType;
  image_animation: ImageAnimationType;
  created_at: string;
}

export const ANIMATION_OPTIONS = [
  { value: 'confetti', label: 'Confetti' },
  { value: 'flying-love-letters', label: 'Flying Love Letters' },
  { value: 'rainbow-sparkles', label: 'Rainbow Sparkles' },
  { value: 'shooting-stars', label: 'Shooting Stars' }
];

export const IMAGE_ANIMATION_OPTIONS = [
  { value: 'fade', label: 'Fade In/Out' },
  { value: 'slide', label: 'Slide' },
  { value: 'zoom', label: 'Zoom' },
  { value: 'flip', label: 'Flip' },
  { value: 'bounce', label: 'Bounce' },
  { value: 'rotate', label: 'Rotate' },
  { value: 'none', label: 'No Animation' },
]; 