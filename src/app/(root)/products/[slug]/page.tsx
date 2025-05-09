'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { ClientProductCard } from '@/components/ClientProductCard';
import { useCart } from '@/context/CartContext';
import { 
  Star, 
  ShoppingCart, 
  ArrowLeft, 
  Heart, 
  Share2, 
  ChevronDown, 
  Check, 
  Truck,
  Plus,
  Minus,
  Facebook,
  Twitter,
  Instagram,
  Mail
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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCheckout } from '@/hooks/useCheckout';

// Define types for product data
interface ProductSpec {
  [key: string]: string;
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
  category?: string | { id: string; name: string };
  categoryId?: string;
  categoryName?: string;
  features: string[];
  specs: ProductSpec;
  colors?: string[];
  inStock?: boolean;
  freeShipping?: boolean;
  tags?: string[];
  reviews?: Review[];
}

// Sample products data as fallback (would typically come from an API or database)
const productsData: Product[] = [
  {
    id: 'smart-feeder-1',
    slug: 'smart-pet-feeder',
    name: 'Smart Pet Feeder',
    price: 129.99,
    originalPrice: 159.99,
    description: 'Automated feeding with app control. Schedule meals and monitor your pet\'s food intake from anywhere.',
    longDescription: 'The Smart Pet Feeder is the perfect solution for busy pet owners. With our intuitive app, you can schedule meals, control portion sizes, and even dispense treats remotely. The built-in camera lets you see your pet enjoying their meal, while notifications keep you informed about feeding times and food levels. Features include voice recording capability to call your pet to meals, backup battery system for power outages, and dishwasher-safe components for easy cleaning.',
    rating: 4.7,
    reviewCount: 120,
    images: ['/pet-feeder.png', '/pet-camera.png', '/hero-one.png', '/hero-two.png'],
    isBestseller: true,
    category: 'feeder',
    features: [
      'Schedule up to 5 meals per day',
      'Portion control from 1-10 portions per meal',
      'HD camera with night vision',
      'Voice recording capability',
      'App notifications',
      'Backup battery system',
      'Dishwasher-safe components'
    ],
    specs: {
      dimensions: '12" x 8" x 14"',
      capacity: '6 cups of dry food',
      connectivity: 'Wi-Fi 2.4GHz',
      powerSource: 'AC adapter with battery backup',
      warranty: '1 year limited'
    },
    colors: ['Black', 'White', 'Gray'],
    inStock: true,
    freeShipping: true,
    reviews: [
      {
        id: 'r1',
        username: 'PetLover123',
        rating: 5,
        date: '2023-10-15',
        title: 'Best purchase for my cat!',
        comment: 'I\'ve been using this feeder for a month now and it has made my life so much easier. My cat gets fed on time even when I\'m running late from work. The app is intuitive and the camera quality is excellent.',
        helpful: 24,
        verified: true
      },
      {
        id: 'r2',
        username: 'DogMom',
        rating: 4,
        date: '2023-09-28',
        title: 'Great product, one minor issue',
        comment: 'This feeder has been a game-changer for my busy schedule. The only issue I had was setting up the Wi-Fi connection initially, but customer service was helpful. Highly recommend!',
        helpful: 17,
        verified: true
      },
      {
        id: 'r3',
        username: 'TechGuy',
        rating: 5,
        date: '2023-08-14',
        title: 'Perfect smart device for pet owners',
        comment: 'As someone who loves tech gadgets, I was impressed by the quality and functionality of this smart feeder. The app works flawlessly and the scheduling feature is very reliable.',
        helpful: 31,
        verified: true
      }
    ]
  },
  {
    id: 'pet-camera-1',
    slug: 'hd-pet-camera',
    name: 'HD Pet Camera',
    price: 89.99,
    originalPrice: 119.99,
    description: 'Monitor your pet with two-way audio. Check in anytime and talk to your pet when you\'re away.',
    longDescription: 'Stay connected with your pet no matter where you are with our HD Pet Camera. This smart device features crystal-clear 1080p video with a wide-angle lens to capture all your pet\'s activities. The two-way audio allows you to talk to your pet and hear their responses, helping to ease separation anxiety. With motion detection alerts, you\'ll know when your pet is active, and the night vision ensures you can check on them even in the dark. The built-in treat dispenser adds an interactive element to remote pet care.',
    rating: 4.5,
    reviewCount: 84,
    images: ['/pet-camera.png', '/pet-feeder.png', '/hero-one.png', '/hero-two.png'],
    isBestseller: true,
    category: 'camera',
    features: [
      '1080p HD video',
      'Two-way audio',
      'Motion detection alerts',
      'Night vision',
      'Treat dispenser',
      '160° wide-angle view',
      'Cloud storage options'
    ],
    specs: {
      dimensions: '4.3" x 4.3" x 5.7"',
      connectivity: 'Wi-Fi 2.4GHz',
      resolution: '1080p HD',
      nightVision: 'Up to 30ft',
      powerSource: 'AC adapter',
      warranty: '1 year limited'
    },
    colors: ['Black', 'White'],
    inStock: true,
    freeShipping: true,
    reviews: [
      {
        id: 'r1',
        username: 'CatDad',
        rating: 5,
        date: '2023-11-02',
        title: 'Perfect for checking on my cat',
        comment: 'The camera quality is excellent, and I love the two-way audio feature. It\'s great to be able to talk to my cat when I\'m away. The night vision is clear too!',
        helpful: 19,
        verified: true
      },
      {
        id: 'r2',
        username: 'TravellerWithPets',
        rating: 3,
        date: '2023-10-21',
        title: 'Good but could be better',
        comment: 'The video quality is good and the app is easy to use. However, there\'s a slight delay in the audio which can be frustrating. Otherwise, it serves its purpose well.',
        helpful: 8,
        verified: true
      },
      {
        id: 'r3',
        username: 'PetSitter',
        rating: 4,
        date: '2023-09-17',
        title: 'Great tool for pet professionals',
        comment: 'I use this camera when I\'m pet sitting to keep an eye on the pets when I need to run errands. The treat dispenser is a great feature that helps me bond with the pets I\'m watching.',
        helpful: 23,
        verified: true
      },
      {
        id: 'r4',
        username: 'AnxiousDogMom',
        rating: 5,
        date: '2023-08-05',
        title: 'Helps with my dog\'s separation anxiety',
        comment: 'My dog used to have terrible separation anxiety. Being able to talk to him and dispense treats has helped so much. The camera quality is excellent and the app is user-friendly.',
        helpful: 42,
        verified: true
      }
    ]
  },
  {
    id: 'smart-collar-1',
    slug: 'gps-smart-collar',
    name: 'GPS Smart Collar',
    price: 79.99,
    originalPrice: 99.99,
    description: 'Track location and activity with notifications. Get alerts when your pet leaves designated safe zones.',
    longDescription: 'Our GPS Smart Collar combines location tracking with health monitoring to give you complete peace of mind. Set up custom safe zones and receive instant alerts if your pet wanders outside these areas. The activity tracking feature monitors your pet\'s daily exercise and rest patterns, helping you ensure they maintain a healthy lifestyle. The collar is lightweight, waterproof, and has a battery life of up to 7 days, making it perfect for active pets. The comfortable design ensures your pet will barely notice they\'re wearing it.',
    rating: 4.3,
    reviewCount: 56,
    images: ['/hero-one.png', '/pet-camera.png', '/pet-feeder.png', '/hero-two.png'],
    category: 'collar',
    features: [
      'Real-time GPS tracking',
      'Custom safe zones',
      'Activity monitoring',
      'Health statistics',
      'Waterproof design',
      'Long battery life',
      'LED light for visibility'
    ],
    specs: {
      dimensions: 'Adjustable, fits 11"-25" neck circumference',
      weight: '1.5 oz',
      batteryLife: 'Up to 7 days',
      connectivity: 'Bluetooth, Cellular, Wi-Fi',
      waterproof: 'IP67 rated',
      warranty: '1 year limited'
    },
    colors: ['Black', 'Blue', 'Red'],
    inStock: true,
    freeShipping: false,
    reviews: [
      {
        id: 'r1',
        username: 'HikingDad',
        rating: 5,
        date: '2023-11-10',
        title: 'Perfect for outdoor adventures',
        comment: 'We take our dog hiking in remote areas and this collar gives us such peace of mind. The GPS tracking is spot-on accurate and the battery lasts for our entire weekend trips. The app is intuitive and I love the activity tracking feature.',
        helpful: 28,
        verified: true
      },
      {
        id: 'r2',
        username: 'DogTrainer',
        rating: 4,
        date: '2023-10-05',
        title: 'Great training tool',
        comment: 'I use this with the dogs I train to track their exercise and movements. The safe zones feature is particularly helpful for clients with escape-prone dogs. Took off one star because the app can be a bit slow to update location sometimes.',
        helpful: 15,
        verified: true
      },
      {
        id: 'r3',
        username: 'BeachLover',
        rating: 3,
        date: '2023-09-20',
        title: 'Good but not waterproof enough',
        comment: 'The collar works great for tracking, but despite being advertised as waterproof, it started having issues after my dog went swimming in the ocean a few times. Customer service was helpful though and sent a replacement.',
        helpful: 11,
        verified: true
      },
      {
        id: 'r4',
        username: 'CityDogWalker',
        rating: 5,
        date: '2023-08-30',
        title: 'Must-have for city dogs',
        comment: 'Living in the city, I was always worried about my dog getting loose in traffic. This collar has been a literal lifesaver - when she slipped her leash once, I could find her immediately. The activity tracking also showed me she wasn\'t getting enough exercise, so we\'ve adjusted our routine.',
        helpful: 32,
        verified: true
      },
      {
        id: 'r5',
        username: 'SeniorDogOwner',
        rating: 5,
        date: '2023-08-15',
        title: 'Great for older pets too',
        comment: 'My 13-year-old retriever has started wandering off more as he\'s aged. This collar helps me keep track of him and the health monitoring features are especially useful for senior pets. The collar is comfortable enough that he doesn\'t mind wearing it all day.',
        helpful: 19,
        verified: true
      }
    ]
  },
  {
    id: 'test-product-1',
    slug: 'test-product',
    name: 'Test Product',
    price: 99.99,
    originalPrice: 129.99,
    description: 'This is a test product for design and development purposes.',
    longDescription: 'This is an extended description of the test product. It provides a longer text sample to see how the description field renders in the product detail page. This product is created specifically for testing the layout, styling, and functionality of the product detail page without needing to set up a database connection. You can adjust various aspects of this product to test different scenarios and edge cases in your UI design.',
    rating: 4.5,
    reviewCount: 42,
    images: ['/pet-feeder.png', '/pet-camera.png', '/hero-one.png', '/hero-two.png'],
    isBestseller: true,
    category: 'test',
    features: [
      'Feature one with some details',
      'Another key feature to showcase',
      'A third important feature',
      'Something special about this product',
      'One more feature to highlight',
      'An additional bonus feature',
      'Final notable characteristic'
    ],
    specs: {
      dimensions: '10" x 6" x 8"',
      weight: '2.5 lbs',
      batteryLife: 'Up to 10 hours',
      connectivity: 'Wi-Fi 2.4GHz, Bluetooth 5.0',
      materials: 'High-quality plastic and metal components',
      warranty: '1 year limited'
    },
    colors: ['Black', 'White', 'Blue'],
    inStock: true,
    freeShipping: true,
    reviews: [
      {
        id: 'r1',
        username: 'ProductTester',
        rating: 5,
        date: '2023-11-15',
        title: 'Excellent test product',
        comment: 'This test product exceeds all expectations. The quality is outstanding, and it performs exactly as described. The setup was straightforward, and I especially love the third feature mentioned in the description.',
        helpful: 42,
        verified: true
      },
      {
        id: 'r2',
        username: 'QualityInspector',
        rating: 4,
        date: '2023-10-30',
        title: 'Great value for money',
        comment: 'I\'ve tested many similar products, and this one offers great value for the price point. The materials feel premium, and the functionality is intuitive. Taking off one star only because the battery life seems closer to 8 hours than the advertised 10.',
        helpful: 36,
        verified: true
      },
      {
        id: 'r3',
        username: 'DesignEnthusiast',
        rating: 5,
        date: '2023-10-22',
        title: 'Beautiful design and functionality',
        comment: 'The aesthetics of this product are stunning. It fits perfectly in my modern home setup, and the functionality matches the beautiful design. I particularly appreciate the attention to detail in the user interface.',
        helpful: 29,
        verified: true
      },
      {
        id: 'r4',
        username: 'TechReviewer',
        rating: 3,
        date: '2023-09-18',
        title: 'Good but needs improvements',
        comment: 'While the core functionality works well, there are some areas that could be improved. The connectivity occasionally drops, and the app interface could be more intuitive. Customer service was responsive when I reached out about these issues.',
        helpful: 17,
        verified: true
      },
      {
        id: 'r5',
        username: 'EarlyAdopter',
        rating: 5,
        date: '2023-08-25',
        title: 'Cutting-edge technology',
        comment: 'I\'m always trying the latest tech products, and this one stands out from the crowd. The innovative features set it apart from competitors, and the integration with other smart home systems is seamless. Highly recommend for tech enthusiasts!',
        helpful: 45,
        verified: true
      },
      {
        id: 'r6',
        username: 'MinimalistUser',
        rating: 4,
        date: '2023-08-12',
        title: 'Clean design but one minor flaw',
        comment: 'The minimalist design appealed to me immediately. Setup was a breeze and daily use is intuitive. My only complaint is that the white version shows dirt and fingerprints easily, so consider the black or blue if you\'re concerned about that.',
        helpful: 33,
        verified: true
      }
    ]
  }
];

