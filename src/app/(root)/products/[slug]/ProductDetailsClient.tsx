'use client';

import { useState, useEffect, useCallback, useRef, useTransition } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ClientProductCard } from '@/components/ClientProductCard';
import { ReviewForm } from '@/components/ReviewForm';
import { useCart } from '@/context/CartContext';
import { Breadcrumb } from '@/components/Breadcrumb';
import { 
  Star, 
  ShoppingCart, 
  ArrowLeft, 
  Heart, 
  Share2, 
  Check, 
  Truck,
  Facebook,
  Twitter,
  Instagram,
  Mail,
  X as CloseIcon
} from 'lucide-react';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from '@tanstack/react-query';
import { useCheckout } from '@/hooks/useCheckout';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import { useOptimistic } from 'react';

// Types (matching those in page.tsx)
interface ProductSpec {
  [key: string]: string;
}

interface ReviewImage {
  id: string;
  url: string;
  fileId: string;
}

interface Review {
  id: string;
  username: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  images?: ReviewImage[];
  userId?: string;
  user?: {
    id?: string;
    image?: string;
    name?: string;
  };
}

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  longDescription: string;
  rating: number;
  reviewCount: number;
  images: string[];
  isBestseller?: boolean;
  category?: string | { id: string; name: string; slug?: string };
  categoryId?: string;
  categoryName?: string;
  categorySlug?: string;
  features: string[];
  specs: ProductSpec;
  colors?: string[];
  inStock?: boolean;
  freeShipping?: boolean;
  tags?: string[];
  reviews?: Review[];
}

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailsClient({ product, relatedProducts }: ProductDetailsClientProps) {
  // All the client-side state and logic here
  const router = useRouter();
  const queryClient = useQueryClient();
  const { addToCart } = useCart();
  const { createCheckoutSession, isLoading: checkoutLoading } = useCheckout();
  const { data: session } = useSession();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showFixedButtons, setShowFixedButtons] = useState(false);
  const [productCarouselApi, setProductCarouselApi] = useState<CarouselApi | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplayProgress, setAutoplayProgress] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const autoplayDuration = 5000;
  const [reviewImagesModal, setReviewImagesModal] = useState<{
    isOpen: boolean, 
    images: ReviewImage[], 
    initialIndex: number
  }>({
    isOpen: false,
    images: [],
    initialIndex: 0
  });
  const [modalCarouselApi, setModalCarouselApi] = useState<CarouselApi | null>(null);
  
  // Add useTransition hook
  const [isPending, startTransition] = useTransition();
  
  // Add optimistic state for reviews
  const [optimisticReviews, addOptimisticReview] = useOptimistic<Review[], Review>(
    product.reviews || [],
    (state, newReview) => [newReview, ...state]
  );
  
  // Set selected color when component mounts
  useEffect(() => {
    if (product.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0]);
    }
  }, [product.colors]);

  // Handle scroll to show/hide fixed buttons
  useEffect(() => {
    const handleScroll = () => {
      const buyButtonSection = document.getElementById('product-buy-buttons');
      if (buyButtonSection) {
        const rect = buyButtonSection.getBoundingClientRect();
        setShowFixedButtons(rect.bottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle carousel slide change
  useEffect(() => {
    if (!productCarouselApi) return;

    const onSelect = () => {
      setCurrentSlide(productCarouselApi.selectedScrollSnap());
      setAutoplayProgress(0);
    };

    productCarouselApi.on("select", onSelect);
    
    // Auto-advance carousel
    const autoplayInterval = setInterval(() => {
      if (productCarouselApi.canScrollNext()) {
        productCarouselApi.scrollNext();
      } else {
        productCarouselApi.scrollTo(0);
      }
    }, autoplayDuration);
    
    // Progress indicator
    const progressInterval = setInterval(() => {
      setAutoplayProgress((prev) => {
        const newProgress = prev + (100 / (autoplayDuration / 100));
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 100);
    
    return () => {
      productCarouselApi.off("select", onSelect);
      clearInterval(autoplayInterval);
      clearInterval(progressInterval);
    };
  }, [productCarouselApi]);

  // Handle modal carousel
  useEffect(() => {
    if (reviewImagesModal.isOpen && modalCarouselApi) {
      modalCarouselApi.scrollTo(reviewImagesModal.initialIndex);
    }
  }, [reviewImagesModal.isOpen, reviewImagesModal.initialIndex, modalCarouselApi]);

  // Scroll to a specific slide
  const scrollToSlide = useCallback((index: number) => {
    if (!productCarouselApi) return;
    productCarouselApi.scrollTo(index);
    setAutoplayProgress(0);
  }, [productCarouselApi]);

  // Open image carousel modal
  const openImageCarousel = useCallback((images: ReviewImage[], initialIndex: number) => {
    setReviewImagesModal({
      isOpen: true,
      images,
      initialIndex
    });
  }, []);

  // Quantity controls
  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity(prev => prev - 1);

  // Check if we have related products
  const hasRelatedProducts = relatedProducts && relatedProducts.length > 0;

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  // Check wishlist status
  useEffect(() => {
    const checkWishlistStatus = async () => {
      if (product && session?.user) {
        try {
          const response = await fetch('/api/user/wishlist');
          if (response.ok) {
            const wishlistItems = await response.json();
            // Check if current product is in wishlist
            const isInWishlist = wishlistItems.some((item: any) => 
              item.productId === product.id
            );
            setIsWishlisted(isInWishlist);
          }
        } catch (error) {
          console.error('Error checking wishlist status:', error);
        }
      }
    };

    checkWishlistStatus();
  }, [product, session?.user]);

  // Toggle wishlist
  const toggleWishlist = async () => {
    if (!session?.user) {
      // If user is not logged in, redirect to login page
      router.push('/auth/signin?callbackUrl=' + encodeURIComponent(window.location.href));
      return;
    }

    if (!product) return;
    
    setWishlistLoading(true);
    
    try {
      if (isWishlisted) {
        // Remove from wishlist
        const response = await fetch(`/api/user/wishlist?productId=${product.id}`, {
          method: 'DELETE',
        });
        
        if (response.ok) {
          setIsWishlisted(false);
          toast.success('Removed from wishlist');
        } else {
          toast.error('Failed to remove from wishlist');
        }
      } else {
        // Add to wishlist
        const response = await fetch('/api/user/wishlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ productId: product.id }),
        });
        
        if (response.ok) {
          setIsWishlisted(true);
          toast.success('Added to wishlist');
        } else {
          toast.error('Failed to add to wishlist');
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    } finally {
      setWishlistLoading(false);
    }
  };

  // Handle share
  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = product.name || '';
    const text = product.description || '';

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'instagram':
        navigator.clipboard.writeText(url);
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`, '_blank');
        break;
    }
    setShowShareMenu(false);
  };

  // Function to render star ratings
  const renderStars = useCallback((rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<Star key={i} size={16} className="fill-black text-black" />);
      } else {
        stars.push(<Star key={i} size={16} className="text-gray-300" />);
      }
    }
    return stars;
  }, []);

  // Handle add to cart
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    }, quantity);
  };
  
  // Handle buy now
  const handleBuyNow = async () => {
    // Add the product to cart first
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    }, quantity);
    
    // Directly create checkout session which will redirect to Stripe
    createCheckoutSession();
  };

  // Format date
  const formatDate = (date: Date | string) => {
    try {
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      }).format(new Date(date));
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  // Filter reviews based on selection (update to use optimisticReviews)
  const getFilteredReviews = useCallback(() => {
    if (!optimisticReviews || !Array.isArray(optimisticReviews)) return [];
    
    if (reviewFilter === 'all') return optimisticReviews;
    
    const rating = parseInt(reviewFilter);
    return optimisticReviews.filter(review => review.rating === rating);
  }, [optimisticReviews, reviewFilter]);

  // Get the reviews to display (limited or all)
  const displayReviews = showAllReviews 
    ? getFilteredReviews() 
    : getFilteredReviews().slice(0, 3);

  // Count reviews by rating (update to use optimisticReviews)
  const getRatingCounts = useCallback(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    if (optimisticReviews && Array.isArray(optimisticReviews)) {
      optimisticReviews.forEach(review => {
        counts[review.rating] = (counts[review.rating] || 0) + 1;
      });
    }
    
    return counts;
  }, [optimisticReviews]);

  const ratingCounts = getRatingCounts();

  return (
    <main>
      {/* Breadcrumb navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <Breadcrumb
          items={[
            { label: 'Products', href: '/products' },
            ...(product.categoryName 
              ? [{ 
                  label: product.categoryName,
                  href: `/products/category/${product.categorySlug || 
                    (typeof product.category === 'object' && product.category.slug) || 
                    product.categoryName.toLowerCase().replace(/\s+/g, '-')}`
                }]
              : []
            ),
            { label: product.name }
          ]}
        />
      </div>
      
      {/* Product detail section */}
      <section className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Product Image Gallery */}
          <div className="relative lg:sticky lg:top-24">
            <div className="relative">
              {/* Carousel */}
              <div className="relative overflow-hidden rounded-xl">
                <Carousel className="w-full" setApi={setProductCarouselApi} opts={{ loop: true }}>
                  <CarouselContent>
                    {product.images.map((image: string, index: number) => (
                      <CarouselItem key={index}>
                        <div className="aspect-[4/3] relative bg-gray-50 overflow-hidden">
                          <Image 
                            src={image} 
                            alt={`${product.name} - Image ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 50vw"
                            loading={index === 0 ? "eager" : "lazy"}
                            className="object-cover hover:scale-105 transition-transform duration-700"
                            priority={index === 0}
                            quality={index === 0 ? 85 : 75}
                          />
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  
                  {/* Carousel controls */}
                  <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-4">
                    <CarouselPrevious className="h-9 w-9 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white border-0 shadow-md pointer-events-auto text-black transition-all hover:scale-110" />
                    <CarouselNext className="h-9 w-9 rounded-full bg-white/70 backdrop-blur-sm hover:bg-white border-0 shadow-md pointer-events-auto text-black transition-all hover:scale-110" />
                  </div>
                  
                  {/* Progress dots */}
                  <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                    {product.images.map((_, index) => (
                      <button 
                        key={index} 
                        onClick={() => scrollToSlide(index)}
                        className={`h-1.5 rounded-full transition-all overflow-hidden relative ${
                          index === currentSlide ? 'w-6 bg-white/30' : 'w-1.5 bg-white/50 hover:bg-white/70'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      >
                        {index === currentSlide && (
                          <div 
                            className="absolute inset-0 bg-white transition-all duration-100 rounded-full"
                            style={{ width: `${autoplayProgress}%` }}
                          />
                        )}
                      </button>
                    ))}
                  </div>
                </Carousel>
              </div>
              
              {/* Thumbnail images */}
              <div className="flex overflow-x-auto gap-2 mt-4 pb-1 scrollbar-hide">
                {product.images.map((image: string, index: number) => (
                  <button 
                    key={index}
                    onClick={() => scrollToSlide(index)}
                    className={`group w-20 h-20 flex-shrink-0 rounded-md overflow-hidden border cursor-pointer transition-all 
                      ${index === currentSlide ? 'border-black shadow-sm' : 'border-gray-200 hover:border-gray-400 hover:shadow-md'}`}
                  >
                    <div className="relative w-full h-full">
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
                      <Image 
                        src={image}
                        alt={`${product.name} - Thumbnail ${index + 1}`}
                        fill
                        sizes="80px"
                        className="object-cover group-hover:scale-105 transition-all duration-300"
                        loading="lazy"
                        quality={60}
                      />
                      {index === currentSlide && (
                        <div className="absolute inset-0 border-2 border-black rounded-md" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Right: Product Info */}
          <div className="flex flex-col">
            {/* Product Header */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h1 className="text-2xl font-bold">{product.name}</h1>
                
                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleWishlist}
                    disabled={wishlistLoading}
                    className={`h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100 ${wishlistLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                  >
                    <Heart 
                      size={18} 
                      className={`${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'} ${wishlistLoading ? 'animate-pulse' : ''}`} 
                    />
                  </button>
                  
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                      aria-label="Share product"
                    >
                      <Share2 size={18} className="text-black" />
                    </button>
                    
                    <AnimatePresence>
                      {showShareMenu && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-2xl py-2 z-10 shadow-[0_5px_15px_rgba(0,0,0,0.05)]"
                        >
                          <motion.div 
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex flex-col"
                          >
                            <motion.button
                              variants={itemVariants}
                              onClick={() => handleShare('facebook')}
                              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 rounded-lg"
                            >
                              <Facebook size={16} className="text-black" />
                              <span>Facebook</span>
                            </motion.button>
                            
                            <motion.button
                              variants={itemVariants}
                              onClick={() => handleShare('twitter')}
                              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 rounded-lg"
                            >
                              <Twitter size={16} className="text-black" />
                              <span>Twitter</span>
                            </motion.button>
                            
                            <motion.button
                              variants={itemVariants}
                              onClick={() => handleShare('instagram')}
                              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 rounded-lg"
                            >
                              <Instagram size={16} className="text-black" />
                              <span>Instagram</span>
                            </motion.button>
                            
                            <motion.button
                              variants={itemVariants}
                              onClick={() => handleShare('email')}
                              className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-800 hover:bg-gray-50 rounded-lg"
                            >
                              <Mail size={16} className="text-black" />
                              <span>Email</span>
                            </motion.button>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center">
                  <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
                  <div className="flex items-center mx-1">
                    <Star size={14} className="fill-black text-black" />
                  </div>
                  <span className="text-sm text-gray-600">
                    ({product.reviewCount})
                  </span>
                </div>
                
                {product.inStock && (
                  <span className="text-sm text-green-600">
                    In Stock
                  </span>
                )}
              </div>
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              
              <p className="text-sm text-gray-700 mb-4">
                {product.description}
              </p>
              
              <div id="product-buy-buttons" className="mb-4">
                {product.originalPrice ? (
                  <>
                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-black">${product.price.toFixed(2)}</span>
                      <span className="text-base text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                      <span className="py-1 px-3 text-xs font-medium bg-amber-50 text-amber-700 rounded-full">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="mb-4">
                    <span className="text-2xl font-bold text-black">${product.price.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {/* Delivery information boxes */}
              <div className="space-y-3 mb-6">
                {/* Free delivery box */}
                <div className="p-4 bg-gray-50/70 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Truck className="text-gray-700 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-medium mb-1">Free delivery</p>
                      <p className="text-xs text-gray-600">Estimated delivery: 2-4 business days</p>
                    </div>
                  </div>
                </div>
                
                {/* Return policy box */}
                <div className="p-4 bg-gray-50/70 rounded-lg">
                  <div className="flex items-start gap-3">
                    <ArrowLeft className="text-gray-700 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-medium mb-1">30-day returns</p>
                      <p className="text-xs text-gray-600">Return this product within 30 days for a full refund</p>
                    </div>
                  </div>
                </div>
                
                {/* Warranty box */}
                <div className="p-4 bg-gray-50/70 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Check className="text-gray-700 mt-0.5" size={18} />
                    <div>
                      <p className="text-sm font-medium mb-1">1-year warranty</p>
                      <p className="text-xs text-gray-600">Protected against defects and malfunctions</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Add to cart and buy now buttons */}
              <div className="flex gap-3 mb-6">
                <Button 
                  onClick={handleBuyNow}
                  disabled={checkoutLoading}
                  className="flex-1 bg-black hover:bg-black/90 text-white rounded-full py-6 h-12 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer">
                  {checkoutLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>Buy Now</span>
                  )}
                </Button>
                
                <Button
                  onClick={handleAddToCart}
                  className="flex-1 bg-white border border-gray-200 text-black hover:bg-gray-50 rounded-full py-6 h-12 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart size={15} strokeWidth={2} className="mr-1" />
                  <span>Add to Cart</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Product Information Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-xl font-bold mb-8">Product Information</h2>
                
        {/* Main grid layout - Rearranged for better visual balance */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Product Details - Spanning 2/3 columns */}
          <div className="bg-gray-50/70 rounded-2xl p-6 md:col-span-2 lg:col-span-2">
            <h3 className="text-lg font-bold mb-4">Product Details</h3>
            <p className="text-sm text-gray-700">{product?.longDescription}</p>
          </div>

          {/* Features Card - Now on the right side */}
          <div className="bg-gray-50/70 rounded-2xl p-6 md:col-span-1 lg:col-span-1 row-span-2">
            <h3 className="text-lg font-bold mb-4">Key Features</h3>
            <ul className="space-y-3">
              {product?.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="h-6 w-6 rounded-full bg-black flex items-center justify-center text-white mr-3 mt-0.5 flex-shrink-0 text-xs font-medium">
                    {index + 1}
                  </div>
                  <span className="text-sm text-gray-700 pt-1">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Rating - Moved below product details */}
          <div className="bg-gray-50/70 rounded-2xl p-6 md:col-span-1 lg:col-span-1">
            <h3 className="text-lg font-bold mb-4">Customer Rating</h3>
            <div className="flex items-center justify-center mb-4">
              <div className="flex flex-col items-center">
                <div className="text-5xl font-bold mb-1">{product?.rating.toFixed(1)}</div>
                <div className="flex mb-1">
                  {renderStars(Math.round(product?.rating || 0))}
                </div>
                <span className="text-xs text-gray-500">Based on {product?.reviewCount} reviews</span>
              </div>
            </div>
            
            {/* Rating bars */}
            <div className="space-y-2 mt-2">
              {[5, 4, 3, 2, 1].map(rating => {
                const count = product?.reviews?.filter(r => r.rating === rating).length || 0;
                const percentage = product?.reviewCount 
                  ? (count / product.reviewCount) * 100 
                  : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-2">
                    <span className="text-xs text-gray-500 w-2">{rating}</span>
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-black" 
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 w-6 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technical Specs - Now below rating */}
          <div className="bg-gray-50/70 rounded-2xl p-6 md:col-span-1 lg:col-span-1">
            <h3 className="text-lg font-bold mb-4">Technical Specs</h3>
            <div className="space-y-3">
              {Object.entries(product?.specs || {}).map(([key, value]) => (
                <div key={key} className="flex flex-col border-b border-gray-100 pb-2">
                  <dt className="text-xs text-gray-500 uppercase tracking-wider mb-1">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                  <dd className="text-sm font-medium">{String(value)}</dd>
                </div>
              ))}
            </div>
          </div>

          {/* In The Box - Full width at the bottom */}
          <div className="bg-gray-50/70 rounded-2xl p-6 md:col-span-2 lg:col-span-3">
            <h3 className="text-lg font-bold mb-4">In The Box</h3>
            <ul className="space-y-2">
              {product.specs.boxContents ? (
                product.specs.boxContents.split(',').map((item, index) => (
                  <li key={index} className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-black mr-2"></div>
                    <span className="text-sm">{item.trim()}</span>
                  </li>
                ))
              ) : (
                <>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-black mr-2"></div>
                    <span className="text-sm">{product?.name}</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-black mr-2"></div>
                    <span className="text-sm">USB Cable</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-black mr-2"></div>
                    <span className="text-sm">Power Adapter</span>
                  </li>
                  <li className="flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-black mr-2"></div>
                    <span className="text-sm">Quick Start Guide</span>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </section>
      
      {/* Reviews section - Flat, minimal redesign */}
      <section id="reviews-section" className="max-w-7xl mx-auto px-4 py-12 border-t border-gray-100 pt-12 mt-6">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-xl font-bold mb-1">Customer Reviews</h2>
              <div className="flex items-center gap-2">
                <div className="flex">
                  {renderStars(Math.round(product?.rating || 0))}
                </div>
                <span className="text-sm text-gray-500">
                  {product?.rating.toFixed(1)} · {product?.reviewCount} reviews
                </span>
              </div>
            </div>
            
            {/* Write review button */}
            <Button 
              className="bg-white border border-gray-200 hover:bg-gray-50 text-black rounded-full h-10 px-5 text-sm font-medium cursor-pointer self-start"
              onClick={() => {
                if (!session?.user) {
                  toast.error('Please sign in to write a review');
                  return;
                }
                setShowReviewForm(!showReviewForm);
              }}
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </Button>
          </div>
          
          {/* Review filters - horizontal pill buttons */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <button 
              onClick={() => setReviewFilter('all')}
              className={`px-4 py-1.5 text-sm border rounded-full transition-colors ${
                reviewFilter === 'all' 
                ? 'border-black bg-black text-white' 
                : 'border-gray-200 hover:border-gray-300 text-gray-700'
              }`}
            >
              All Reviews
            </button>
            {[5, 4, 3, 2, 1].map(rating => (
              <button 
                key={rating}
                onClick={() => setReviewFilter(rating.toString())}
                className={`px-4 py-1.5 text-sm border rounded-full transition-colors ${
                  reviewFilter === rating.toString() 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-200 hover:border-gray-300 text-gray-700'
                }`}
              >
                {rating} Stars ({ratingCounts[rating]})
              </button>
            ))}
          </div>
        </div>
        
        {/* Review form */}
        {showReviewForm && (
          <div className="mb-8 border border-gray-100 rounded-xl overflow-hidden">
            <ReviewForm 
              productId={product.id}
              onSuccess={(reviewData) => {
                setShowReviewForm(false);
                toast.success("Your review has been submitted successfully!");
                
                // Create an optimistic review object to add immediately to the UI
                const optimisticReview: Review = {
                  id: `temp-${Date.now()}`,
                  userId: session?.user?.id,
                  username: session?.user?.name || 'You',
                  rating: reviewData.rating,
                  title: reviewData.title,
                  comment: reviewData.comment,
                  date: new Date().toISOString(),
                  helpful: 0,
                  verified: true,
                  images: (reviewData.images || []).map(img => ({
                    id: `temp-img-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
                    url: img.url,
                    fileId: img.fileId
                  })),
                  user: {
                    id: session?.user?.id,
                    image: session?.user?.image || undefined,
                    name: session?.user?.name || undefined
                  }
                };
                
                // Wrap optimistic state updates in startTransition
                startTransition(() => {
                  // Add the review to our optimistic state
                  addOptimisticReview(optimisticReview);
                  
                  // Update product rating and review count optimistically
                  const newReviewCount = (product.reviewCount || 0) + 1;
                  const totalRating = (product.rating * (newReviewCount - 1)) + reviewData.rating;
                  const newRating = totalRating / newReviewCount;
                  
                  // Update product data with new rating info
                  product.rating = newRating;
                  product.reviewCount = newReviewCount;
                });
                
                // Invalidate the cache in the background
                queryClient.invalidateQueries({ 
                  queryKey: ['product', product.slug],
                  refetchType: 'all'
                });
              }}
              onCancel={() => setShowReviewForm(false)}
            />
          </div>
        )}
        
        {/* Reviews list - Redesigned, flat and minimal */}
        {displayReviews.length > 0 ? (
          <>
            <div className="space-y-6">
              {displayReviews.map((review) => (
                <motion.div 
                  key={review.id} 
                  className={`border-b border-gray-100 pb-6 last:border-0 ${review.id.startsWith('temp-') ? 'bg-gray-50/50 rounded-lg p-4' : ''}`}
                  initial={review.id.startsWith('temp-') ? { opacity: 0, y: -10 } : { opacity: 1 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex items-start gap-3">
                    {/* User avatar - with support for profile images */}
                    <div className="w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex-shrink-0 overflow-hidden">
                      {review.user?.image ? (
                        <Image 
                          src={review.user.image}
                          alt={review.username}
                          width={40}
                          height={40}
                          className="object-cover w-full h-full"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-base font-medium text-gray-600">{review.username.charAt(0).toUpperCase()}</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Review content */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-medium">{review.username}</span>
                        {review.verified && (
                          <span className="text-xs text-gray-500 flex items-center">
                            <Check size={12} className="mr-0.5" />
                            Verified
                          </span>
                        )}
                        {review.id.startsWith('temp-') && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                            Just added
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 mb-3">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-xs text-gray-400">{formatDate(review.date)}</span>
                      </div>
                      
                      {/* Review title and content */}
                      <h4 className="font-medium mb-1.5 text-base">{review.title}</h4>
                      <p className="text-gray-600 text-sm mb-3">{review.comment}</p>
                      
                      {/* Review images - improved layout */}
                      {review.images && Array.isArray(review.images) && review.images.length > 0 && (
                        <div className="mt-4 mb-2">
                          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2">
                            {review.images.map((image) => (
                              <div 
                                key={image.id} 
                                className="relative aspect-square rounded-md overflow-hidden border border-gray-100 cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => {
                                  if (review.images && Array.isArray(review.images)) {
                                    openImageCarousel(review.images as ReviewImage[], review.images.indexOf(image));
                                  }
                                }}
                              >
                                <Image
                                  src={image.url}
                                  alt="Review"
                                  fill
                                  className="object-cover"
                                  sizes="(max-width: 640px) 150px, 200px"
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Show more button - improved styling */}
            {!showAllReviews && getFilteredReviews().length > 4 && (
              <div className="flex justify-center mt-8">
                <Button 
                  onClick={() => setShowAllReviews(true)}
                  className="bg-white border border-gray-200 hover:bg-gray-50 text-black rounded-full h-10 px-6 text-sm font-medium cursor-pointer"
                >
                  Show all {getFilteredReviews().length} reviews
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="border border-gray-100 rounded-xl py-12 px-6 text-center">
            <div className="mx-auto w-12 h-12 border border-gray-100 rounded-full flex items-center justify-center mb-3">
              <Star size={20} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-medium mb-1">No reviews yet</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
              There are no reviews matching your filter. Try another filter or be the first to review this product.
            </p>
            <Button 
              className="bg-white border border-gray-200 hover:bg-gray-50 text-black rounded-full h-10 px-5 text-sm font-medium cursor-pointer inline-flex"
              onClick={() => {
                if (!session?.user) {
                  toast.error('Please sign in to write a review');
                  return;
                }
                setShowReviewForm(true);
                // Scroll to the review form section
                const reviewsSection = document.getElementById('reviews-section');
                if (reviewsSection) {
                  window.scrollTo({
                    top: reviewsSection.offsetTop,
                    behavior: 'smooth'
                  });
                }
              }}
            >
              Write a Review
            </Button>
          </div>
        )}
      </section>
      
      {/* Related Products Section */}
      {hasRelatedProducts && (
        <section className="max-w-7xl mx-auto px-4 py-12">
          <h2 className="text-xl font-bold mb-6">You might also like</h2>
          
          <Carousel
            opts={{
              align: "start",
              slidesToScroll: 1,
              containScroll: "trimSnaps"
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 h-full">
              {relatedProducts.map((relProduct) => (
                <CarouselItem key={relProduct.id} className="pl-2 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 h-full">
                  <div className="h-full">
                    <ClientProductCard
                      id={relProduct.id}
                      name={relProduct.name}
                      price={relProduct.price}
                      description={relProduct.description}
                      rating={relProduct.rating}
                      reviewCount={relProduct.reviewCount}
                      image={relProduct.images[0]}
                      isBestseller={relProduct.isBestseller}
                      slug={relProduct.slug}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1 bg-white border border-gray-200 hover:bg-gray-50 text-black hover:text-black rounded-full" />
            <CarouselNext className="right-1 bg-white border border-gray-200 hover:bg-gray-50 text-black hover:text-black rounded-full" />
          </Carousel>
        </section>
      )}
      
      {/* Fixed buttons at bottom of screen */}
      <AnimatePresence>
        {showFixedButtons && product && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-4 left-0 right-0 z-20 px-4"
          >
            <div className="max-w-md mx-auto md:max-w-xl lg:max-w-2xl flex items-center justify-between bg-white border border-gray-200 py-3 px-5 rounded-full shadow-[0_5px_20px_rgba(0,0,0,0.08)]">
              <div className="flex items-center gap-3">
                <span className="text-lg font-bold">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">${product.originalPrice.toFixed(2)}</span>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={handleAddToCart}
                  className="bg-white border border-gray-200 text-black hover:bg-gray-50 h-9 text-sm font-medium flex items-center justify-center gap-1.5 px-5 rounded-full cursor-pointer"
                >
                  <ShoppingCart size={15} strokeWidth={2} />
                  <span className="hidden sm:inline">Add to Cart</span>
                </Button>
                
                <Button 
                  onClick={handleBuyNow}
                  disabled={checkoutLoading}
                  className="bg-black hover:bg-black/90 text-white h-9 text-sm font-medium px-5 rounded-full cursor-pointer"
                >
                  {checkoutLoading ? "Processing..." : "Buy Now"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Custom Fullscreen Image Carousel Modal */}
      <AnimatePresence>
        {reviewImagesModal.isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white/98 z-50 overflow-hidden"
          >
            {/* Close button */}
            <button 
              onClick={() => setReviewImagesModal(prev => ({...prev, isOpen: false}))}
              className="absolute top-4 right-4 z-50 text-gray-800 hover:text-black focus:outline-none"
              aria-label="Close image viewer"
            >
              <CloseIcon size={24} />
            </button>
            
            {/* Main centered content container */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Carousel 
                setApi={setModalCarouselApi}
                className="w-full max-w-6xl mx-auto"
                opts={{ startIndex: reviewImagesModal.initialIndex }}
              >
                <CarouselContent>
                  {reviewImagesModal.images.map((image, index) => (
                    <CarouselItem key={image.id} className="flex items-center justify-center">
                      <div className="w-full p-4 flex items-center justify-center">
                        <div className="relative max-w-full max-h-[75vh]">
                          <Image
                            src={image.url}
                            alt={`Review image ${index + 1}`}
                            width={1200}
                            height={1200}
                            className="object-contain max-h-[75vh] max-w-full"
                            priority={index === reviewImagesModal.initialIndex}
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                
                <CarouselPrevious className="absolute left-4 md:left-8 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 shadow-sm" />
                <CarouselNext className="absolute right-4 md:right-8 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 shadow-sm" />
              </Carousel>
            </div>
            
            {/* Image counter fixed to bottom */}
            {reviewImagesModal.images.length > 0 && (
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <span className="bg-white px-4 py-2 rounded-full text-sm text-gray-800 border border-gray-200 shadow-sm">
                  {modalCarouselApi?.selectedScrollSnap() !== undefined ? modalCarouselApi.selectedScrollSnap() + 1 : reviewImagesModal.initialIndex + 1} / {reviewImagesModal.images.length}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
} 
