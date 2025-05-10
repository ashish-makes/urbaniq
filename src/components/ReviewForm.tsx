import { useState, ChangeEvent, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Star, Loader2, Image as ImageIcon, X, Upload } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  existingReview?: {
    id: string;
    rating: number;
    title: string;
    comment: string;
    images: UploadedImage[];
  };
}

interface UploadedImage {
  url: string;
  fileId: string;
  name: string;
}

export function ReviewForm({ productId, onSuccess, onCancel, existingReview }: ReviewFormProps) {
  const { data: session } = useSession();
  const router = useRouter();
  
  // Initialize form state with existing review data if provided
  const [rating, setRating] = useState(existingReview?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(existingReview?.title || '');
  const [comment, setComment] = useState(existingReview?.comment || '');
  const [images, setImages] = useState<UploadedImage[]>(existingReview?.images || []);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Check if we're updating an existing review
  const isEditing = !!existingReview;
  
  // Handle rating selection
  const handleRatingClick = (value: number) => {
    setRating(value);
  };
  
  const handleRatingHover = (value: number) => {
    setHoverRating(value);
  };
  
  const handleRatingLeave = () => {
    setHoverRating(0);
  };
  
  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error('Please sign in to submit a review');
      router.push('/auth/signin');
      return;
    }
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }
    
    if (!title.trim()) {
      toast.error('Please enter a review title');
      return;
    }
    
    if (!comment.trim()) {
      toast.error('Please enter your review comment');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          rating,
          title,
          comment,
          images: images.map(img => ({
            url: img.url,
            fileId: img.fileId
          }))
        }),
      });
      
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit review');
      }
      
      toast.success('Review submitted successfully');
      
      // Reset form
      setRating(0);
      setTitle('');
      setComment('');
      setImages([]);
      
      // Callback on success
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle image upload
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // Check file size and type
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
    
    const selectedFiles = Array.from(files);
    const validFiles = selectedFiles.filter(file => {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.error(`${file.name} has an unsupported format`);
        return false;
      }
      
      return true;
    });
    
    if (validFiles.length === 0) return;
    
    try {
      setUploading(true);
      
      // Upload each file using the server as a proxy
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        
        // Convert file to base64
        const base64Data = await fileToBase64(file);
        
        // Use server as proxy for uploading
        const response = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileName: `review-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`,
            folder: '/product-reviews',
            fileData: base64Data,
          }),
        });
        
        if (!response.ok) {
          const data = await response.json();
          throw new Error(data.error || 'Failed to upload image');
        }
        
        const uploadData = await response.json();
        
        if (!uploadData.url) {
          throw new Error('Failed to upload image');
        }
        
        // Add uploaded image to state
        setImages(prev => [...prev, {
          url: uploadData.url,
          fileId: uploadData.fileId,
          name: file.name
        }]);
      }
      
      toast.success('Images uploaded successfully');
      
    } catch (error: any) {
      console.error('ImageKit upload error:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      setUploadProgress(0);
      // Clear input value so the same file can be selected again
      e.target.value = '';
    }
  };
  
  // Helper function to convert File to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        const base64Data = base64String.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  };
  
  // Remove an uploaded image
  const handleRemoveImage = (fileId: string) => {
    setImages(prev => prev.filter(img => img.fileId !== fileId));
  };
  
  return (
    <div className="bg-white px-6 py-5 border-0">
      <h3 className="text-lg font-medium mb-6">
        {isEditing ? 'Update Your Review' : 'Write a Review'}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <Label htmlFor="rating" className="text-sm font-medium text-gray-700 mb-2 block">How would you rate this product?</Label>
          <div 
            className="flex gap-2" 
            onMouseLeave={handleRatingLeave}
          >
            {[1, 2, 3, 4, 5].map(value => (
              <button
                key={value}
                type="button"
                onClick={() => handleRatingClick(value)}
                onMouseEnter={() => handleRatingHover(value)}
                className="focus:outline-none transition-transform hover:scale-110"
                aria-label={`Rate ${value} stars`}
              >
                <Star 
                  size={26} 
                  className={`
                    transition-colors 
                    ${(hoverRating || rating) >= value 
                      ? 'fill-black text-black' 
                      : 'text-gray-200'}
                  `} 
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-gray-500 self-center">
              {rating > 0 ? `${rating} star${rating !== 1 ? 's' : ''}` : ''}
            </span>
          </div>
        </div>
        
        {/* Title */}
        <div>
          <Label htmlFor="title" className="text-sm font-medium text-gray-700 mb-2 block">Review Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            required
            maxLength={100}
            className="border-gray-200 focus:border-black focus:ring-0 rounded-md"
          />
        </div>
        
        {/* Comment */}
        <div>
          <Label htmlFor="comment" className="text-sm font-medium text-gray-700 mb-2 block">Your Review</Label>
          <Textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you like or dislike about this product?"
            required
            className="min-h-[120px] border-gray-200 focus:border-black focus:ring-0 rounded-md shadow-none"
            maxLength={1000}
          />
        </div>
        
        {/* Image Upload */}
        <div>
          <Label htmlFor="images" className="text-sm font-medium text-gray-700 mb-2 block">Add Photos (Optional)</Label>
          
          <div className="flex flex-wrap gap-3 mb-3">
            {images.map((image) => (
              <div key={image.fileId} className="relative group">
                <div className="w-20 h-20 border border-gray-100 rounded-md overflow-hidden">
                  <Image
                    src={image.url}
                    alt="Review"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(image.fileId)}
                  className="absolute -top-2 -right-2 bg-white border border-gray-100 text-gray-500 hover:text-black rounded-full p-1 shadow-none focus:outline-none"
                  aria-label="Remove image"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <label className="w-20 h-20 border border-dashed border-gray-200 rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-gray-400 transition-colors bg-white">
                {uploading ? (
                  <div className="flex flex-col items-center">
                    <Loader2 size={20} className="animate-spin text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1">{uploadProgress}%</span>
                  </div>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center mb-1">
                      <ImageIcon size={15} className="text-gray-400" />
                    </div>
                    <span className="text-xs text-gray-500">Add Photo</span>
                  </>
                )}
                <input
                  type="file"
                  id="images"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploading || images.length >= 5}
                />
              </label>
            )}
          </div>
          
          <p className="text-xs text-gray-500">
            You can upload up to 5 images (JPG, PNG, WebP, max 5MB each)
          </p>
        </div>
        
        {/* Buttons */}
        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting || uploading}
            className="bg-black hover:bg-black/90 text-white rounded-full h-10 text-sm font-medium transition-all duration-300 px-6 shadow-none"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                <span>{isEditing ? 'Updating...' : 'Submitting...'}</span>
              </>
            ) : (
              <span>{isEditing ? 'Update Review' : 'Submit Review'}</span>
            )}
          </Button>
          
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting || uploading}
              className="border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-black rounded-full h-10 text-sm font-medium transition-all duration-300 shadow-none"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </div>
  );
} 