// Fetch a product by slug - optimized with cache headers
const fetchProduct = async (productSlug: string): Promise<Product> => {
  // First attempt to fetch by slug
  try {
    // Try slug endpoint first
    const response = await fetch(`/api/products/${productSlug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.log('Slug fetch failed, trying ID fetch as fallback');
  }
  
  // If slug fetch fails, try to identify if the slug has an ID component
  // Extract ID from slug if it has a format of text-id
  const slugParts = productSlug.split('-');
  const potentialId = slugParts[slugParts.length - 1];
  
  // Only attempt ID lookup if we have what looks like a valid ID
  if (potentialId && /^[a-zA-Z0-9_-]+$/.test(potentialId)) {
    try {
      const idResponse = await fetch(`/api/products/id/${potentialId}`, {
        next: { revalidate: 3600 } // Cache for 1 hour
      });
      
      if (idResponse.ok) {
        const data = await idResponse.json();
        return data;
      }
    } catch (error) {
      console.error('Both slug and ID fetch attempts failed');
    }
  }
  
  // If all attempts fail, throw an error
  throw new Error('Failed to fetch product');
};

// Fetch related products by category (same categoryId or categoryName)
const fetchRelatedProducts = async (productData: Product, currentSlug: string): Promise<Product[]> => {
  // Safely extract category information
  let categoryId: string | undefined = undefined;
  let categoryName: string | undefined = undefined;
  
  if (productData.categoryId) {
    categoryId = productData.categoryId;
  } else if (productData.category && typeof productData.category === 'object') {
    categoryId = productData.category.id;
  }
  
  if (productData.categoryName) {
    categoryName = productData.categoryName;
  } else if (productData.category && typeof productData.category === 'object') {
    categoryName = productData.category.name;
  }
  
  if (!categoryId && !categoryName) {
    return [];
  }
  
  try {
    // Try to fetch by categoryId first (more precise)
    let apiUrl = '/api/products';
    
    if (categoryId) {
      apiUrl += `?categoryId=${encodeURIComponent(categoryId)}`;
    } else if (categoryName) {
      apiUrl += `?category=${encodeURIComponent(categoryName)}`;
    }
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products. Status: ${response.status}`);
    }
    
    const products = await response.json();
    
    // Filter out current product and limit to 4 related products
    const filtered = products
      .filter((p: Product) => p.slug !== currentSlug && p.id !== productData.id)
      .slice(0, 4);
    
    return filtered;
  } catch (error) {
    return [];
  }
};

