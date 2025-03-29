import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log the URLs (without sensitive values) to help debug
console.log('Supabase URL is set:', !!supabaseUrl);
console.log('Supabase Anon Key is set:', !!supabaseAnonKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
  } else {
    console.log('Supabase connection successful!');
  }
});

// Function to compress an image before upload
const compressImage = async (file: File, maxWidth = 1200, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        // Create canvas
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Calculate new dimensions if larger than maxWidth
        if (width > maxWidth) {
          const ratio = maxWidth / width;
          width = maxWidth;
          height = height * ratio;
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw image on canvas with new dimensions
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        // Draw the image on the canvas with the new dimensions
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to Blob with specified quality
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Could not create blob from canvas'));
            }
          },
          file.type,
          quality
        );
      };
      img.onerror = () => {
        reject(new Error('Error loading image'));
      };
    };
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
  });
};

export async function uploadImages(files: File[], folder: string = 'surprises') {
  try {
    console.log(`Attempting to upload ${files.length} images to ${folder} folder`);
    
    const uploads = files.map(async (file) => {
      const filename = `${Date.now()}-${file.name}`;
      console.log(`Uploading file: ${filename}, original size: ${Math.round(file.size / 1024)}KB`);
      
      // Compress the image before upload
      const compressedBlob = await compressImage(file);
      const compressedFile = new File([compressedBlob], file.name, { type: file.type });
      
      console.log(`Compressed size: ${Math.round(compressedFile.size / 1024)}KB, reduction: ${Math.round((1 - compressedFile.size / file.size) * 100)}%`);
      
      const { data, error } = await supabase.storage
        .from('photos')
        .upload(`${folder}/${filename}`, compressedFile);
      
      if (error) {
        console.error('Image upload error:', error);
        throw error;
      }
      
      console.log('File uploaded successfully:', data?.path);
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('photos')
        .getPublicUrl(`${folder}/${filename}`);
      
      console.log('Public URL generated:', publicUrl);
      return publicUrl;
    });
    
    return Promise.all(uploads);
  } catch (error) {
    console.error('Error in uploadImages function:', error);
    throw error;
  }
}

export async function createSurprise(
  title: string,
  message: string, 
  photoUrls: string[], 
  animationType: string,
  imageAnimation: string = 'fade'
) {
  try {
    console.log('Creating surprise with:', { 
      title,
      messageLength: message.length, 
      photoCount: photoUrls.length, 
      animationType,
      imageAnimation
    });
    
    const { data, error } = await supabase
      .from('surprises')
      .insert([{ 
        title, 
        message, 
        photo_urls: photoUrls, 
        animation_type: animationType,
        image_animation: imageAnimation
      }])
      .select('id')
      .single();
    
    if (error) {
      console.error('Error creating surprise:', error);
      throw error;
    }
    
    console.log('Surprise created with ID:', data.id);
    return data.id;
  } catch (error) {
    console.error('Error in createSurprise function:', error);
    throw error;
  }
}

export async function getSurpriseById(id: string) {
  try {
    console.log('Fetching surprise with ID:', id);
    
    const { data, error } = await supabase
      .from('surprises')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching surprise:', error);
      throw error;
    }
    
    console.log('Successfully fetched surprise data');
    return data;
  } catch (error) {
    console.error('Error in getSurpriseById function:', error);
    throw error;
  }
} 