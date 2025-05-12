'use client';

import { useState, useEffect, useRef } from 'react';
import { ClientProductCard } from '@/components/ClientProductCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { Filter, Star, Search, CheckCheck } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Product type definition
interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  rating: number;
  reviewCount: number;
  images: string[];
  isBestseller?: boolean;
  featured?: boolean;
  category: string;
  categoryName?: string;
  categorySlug?: string;
  inStock?: boolean;
  onSale?: boolean;
  freeShipping?: boolean;
}

// Category type definition
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: {
    products: number;
  };
}

// Filter state interface
interface FilterState {
  minPrice: number;
  maxPrice: number;
  rating: number | null;
  inStock: boolean;
  onSale: boolean;
  freeShipping: boolean;
  isBestseller: boolean;
  featured: boolean;
  discountPercentage: number | null;
  sortBy: 'default' | 'priceAsc' | 'priceDesc';
}

interface CategoryClientProps {
  initialCategory: Category;
  initialProducts: Product[];
}

export function CategoryClient({ initialCategory, initialProducts }: CategoryClientProps) {
  // Add CSS for shimmer effect
  useEffect(() => {
    // Add shimmer effect CSS if it doesn't exist
    if (!document.getElementById('shimmer-style')) {
      const style = document.createElement('style');
      style.id = 'shimmer-style';
      style.innerHTML = `
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .shimmer-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 2s infinite;
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  
  // Refs for slider interaction
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingMin = useRef(false);
  const isDraggingMax = useRef(false);
  
  // Default accordion values - closed on mobile, open on desktop
  const [defaultAccordionValues, setDefaultAccordionValues] = useState<string[]>([]);
  
  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      // If not mobile (greater than 768px), open filters by default
      if (window.innerWidth >= 768) {
        setDefaultAccordionValues(["price", "rating", "availability"]);
      } else {
        setDefaultAccordionValues([]);
      }
    };
    
    // Check on mount
    checkScreenSize();
    
    // Add resize listener
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    minPrice: 0,
    maxPrice: 2000, // Increased max price
    rating: null,
    inStock: false,
    onSale: false,
    freeShipping: false,
    isBestseller: false,
    featured: false,
    discountPercentage: null,
    sortBy: 'default'
  });
  
  // Temporary price range for UI before applying filter
  const [tempPriceRange, setTempPriceRange] = useState({
    min: filters.minPrice,
    max: filters.maxPrice
  });
  
  // Price slider percentage calculations
  const priceRange = 2000; // Increased max price range
  const minThumbPosition = (tempPriceRange.min / priceRange) * 100;
  const maxThumbPosition = 100 - ((tempPriceRange.max / priceRange) * 100);
  
  // Handle mouse events for slider
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingMin.current && !isDraggingMax.current) return;
      if (!sliderRef.current) return;
      
      // Get slider dimensions
      const rect = sliderRef.current.getBoundingClientRect();
      const sliderWidth = rect.width;
      const sliderLeft = rect.left;
      
      // Calculate relative position (0-1)
      let position = Math.max(0, Math.min(1, (e.clientX - sliderLeft) / sliderWidth));
      
      // Convert to price value
      const priceValue = Math.round(position * priceRange);
      
      if (isDraggingMin.current) {
        // Ensure min doesn't exceed max
        const newMin = Math.min(priceValue, tempPriceRange.max - 10);
        setTempPriceRange(prev => ({...prev, min: newMin}));
      }
      
      if (isDraggingMax.current) {
        // Ensure max doesn't go below min
        const newMax = Math.max(priceValue, tempPriceRange.min + 10);
        setTempPriceRange(prev => ({...prev, max: newMax}));
      }
    };
    
    const handleMouseUp = () => {
      isDraggingMin.current = false;
      isDraggingMax.current = false;
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [tempPriceRange, priceRange]);
  
  // Touch event handlers for mobile
  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingMin.current && !isDraggingMax.current) return;
      if (!sliderRef.current || !e.touches[0]) return;
      
      // Get slider dimensions
      const rect = sliderRef.current.getBoundingClientRect();
      const sliderWidth = rect.width;
      const sliderLeft = rect.left;
      
      // Calculate relative position (0-1)
      let position = Math.max(0, Math.min(1, (e.touches[0].clientX - sliderLeft) / sliderWidth));
      
      // Convert to price value
      const priceValue = Math.round(position * priceRange);
      
      if (isDraggingMin.current) {
        // Ensure min doesn't exceed max
        const newMin = Math.min(priceValue, tempPriceRange.max - 10);
        setTempPriceRange(prev => ({...prev, min: newMin}));
      }
      
      if (isDraggingMax.current) {
        // Ensure max doesn't go below min
        const newMax = Math.max(priceValue, tempPriceRange.min + 10);
        setTempPriceRange(prev => ({...prev, max: newMax}));
      }
    };
    
    const handleTouchEnd = () => {
      isDraggingMin.current = false;
      isDraggingMax.current = false;
    };
    
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [tempPriceRange, priceRange]);

  // Apply filters and sorting to products
  let filteredProducts = initialProducts.filter(product => {
    // Price filter
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false;
    }
    
    // Discount percentage filter
    if (filters.discountPercentage && product.originalPrice) {
      const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
      if (discountPercent < filters.discountPercentage) {
        return false;
      }
    } else if (filters.discountPercentage && !product.originalPrice) {
      return false;
    }
    
    // Rating filter
    if (filters.rating && product.rating < filters.rating) {
      return false;
    }
    
    // Availability filters
    if (filters.inStock && !product.inStock) {
      return false;
    }
    
    if (filters.onSale && !product.onSale && !product.originalPrice) {
      return false;
    }
    
    if (filters.freeShipping && !product.freeShipping) {
      return false;
    }
    
    if (filters.isBestseller && !product.isBestseller) {
      return false;
    }
    
    if (filters.featured && !product.featured) {
      return false;
    }
    
    return true;
  });
  
  // Apply sorting
  if (filters.sortBy === 'priceAsc') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.price - b.price);
  } else if (filters.sortBy === 'priceDesc') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.price - a.price);
  }

  // Helper functions for filter changes
  const setRatingFilter = (rating: number | null) => {
    setFilters(prev => ({ ...prev, rating }));
  };
  
  const toggleFilter = (filterName: keyof FilterState) => {
    if (typeof filters[filterName] === 'boolean') {
      setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
    }
  };
  
  // Apply price range
  const applyPriceFilter = () => {
    setFilters(prev => ({
      ...prev, 
      minPrice: tempPriceRange.min,
      maxPrice: tempPriceRange.max
    }));
  };
  
  // Apply price bracket filter
  const applyPriceBracket = (min: number, max: number) => {
    setFilters(prev => ({
      ...prev,
      minPrice: min,
      maxPrice: max
    }));
    setTempPriceRange({ min, max });
  };
  
  // Set discount percentage filter
  const setDiscountFilter = (percentage: number | null) => {
    setFilters(prev => ({
      ...prev,
      discountPercentage: percentage
    }));
  };
  
  // Set sort option
  const setSortOption = (sortBy: FilterState['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy
    }));
  };
  
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      minPrice: 0,
      maxPrice: 2000,
      rating: null,
      inStock: false,
      onSale: false,
      freeShipping: false,
      isBestseller: false,
      featured: false,
      discountPercentage: null,
      sortBy: 'default'
    });
    setTempPriceRange({ min: 0, max: 2000 });
  };

  // Loading skeleton component
  const ProductSkeleton = () => (
    <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
      <div className="relative">
        <Skeleton className="w-full aspect-square bg-gray-100" />
        {/* Bestseller tag skeleton */}
        <div className="absolute top-2 left-2">
          <Skeleton className="h-4 w-16 rounded-full bg-gray-100" />
        </div>
      </div>
      <div className="p-4 space-y-2">
        <Skeleton className="w-3/4 h-4 rounded bg-gray-100" />
        <Skeleton className="w-1/2 h-3 rounded bg-gray-100" />
        <div className="pt-1">
          <Skeleton className="w-1/3 h-5 rounded bg-gray-100" />
        </div>
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center">
            <div className="flex">
              {Array(5).fill(0).map((_, i) => (
                <Skeleton key={i} className="w-2 h-2 rounded-full mr-0.5 bg-gray-100" />
              ))}
            </div>
            <Skeleton className="w-6 h-2 ml-1 rounded bg-gray-100" />
          </div>
          <Skeleton className="w-6 h-6 rounded-full bg-gray-100" />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Header with category title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {initialCategory?.name || 'Products'}
        </h1>
        <p className="text-gray-600">{initialCategory?.description || 'Browse our products'}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Left sidebar with filters */}
        <div className="w-full md:w-72 shrink-0">
          <div className="sticky top-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Refine your search</h2>
              <button
                onClick={resetFilters}
                className="text-sm text-gray-500 hover:text-black"
              >
                Reset all
              </button>
            </div>
            
            <Accordion 
              type="multiple" 
              defaultValue={defaultAccordionValues} 
              className="w-full space-y-1"
            >
              {/* Price filter */}
              <AccordionItem value="price" className="border-none">
                <AccordionTrigger className="py-1.5 px-0 hover:no-underline font-medium text-lg">
                  Price
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-3">
                  {/* Sort options */}
                  <div className="mb-3">
                    <h3 className="text-sm font-medium mb-2">Sort By Price</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                          filters.sortBy === 'priceAsc' 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSortOption(filters.sortBy === 'priceAsc' ? 'default' : 'priceAsc')}
                      >
                        Low to High
                      </button>
                      <button
                        className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                          filters.sortBy === 'priceDesc' 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSortOption(filters.sortBy === 'priceDesc' ? 'default' : 'priceDesc')}
                      >
                        High to Low
                      </button>
                    </div>
                  </div>
                  
                  {/* Quick price brackets - cloud style */}
                  <div className="mb-5">
                    <h3 className="text-sm font-medium mb-2">Price Range</h3>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                          filters.minPrice === 0 && filters.maxPrice === 50 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => applyPriceBracket(0, 50)}
                      >
                        Under $50
                      </button>
                      <button
                        className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                          filters.minPrice === 50 && filters.maxPrice === 100
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => applyPriceBracket(50, 100)}
                      >
                        $50-$100
                      </button>
                      <button
                        className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                          filters.minPrice === 100 && filters.maxPrice === 200
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => applyPriceBracket(100, 200)}
                      >
                        $100-$200
                      </button>
                      <button
                        className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                          filters.minPrice === 200 && filters.maxPrice === 500
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => applyPriceBracket(200, 500)}
                      >
                        $200-$500
                      </button>
                      <button
                        className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                          filters.minPrice === 500 && filters.maxPrice === 1000
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => applyPriceBracket(500, 1000)}
                      >
                        $500-$1000
                      </button>
                      <button
                        className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                          filters.minPrice === 1000 && filters.maxPrice === 2000
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => applyPriceBracket(1000, 2000)}
                      >
                        $1000+
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500">${tempPriceRange.min} - ${tempPriceRange.max}</span>
                  </div>
                  
                  <div className="relative mb-4 pt-4" ref={sliderRef}>
                    <div className="h-2 bg-gray-200 rounded-full">
                      <div 
                        className="absolute h-2 bg-black rounded-full" 
                        style={{
                          left: `${minThumbPosition}%`,
                          right: `${maxThumbPosition}%`
                        }}
                      ></div>
                    </div>
                    
                    <div 
                      className="absolute top-0 h-5 w-5 rounded-full bg-black border-2 border-white -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform active:scale-125"
                      style={{ left: `${minThumbPosition}%` }}
                      onMouseDown={() => { isDraggingMin.current = true; }}
                      onTouchStart={() => { isDraggingMin.current = true; }}
                      aria-label="Minimum price"
                      role="slider"
                      aria-valuemin={0}
                      aria-valuemax={priceRange}
                      aria-valuenow={tempPriceRange.min}
                    ></div>
                    
                    <div 
                      className="absolute top-0 h-5 w-5 rounded-full bg-black border-2 border-white -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform active:scale-125"
                      style={{ right: `${maxThumbPosition}%` }}
                      onMouseDown={() => { isDraggingMax.current = true; }}
                      onTouchStart={() => { isDraggingMax.current = true; }}
                      aria-label="Maximum price"
                      role="slider"
                      aria-valuemin={0}
                      aria-valuemax={priceRange}
                      aria-valuenow={tempPriceRange.max}
                    ></div>
                  </div>
                
                  <div className="flex gap-3 mb-4">
                    <div className="flex-1">
                      <label htmlFor="min-price" className="text-sm text-gray-500 mb-1 block">Min</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input 
                          type="number" 
                          id="min-price"
                          value={tempPriceRange.min}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            if (isNaN(value)) return;
                            setTempPriceRange(prev => ({ 
                              ...prev, 
                              min: Math.min(Math.max(0, value), prev.max - 10) 
                            }));
                          }}
                          className="w-full bg-gray-50 border border-gray-200 rounded-full px-7 py-2 text-sm"
                          min="0"
                          max={tempPriceRange.max - 10}
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <label htmlFor="max-price" className="text-sm text-gray-500 mb-1 block">Max</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                        <input 
                          type="number" 
                          id="max-price"
                          value={tempPriceRange.max}
                          onChange={(e) => {
                            const value = Number(e.target.value);
                            if (isNaN(value)) return;
                            setTempPriceRange(prev => ({ 
                              ...prev, 
                              max: Math.max(value, prev.min + 10) 
                            }));
                          }}
                          className="w-full bg-gray-50 border border-gray-200 rounded-full px-7 py-2 text-sm"
                          min={tempPriceRange.min + 10}
                          max={priceRange}
                        />
                      </div>
                    </div>
                  </div>
                
                  <button 
                    className="w-full bg-black text-white py-2 rounded-full font-medium text-sm transition-opacity hover:opacity-90"
                    onClick={applyPriceFilter}
                  >
                    Apply Filter
                  </button>
                  
                  {/* Discount filter */}
                  <div className="mt-5">
                    <h3 className="text-sm font-medium mb-2">Discount</h3>
                    <div className="flex flex-wrap gap-2">
                      <button 
                        className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                          filters.discountPercentage === 10 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setDiscountFilter(filters.discountPercentage === 10 ? null : 10)}
                      >
                        10% off+
                      </button>
                      
                      <button 
                        className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                          filters.discountPercentage === 25 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setDiscountFilter(filters.discountPercentage === 25 ? null : 25)}
                      >
                        25% off+
                      </button>
                      
                      <button 
                        className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                          filters.discountPercentage === 50 
                            ? 'bg-black text-white border-black' 
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setDiscountFilter(filters.discountPercentage === 50 ? null : 50)}
                      >
                        50% off+
                      </button>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Rating filter */}
              <AccordionItem value="rating" className="border-none">
                <AccordionTrigger className="py-1.5 px-0 hover:no-underline font-medium text-lg">
                  Rating
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      className={`flex items-center text-sm py-1.5 px-4 rounded-full transition-colors border ${
                        filters.rating === 5
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setRatingFilter(filters.rating === 5 ? null : 5)}
                    >
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg key={star} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={filters.rating === 5 ? "white" : "black"} stroke="none" className="mr-0.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-sm">only</span>
                    </button>
                    
                    <button
                      className={`flex items-center text-sm py-1.5 px-4 rounded-full transition-colors border ${
                        filters.rating === 4
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setRatingFilter(filters.rating === 4 ? null : 4)}
                    >
                      <div className="flex items-center">
                        {[1, 2, 3, 4].map((star) => (
                          <svg key={star} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={filters.rating === 4 ? "white" : "black"} stroke="none" className="mr-0.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={filters.rating === 4 ? "rgba(255,255,255,0.3)" : "gray"} stroke="none" className="mr-0.5">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                        </svg>
                      </div>
                      <span className="ml-1 text-sm">& up</span>
                    </button>
                    
                    <button
                      className={`flex items-center text-sm py-1.5 px-4 rounded-full transition-colors border ${
                        filters.rating === 3
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => setRatingFilter(filters.rating === 3 ? null : 3)}
                    >
                      <div className="flex items-center">
                        {[1, 2, 3].map((star) => (
                          <svg key={star} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={filters.rating === 3 ? "white" : "black"} stroke="none" className="mr-0.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                        {[4, 5].map((star) => (
                          <svg key={star} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill={filters.rating === 3 ? "rgba(255,255,255,0.3)" : "gray"} stroke="none" className="mr-0.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-sm">& up</span>
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              {/* Availability filter */}
              <AccordionItem value="availability" className="border-none">
                <AccordionTrigger className="py-1.5 px-0 hover:no-underline font-medium text-lg">
                  Availability
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-3">
                  <div className="flex flex-wrap gap-2">
                    <button 
                      className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                        filters.inStock 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleFilter('inStock')}
                    >
                      In Stock
                    </button>
                    
                    <button 
                      className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                        filters.onSale 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleFilter('onSale')}
                    >
                      On Sale
                    </button>
                    
                    <button 
                      className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                        filters.isBestseller 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleFilter('isBestseller')}
                    >
                      Bestseller
                    </button>
                    
                    <button 
                      className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                        filters.featured 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleFilter('featured')}
                    >
                      Featured
                    </button>
                    
                    <button 
                      className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                        filters.freeShipping 
                          ? 'bg-black text-white border-black' 
                          : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      }`}
                      onClick={() => toggleFilter('freeShipping')}
                    >
                      Free Shipping
                    </button>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        
        {/* Product Listing */}
        <div className="flex-1">
          {filteredProducts.length > 0 ? (
            // Show products
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id}>
                  <ClientProductCard 
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    description={product.description}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    image={product.images[0] || '/placeholder.png'}
                    isBestseller={product.isBestseller}
                    slug={product.slug}
                  />
                </div>
              ))}
            </div>
          ) : (
            // No products found
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">No products found</h3>
                <p className="text-gray-600 mb-8 max-w-md">
                  We couldn't find any products that match your current filters. Try adjusting your selections or browse all products.
                </p>
                <Button 
                  onClick={resetFilters}
                  className="rounded-full px-8 bg-black hover:bg-black/80 transition-colors"
                >
                  Reset Filters
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 