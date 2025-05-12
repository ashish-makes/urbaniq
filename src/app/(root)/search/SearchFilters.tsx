'use client';

import { useState, useRef, useEffect } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

// Filter state interface
export interface FilterState {
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

interface SearchFiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  resetFilters: () => void;
  defaultAccordionValues: string[];
}

export function SearchFilters({ 
  filters, 
  setFilters, 
  resetFilters,
  defaultAccordionValues
}: SearchFiltersProps) {
  // Temporary price range for UI before applying filter
  const [tempPriceRange, setTempPriceRange] = useState({
    min: filters.minPrice,
    max: filters.maxPrice
  });

  // Refs for slider interaction
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDraggingMin = useRef(false);
  const isDraggingMax = useRef(false);

  // Price slider percentage calculations
  const priceRange = 2000;
  const minThumbPosition = (tempPriceRange.min / priceRange) * 100;
  const maxThumbPosition = 100 - ((tempPriceRange.max / priceRange) * 100);

  // Add event listeners for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingMin.current && !isDraggingMax.current) return;
      if (!sliderRef.current) return;
      
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const sliderWidth = sliderRect.width;
      const offsetX = e.clientX - sliderRect.left;
      
      // Calculate the percentage of the slider
      let percentage = Math.max(0, Math.min(100, (offsetX / sliderWidth) * 100));
      
      // Convert percentage to price value
      const priceValue = Math.round((percentage / 100) * priceRange);
      
      if (isDraggingMin.current) {
        // Ensure min doesn't exceed max - 10
        const newMin = Math.min(priceValue, tempPriceRange.max - 10);
        setTempPriceRange(prev => ({ ...prev, min: newMin }));
      }
      
      if (isDraggingMax.current) {
        // Ensure max doesn't go below min + 10
        const newMax = Math.max(priceValue, tempPriceRange.min + 10);
        setTempPriceRange(prev => ({ ...prev, max: newMax }));
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isDraggingMin.current && !isDraggingMax.current) return;
      if (!sliderRef.current || !e.touches[0]) return;
      
      const sliderRect = sliderRef.current.getBoundingClientRect();
      const sliderWidth = sliderRect.width;
      const offsetX = e.touches[0].clientX - sliderRect.left;
      
      let percentage = Math.max(0, Math.min(100, (offsetX / sliderWidth) * 100));
      const priceValue = Math.round((percentage / 100) * priceRange);
      
      if (isDraggingMin.current) {
        const newMin = Math.min(priceValue, tempPriceRange.max - 10);
        setTempPriceRange(prev => ({ ...prev, min: newMin }));
      }
      
      if (isDraggingMax.current) {
        const newMax = Math.max(priceValue, tempPriceRange.min + 10);
        setTempPriceRange(prev => ({ ...prev, max: newMax }));
      }
    };
    
    const handleDragEnd = () => {
      isDraggingMin.current = false;
      isDraggingMax.current = false;
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
    
    // Cleanup
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleDragEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleDragEnd);
    };
  }, [tempPriceRange, priceRange]);

  // Apply price range
  const applyPriceFilter = () => {
    setFilters({
      ...filters,
      minPrice: tempPriceRange.min,
      maxPrice: tempPriceRange.max
    });
  };

  // Apply price bracket filter
  const applyPriceBracket = (min: number, max: number) => {
    setFilters({
      ...filters,
      minPrice: min,
      maxPrice: max
    });
    setTempPriceRange({ min, max });
  };

  // Set discount percentage filter
  const setDiscountFilter = (percentage: number | null) => {
    setFilters({
      ...filters,
      discountPercentage: percentage
    });
  };

  // Set sort option for the filter state
  const setSortFilterOption = (sortBy: FilterState['sortBy']) => {
    setFilters({
      ...filters,
      sortBy
    });
  };

  // Set rating filter
  const setRatingFilter = (rating: number | null) => {
    setFilters({
      ...filters,
      rating
    });
  };

  // Toggle filters
  const toggleFilter = (filterName: keyof FilterState) => {
    if (typeof filters[filterName] === 'boolean') {
      setFilters({
        ...filters,
        [filterName]: !filters[filterName]
      });
    }
  };

  return (
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
            
            {/* Quick price brackets */}
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
  );
} 