// Main product component with loading optimization
export default function ProductDetailPage() {
  const { slug } = useParams();
  const productSlug: string = typeof slug === 'string' ? slug : Array.isArray(slug) ? slug[0] : '';
  const queryClient = useQueryClient();
  const { addToCart } = useCart();
  const router = useRouter();
  const { createCheckoutSession, isLoading: checkoutLoading } = useCheckout();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [reviewFilter, setReviewFilter] = useState('all');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [showFixedButtons, setShowFixedButtons] = useState(false);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplayProgress, setAutoplayProgress] = useState(0);
  const autoplayDuration = 5000;

  // Fetch product with React Query for caching and loading state
  const { 
    data: product, 
    isLoading,
    isError
  } = useQuery<Product>({
    queryKey: ['product', productSlug],
    queryFn: () => fetchProduct(productSlug),
    enabled: !!productSlug,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 1
  });
  
  // Effect to handle product data when it changes
  useEffect(() => {
    if (product) {
      // Set selected color when product data is available
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      
      // Handle URL correction if needed (self-healing URL)
      if (product.slug && product.slug !== productSlug) {
        window.history.replaceState({}, '', `/products/${product.slug}`);
      }
      
      // Fetch related products when we have the product data
      queryClient.prefetchQuery({
        queryKey: ['relatedProducts', product.id],
        queryFn: () => fetchRelatedProducts(product, product.slug)
      });
      
      // Immediately fetch to ensure we have data
      queryClient.fetchQuery({
        queryKey: ['relatedProducts', product.id],
        queryFn: () => fetchRelatedProducts(product, product.slug)
      });
    }
  }, [product, productSlug, queryClient]);
  
  // Fetch related products from the same category
  const { 
    data: relatedProducts = [],
    isLoading: isRelatedLoading 
  } = useQuery<Product[]>({
    queryKey: ['relatedProducts', product?.id],
    queryFn: () => {
      if (!product) return [];
      return fetchRelatedProducts(product, product.slug);
    },
    enabled: !!product,
    staleTime: 1000 * 60 * 10, // Consider data fresh for 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false
  });

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
    if (!carouselApi) return;

    const onSelect = () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
      setAutoplayProgress(0);
    };

    carouselApi.on("select", onSelect);
    
    // Auto-advance carousel
    const autoplayInterval = setInterval(() => {
      if (carouselApi.canScrollNext()) {
        carouselApi.scrollNext();
      } else {
        carouselApi.scrollTo(0);
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
      carouselApi.off("select", onSelect);
      clearInterval(autoplayInterval);
      clearInterval(progressInterval);
    };
  }, [carouselApi]);

  // Handle carousel navigation
  const scrollToSlide = useCallback((index: number) => {
    if (!carouselApi) return;
    carouselApi.scrollTo(index);
    setAutoplayProgress(0);
  }, [carouselApi]);

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => quantity > 1 && setQuantity(prev => prev - 1);

  // Get display products for the carousel, with fallback
  const hasRelatedProducts = relatedProducts && relatedProducts.length > 0;

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const title = product?.name || '';
    const text = product?.description || '';

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

  const toggleWishlist = () => setIsWishlisted(!isWishlisted);

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

  // Filter reviews based on selection
  const getFilteredReviews = useCallback(() => {
    if (!product?.reviews) return [];
    
    if (reviewFilter === 'all') return product.reviews;
    
    const rating = parseInt(reviewFilter);
    return product.reviews.filter(review => review.rating === rating);
  }, [product?.reviews, reviewFilter]);

  // Get the reviews to display (limited or all)
  const displayReviews = showAllReviews 
    ? getFilteredReviews() 
    : getFilteredReviews().slice(0, 3);

  // Count reviews by rating
  const getRatingCounts = useCallback(() => {
    const counts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    if (product?.reviews) {
      product.reviews.forEach(review => {
        counts[review.rating]++;
      });
    }
    
    return counts;
  }, [product?.reviews]);

  const ratingCounts = getRatingCounts();

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0]
    }, quantity);
  };
  
  // Handle buy now - add to cart and proceed directly to Stripe checkout
  const handleBuyNow = async () => {
    if (!product) return;
    
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

  // Lightweight loading skeleton
  if (isLoading) {
    return (
      <div className="bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-8">
            <div className="h-2 w-14 bg-gray-100 rounded-full"></div>
            <div className="h-2 w-2 bg-gray-100 rounded-full"></div>
            <div className="h-2 w-20 bg-gray-100 rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Simplified loading UI for better performance */}
            <div className="aspect-square w-full bg-gray-50 rounded-2xl animate-pulse"></div>
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-50 rounded-full animate-pulse"></div>
              <div className="h-4 w-1/2 bg-gray-50 rounded-full animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 w-full bg-gray-50 rounded-full animate-pulse"></div>
                <div className="h-4 w-full bg-gray-50 rounded-full animate-pulse"></div>
              </div>
              <div className="h-8 w-1/3 bg-gray-50 rounded-full animate-pulse"></div>
              <div className="flex gap-3 pt-4">
                <div className="h-11 flex-1 bg-gray-50 rounded-full animate-pulse"></div>
                <div className="h-11 flex-1 bg-gray-50 rounded-full animate-pulse"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (isError || !product) {
    return (
      <div className="bg-white">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-12 min-h-[70vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
            <p className="mb-8">We couldn't find the product you're looking for.</p>
            <Link href="/products">
              <Button className="bg-black hover:bg-black/90 text-white rounded-full h-10 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 px-5">
                <ArrowLeft size={16} />
                <span>Back to Products</span>
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-white">
      <Header />
      <Suspense fallback={<div className="h-[50vh] flex items-center justify-center">Loading...</div>}>
      <main>
          {/* Breadcrumb navigation */}
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex text-sm text-gray-500">
            <Link href="/" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/products" className="hover:text-black">Products</Link>
            <span className="mx-2">/</span>
            <span className="text-black">{product.name}</span>
          </nav>
        </div>
        
          {/* Product detail section - Optimized for performance */}
        <section className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Product Image Gallery */}
            <div className="relative lg:sticky lg:top-24">
              <div className="relative">
                  {/* Carousel */}
                <div className="relative overflow-hidden rounded-xl">
                  <Carousel className="w-full" setApi={setCarouselApi} opts={{ loop: true }}>
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
                      className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-gray-100"
                      aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                      <Heart 
                        size={18} 
                        className={`${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
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
                    <span className="text-sm font-medium">{product.rating}</span>
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
        
          {/* Lazy load remaining sections */}
          <Suspense fallback={<div className="h-32"></div>}>
            <>
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
              
              {/* Reviews section - Redesigned with cleaner UI */}
              <section className="max-w-7xl mx-auto px-4 py-14">
                <div className="mb-8">
                  <h2 className="text-xl font-bold mb-2">Customer Reviews</h2>
                  
                  {/* Overall rating and compact filters */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-6">
                      {/* Overall rating */}
                      <div className="flex items-center gap-3">
                        <div className="text-3xl font-medium">{product?.rating.toFixed(1)}</div>
                        <div className="flex flex-col">
                          <div className="flex">
                            {renderStars(Math.round(product?.rating || 0))}
                          </div>
                          <div className="text-xs text-gray-500">
                            {product?.reviewCount} reviews
                          </div>
                        </div>
                      </div>
                      
                      {/* Write review button */}
                      <Button className="bg-black hover:bg-black/90 text-white rounded-full h-9 px-5 text-sm font-medium cursor-pointer">
                        Write a Review
                      </Button>
                    </div>
                    
                    {/* Compact filters */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-sm text-gray-500 mr-1">Filter:</span>
                      <button 
                        onClick={() => setReviewFilter('all')}
                        className={`px-3 py-1 text-xs rounded-full ${
                          reviewFilter === 'all' 
                            ? 'bg-black text-white' 
                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                        }`}
                      >
                        All
                      </button>
                      {[5, 4, 3, 2, 1].map(rating => (
                        <button 
                          key={rating}
                          onClick={() => setReviewFilter(rating.toString())}
                          className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${
                            reviewFilter === rating.toString() 
                              ? 'bg-black text-white' 
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                          }`}
                        >
                          {rating}
                          <Star size={10} className="fill-current" />
                          <span className="opacity-75">({ratingCounts[rating]})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Reviews list - Minimalist design */}
                {displayReviews.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 gap-3">
                      {displayReviews.map((review) => (
                        <div key={review.id} className="rounded-lg p-5 bg-gray-50/50">
                          <div className="flex items-start gap-4">
                            {/* Review left side - user info */}
                            <div className="hidden sm:block">
                              <div className="w-11 h-11 bg-gray-100 rounded-full flex items-center justify-center overflow-hidden">
                                <span className="text-lg font-medium text-gray-600">{review.username.charAt(0).toUpperCase()}</span>
                              </div>
                            </div>
                            
                            {/* Review right side - content */}
                            <div className="flex-1">
                              {/* Header with rating and date */}
                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{review.username}</span>
                                    {review.verified && (
                                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full flex items-center">
                                        <Check size={10} className="mr-0.5" />
                                        Verified
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center mt-1">
                                    <div className="flex">
                                      {renderStars(review.rating)}
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2">{review.date}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Review title and content */}
                              <h4 className="font-medium mb-2">{review.title}</h4>
                              <p className="text-gray-600 text-sm">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  
                    {/* Show more button */}
                    {!showAllReviews && getFilteredReviews().length > 4 && (
                      <div className="flex justify-center mt-8">
                        <Button 
                          onClick={() => setShowAllReviews(true)}
                          className="bg-black hover:bg-black/90 text-white rounded-full h-9 px-6 text-sm font-medium cursor-pointer"
                        >
                          Show all {getFilteredReviews().length} reviews
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="rounded-lg py-12 px-6 text-center bg-gray-50/50">
                    <div className="mx-auto w-12 h-12 border border-gray-200 rounded-full flex items-center justify-center mb-3">
                      <Star size={20} className="text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No reviews yet</h3>
                    <p className="text-gray-500 text-sm max-w-md mx-auto mb-4">
                      There are no reviews matching your filter. Try another filter or be the first to review this product.
                    </p>
                    <Button className="bg-black hover:bg-black/90 text-white rounded-full h-9 px-5 text-sm font-medium cursor-pointer inline-flex">
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
            </>
          </Suspense>
      </main>
      </Suspense>
      
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
      
      <Footer />
    </div>
  );
} 