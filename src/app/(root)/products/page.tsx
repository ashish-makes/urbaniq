'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ClientProductCard } from '@/components/ClientProductCard';
import { Button } from '@/components/ui/button';
import { Filter, Grid3x3, List, SlidersHorizontal, Search } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

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
  image: string;
  images?: string[];
  isBestseller?: boolean;
  featured?: boolean;
  category: string;
  inStock?: boolean;
  onSale?: boolean;
  freeShipping?: boolean;
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

// Fetch categories from API
const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch('/api/categories', {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

// Fetch products from API
const fetchProducts = async (categorySlug?: string, featured?: boolean): Promise<Product[]> => {
  try {
    let url = '/api/products';
    const params = new URLSearchParams();
    
    if (categorySlug && categorySlug !== 'all') {
      params.append('category', categorySlug);
    }
    
    if (featured) {
      params.append('featured', 'true');
    }
    
    // Add a limit parameter to fetch more products
    params.append('limit', '20');
    
    // Add params to URL if any exist
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    console.log("Fetching products from:", url);
      
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const products = await response.json();
    console.log(`Fetched ${products.length} products from ${url}`);
    return products;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export default function ProductsPage() {
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

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGridView, setIsGridView] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  
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
        setDefaultAccordionValues(["category", "price", "rating", "availability"]);
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
  
  // Consolidated filter state
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
  
  // Fetch products with React Query
  const { data: allProducts = [], isLoading, isError } = useQuery<Product[]>({
    queryKey: ['products', 'all'],
    queryFn: () => fetchProducts(),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch categories with React Query
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
  });

  // Fetch category-specific products when a category is selected
  const { data: categoryProducts = [] } = useQuery<Product[]>({
    queryKey: ['products', selectedCategory],
    queryFn: () => fetchProducts(selectedCategory),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: selectedCategory !== 'all',
  });

  // Fetch featured products specifically
  const { data: featuredProducts = [] } = useQuery<Product[]>({
    queryKey: ['featuredProducts', 'featured'],
    queryFn: () => fetchProducts(undefined, true),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  // Get the products to be filtered in the main listing
  // Use category products if a category is selected, otherwise use all products
  const productsToFilter = selectedCategory !== 'all' && categoryProducts.length > 0 
    ? categoryProducts 
    : allProducts;

  // Apply filters and sorting to products
  let filteredProducts = productsToFilter
    .filter(product => {
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
  } else {
    // Use existing sort logic for other options
    filteredProducts = filteredProducts.sort((a, b) => {
      switch (sortOption) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return 0; // In a real app, would compare dates
        default: // featured
          return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      }
    });
  }

  // Prepare carousel products
  // For the first carousel, use ONLY featured products
  const firstCarouselProducts = featuredProducts.filter(p => p.featured === true);
  console.log(`Featured products for first carousel: ${firstCarouselProducts.length}`);
  
  // Get ONLY bestseller products for second carousel
  const secondCarouselProducts = allProducts.filter(p => p.isBestseller === true);
  console.log(`Bestseller products for second carousel: ${secondCarouselProducts.length}`);

  // Reset all filters
  const resetFilters = () => {
    setSelectedCategory('all');
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
    setSortOption('featured');
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
  
  // Set sort option for the filter state
  const setSortFilterOption = (sortBy: FilterState['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy
    }));

    // Keep the traditional sort option in sync
    if (sortBy === 'priceAsc') {
      setSortOption('price-low');
    } else if (sortBy === 'priceDesc') {
      setSortOption('price-high');
    }
  };
  
  // Set rating filter
  const setRatingFilter = (rating: number | null) => {
    setFilters(prev => ({ ...prev, rating }));
  };
  
  // Toggle filters
  const toggleFilter = (filterName: keyof FilterState) => {
    if (typeof filters[filterName] === 'boolean') {
      setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
    }
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
    <div>
      <Header />
      
      <main>
        {/* Hero section with featured products carousel */}
        <section className="py-10 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Paws Down, My Faves Right Now!</h2>
            
            <div className="relative py-4">
              <Carousel
                opts={{
                  align: "start",
                  slidesToScroll: 1
                }}
                className="w-full"
              >
                <CarouselContent className="h-full">
                  {isLoading ? (
                    // Show skeletons when loading
                    Array.from({ length: 4 }).map((_, index) => (
                      <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 h-full">
                        <div className="p-1 h-full relative overflow-hidden">
                          <ProductSkeleton />
                          <div className="shimmer-effect"></div>
                        </div>
                      </CarouselItem>
                    ))
                  ) : firstCarouselProducts.length > 0 ? (
                    // Show ONLY featured products
                    firstCarouselProducts.map((product) => (
                    <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 h-full">
                      <div className="p-1 h-full">
                          <ClientProductCard 
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            description={product.description}
                            rating={product.rating}
                            reviewCount={product.reviewCount}
                            image={product.image || (product.images && product.images[0]) || '/placeholder.png'}
                            isBestseller={product.isBestseller}
                            featured={product.featured}
                            slug={product.slug}
                          />
                      </div>
                    </CarouselItem>
                    ))
                  ) : (
                    // Fallback if no featured products found
                    <CarouselItem className="col-span-4 text-center py-10">
                      <div className="p-1 h-full">
                        <p className="text-gray-500">No featured products available at the moment.</p>
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <CarouselPrevious className="left-0 bg-black border-black hover:bg-black/80 text-white hover:text-white transition-all duration-200" />
                <CarouselNext className="right-0 bg-black border-black hover:bg-black/80 text-white hover:text-white transition-all duration-200" />
              </Carousel>
            </div>
          </div>
        </section>

        {/* Top Selling Products Section */}
        <section className="pt-2 pb-10 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Everyone's Sniffing These Out!</h2>
            
            <div className="relative py-4">
              <Carousel
                opts={{
                  align: "start",
                  slidesToScroll: 1
                }}
                className="w-full"
              >
                <CarouselContent className="h-full">
                  {isLoading ? (
                    // Show skeletons when loading
                    Array.from({ length: 4 }).map((_, index) => (
                      <CarouselItem key={index} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 h-full">
                        <div className="p-1 h-full relative overflow-hidden">
                          <ProductSkeleton />
                          <div className="shimmer-effect"></div>
                        </div>
                      </CarouselItem>
                    ))
                  ) : secondCarouselProducts.length > 0 ? (
                    // Show ONLY bestseller products
                    secondCarouselProducts.map((product) => (
                    <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 h-full">
                      <div className="p-1 h-full">
                          <ClientProductCard 
                            id={product.id}
                            name={product.name}
                            price={product.price}
                            description={product.description}
                            rating={product.rating}
                            reviewCount={product.reviewCount}
                            image={product.image || (product.images && product.images[0]) || '/placeholder.png'}
                            isBestseller={product.isBestseller}
                            featured={product.featured}
                            slug={product.slug}
                          />
                      </div>
                    </CarouselItem>
                    ))
                  ) : (
                    // Fallback if no bestseller products found
                    <CarouselItem className="col-span-4 text-center py-10">
                      <div className="p-1 h-full">
                        <p className="text-gray-500">No bestseller products available at the moment.</p>
                      </div>
                    </CarouselItem>
                  )}
                </CarouselContent>
                <CarouselPrevious className="left-0 bg-black border-black hover:bg-black/80 text-white hover:text-white transition-all duration-200" />
                <CarouselNext className="right-0 bg-black border-black hover:bg-black/80 text-white hover:text-white transition-all duration-200" />
              </Carousel>
            </div>
          </div>
        </section>

        {/* Search refinement and product listing section */}
        <section className="pt-6 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
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
                    {/* Category filter */}
                    <AccordionItem value="category" className="border-none">
                      <AccordionTrigger className="py-1.5 px-0 hover:no-underline font-medium text-lg">
                        Category
                      </AccordionTrigger>
                      <AccordionContent className="pt-0 pb-3">
                        <div className="flex flex-wrap gap-2">
                          <button 
                            className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                              selectedCategory === 'all' 
                                ? 'bg-black text-white border-black' 
                                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => setSelectedCategory('all')}
                          >
                            All Products
                          </button>
                          {isCategoriesLoading ? (
                            Array(5).fill(0).map((_, index) => (
                              <div key={index} className="h-8 w-24 rounded-full border border-gray-100 overflow-hidden relative">
                                <Skeleton className="absolute inset-0" />
                              </div>
                            ))
                          ) : (
                            categories.map(category => (
                              <Link 
                                key={category.id}
                                href={`/products/category/${category.slug}`}
                                className="inline-block"
                              >
                                <button 
                                  className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                                    selectedCategory === category.slug 
                                      ? 'bg-black text-white border-black' 
                                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault(); // Prevent navigation
                                    setSelectedCategory(category.slug);
                                  }}
                                >
                                  {category.name}
                                </button>
                              </Link>
                            ))
                          )}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Price filter */}
                    <AccordionItem value="price" className="border-none">
                      <AccordionTrigger className="py-1.5 px-0 hover:no-underline font-medium text-lg">
                        Price
                      </AccordionTrigger>
                      <AccordionContent className="pt-0 pb-4">
                        {/* Sort options */}
                        <div className="mb-4">
                          <h3 className="text-sm font-medium mb-2">Sort By Price</h3>
                          <div className="flex flex-wrap gap-2">
                            <button
                              className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                                filters.sortBy === 'priceAsc' 
                                  ? 'bg-black text-white border-black' 
                                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                              }`}
                              onClick={() => setSortFilterOption(filters.sortBy === 'priceAsc' ? 'default' : 'priceAsc')}
                            >
                              Low to High
                            </button>
                            <button
                              className={`text-sm py-1.5 px-4 rounded-full transition-colors border ${
                                filters.sortBy === 'priceDesc' 
                                  ? 'bg-black text-white border-black' 
                                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                              }`}
                              onClick={() => setSortFilterOption(filters.sortBy === 'priceDesc' ? 'default' : 'priceDesc')}
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
              
              {/* Right side product listings */}
              <div className="flex-1">
                {isLoading ? (
                  // Show loading skeletons with shimmer effect
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, index) => (
                      <div key={index} className="relative overflow-hidden">
                        <ProductSkeleton />
                        <div className="shimmer-effect"></div>
                      </div>
                    ))}
                  </div>
                ) : isError ? (
                  // Show error message
                  <div className="py-10 text-center">
                    <h3 className="text-xl font-medium text-gray-700 mb-4">Failed to load products</h3>
                    <p className="text-gray-500 mb-6">Please try again later or contact support if the problem persists.</p>
                    <Button 
                      onClick={() => window.location.reload()}
                      className="bg-black hover:bg-black/90 text-white"
                    >
                      Retry
                    </Button>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  // Show no products message
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
                ) : (
                  // Show products
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                    <div key={product.id} className="transition-all duration-300">
                        <ClientProductCard 
                          id={product.id}
                          name={product.name}
                          price={product.price}
                          description={product.description}
                          rating={product.rating}
                          reviewCount={product.reviewCount}
                          image={product.image || (product.images && product.images[0]) || '/placeholder.png'}
                          isBestseller={product.isBestseller}
                          slug={product.slug}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
} 