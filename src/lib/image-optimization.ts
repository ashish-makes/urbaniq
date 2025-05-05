/**
 * Compresses and resizes an image file before upload
 */
export async function optimizeImage(file: File, maxWidth = 1200, maxHeight = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve, reject) => {
    // Create an image element to load the file
    const img = new Image();
    img.onload = () => {
      // Create canvas for resizing
      const canvas = document.createElement('canvas');
      
      // Calculate new dimensions while maintaining aspect ratio
      let width = img.width;
      let height = img.height;
      
      if (width > maxWidth) {
        height = Math.round(height * (maxWidth / width));
        width = maxWidth;
      }
      
      if (height > maxHeight) {
        width = Math.round(width * (maxHeight / height));
        height = maxHeight;
      }
      
      // Set canvas dimensions
      canvas.width = width;
      canvas.height = height;
      
      // Draw resized image on canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert to blob with quality settings
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to create blob from canvas'));
            return;
          }
          
          // Create new file from blob
          const optimizedFile = new File(
            [blob],
            file.name,
            {
              type: 'image/jpeg', // Convert to jpeg for better compression
              lastModified: Date.now()
            }
          );
          
          resolve(optimizedFile);
        },
        'image/jpeg',
        quality
      );
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    // Load image from file
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Optimizes multiple images in parallel
 */
export async function optimizeImages(files: File[]): Promise<File[]> {
  const optimizationPromises = Array.from(files).map(file => 
    optimizeImage(file)
  );
  
  return Promise.all(optimizationPromises);
} 