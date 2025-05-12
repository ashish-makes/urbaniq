'use client';

import { useState, useEffect, useRef } from 'react';
import { ClientProductCard } from '@/components/ClientProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SearchFilters, FilterState } from './SearchFilters';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  rating: number;
  reviewCount: number;
  images: string[];
  isBestseller?: boolean;
  slug: string;
  originalPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  freeShipping?: boolean;
  featured?: boolean;
}

interface SearchClientProps {
  initialQuery: string;
  initialProducts: Product[];
}

export function SearchClient({ initialQuery, initialProducts }: SearchClientProps) {
  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Product[]>(initialProducts);
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  // Mouse event refs for slider
  const isDraggingMin = useRef(false);
  const isDraggingMax = useRef(false);

  // Default accordion values - closed on mobile, open on desktop
  const [defaultAccordionValues, setDefaultAccordionValues] = useState<string[]>([]);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 768) {
        setDefaultAccordionValues(["price", "rating", "availability"]);
      } else {
        setDefaultAccordionValues([]);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Consolidated filter state
  const [filters, setFilters] = useState<FilterState>({
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

  // Refetch search results when query changes
  useEffect(() => {
    async function fetchSearchResults() {
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error('Error searching products:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }

    // Only refetch if query changes from initial
    if (query !== initialQuery) {
      fetchSearchResults();
    }
  }, [query, initialQuery]);

  // Apply filters and sorting to results
  const filteredResults = results.filter(product => {
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
  const sortedResults = [...filteredResults].sort((a, b) => {
    if (filters.sortBy === 'priceAsc') {
      return a.price - b.price;
    } else if (filters.sortBy === 'priceDesc') {
      return b.price - a.price;
    }
    return 0;
  });

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
  };

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const searchQuery = formData.get('q') as string;
    if (searchQuery) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setQuery(searchQuery);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-1">Search Results</h1>
            <p className="text-gray-500">
              {isLoading ? (
                'Searching...'
              ) : results.length > 0 ? (
                `Found ${results.length} results for "${query}"`
              ) : (
                `No results found for "${query}"`
              )}
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-3 flex items-center">
                <Search size={18} className="text-gray-400" />
              </div>
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="search"
                  name="q"
                  defaultValue={query}
                  placeholder="Refine your search..."
                  className="w-full pl-10 pr-12 h-10 rounded-lg border border-gray-200 focus:ring-0 [&::-webkit-search-cancel-button]:appearance-none"
                />
                {query && (
                  <button 
                    type="reset"
                    className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center w-6 h-6 rounded-full hover:bg-gray-100 transition-colors"
                    onClick={() => {
                      router.push('/search');
                      setQuery('');
                    }}
                    aria-label="Clear search"
                  >
                    <X size={16} className="text-gray-400" />
                  </button>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Left sidebar with filters */}
        <div className="w-full md:w-72 shrink-0">
          <SearchFilters 
            filters={filters}
            setFilters={setFilters}
            resetFilters={resetFilters}
            defaultAccordionValues={defaultAccordionValues}
          />
        </div>

        {/* Right side product listings */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, index) => (
                <div key={index} className="relative overflow-hidden">
                  <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
                    <div className="relative">
                      <Skeleton className="w-full aspect-square bg-gray-100" />
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
                </div>
              ))}
            </div>
          ) : sortedResults.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-gray-100">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">No products found</h3>
                <p className="text-gray-600 mb-8 max-w-md">
                  We couldn't find any products that match your current filters. Try adjusting your selections or browse all products.
                </p>
                <button 
                  onClick={resetFilters}
                  className="rounded-full px-8 py-2 bg-black text-white hover:bg-black/80 transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {sortedResults.map((product) => (
                <div key={product.id} className="transition-all duration-300">
                  <ClientProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    description={product.description}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    image={product.images[0]}
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
  );
} 