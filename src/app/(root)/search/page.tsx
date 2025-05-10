'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ClientProductCard } from '@/components/ClientProductCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [isLoading, setIsLoading] = useState(true);
  const [results, setResults] = useState<Product[]>([]);
  const [filters, setFilters] = useState({ sortBy: 'relevance' });
  const [showFilters, setShowFilters] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchSearchResults() {
      if (!query.trim()) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Using the API route to search products
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

    fetchSearchResults();
  }, [query]);

  // Apply sorting to results if needed
  const sortedResults = [...results].sort((a, b) => {
    if (filters.sortBy === 'price-asc') {
      return a.price - b.price;
    } else if (filters.sortBy === 'price-desc') {
      return b.price - a.price;
    } else if (filters.sortBy === 'rating') {
      return b.rating - a.rating;
    }
    // Default relevance sorting (already handled by backend)
    return 0;
  });

  // Handle sort change
  const handleSortChange = (sortBy: string) => {
    setFilters({ ...filters, sortBy });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
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
                  <form action="/search" method="get" className="relative w-full">
                    <input
                      type="search"
                      name="q"
                      defaultValue={query}
                      placeholder="Refine your search..."
                      className="w-full pl-10 pr-12 h-10 rounded-full border border-gray-200 focus:border-gray-300 focus:ring-0 [&::-webkit-search-cancel-button]:appearance-none"
                    />
                    {query && (
                      <button 
                        type="reset"
                        className="absolute inset-y-0 right-3 flex items-center p-1 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() => {
                          router.push('/search');
                        }}
                      >
                        <X size={16} className="text-gray-400" />
                      </button>
                    )}
                  </form>
                </div>

                <div className="hidden md:flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <div className="relative">
                    <select
                      value={filters.sortBy}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="h-10 pl-3 pr-8 rounded-full border border-gray-200 focus:border-gray-300 focus:ring-0 text-sm font-medium bg-white appearance-none cursor-pointer min-w-[140px]"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="md:hidden flex items-center justify-center gap-2 px-4 h-10 rounded-full border border-gray-200 text-sm"
                >
                  <Filter size={16} />
                  <span>Filter & Sort</span>
                </button>
              </div>

              {showFilters && (
                <div className="md:hidden mt-4 p-4 border border-gray-200 rounded-xl">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Sort By</h3>
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <X size={18} className="text-gray-500" />
                    </button>
                  </div>
                  <div className="space-y-2">
                    {['relevance', 'price-asc', 'price-desc', 'rating'].map((option) => (
                      <div key={option} className="flex items-center">
                        <input
                          type="radio"
                          id={option}
                          name="sortBy"
                          checked={filters.sortBy === option}
                          onChange={() => handleSortChange(option)}
                          className="mr-2"
                        />
                        <label htmlFor={option} className="text-sm">
                          {option === 'relevance'
                            ? 'Relevance'
                            : option === 'price-asc'
                            ? 'Price: Low to High'
                            : option === 'price-desc'
                            ? 'Price: High to Low'
                            : 'Highest Rated'}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="flex flex-col space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                  <Skeleton className="h-4 w-1/4 rounded-md" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {sortedResults.map((product) => (
                <ClientProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  description={product.description}
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  image={product.images[0]}
                  slug={product.slug}
                  isBestseller={product.isBestseller}
                />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search size={24} className="text-gray-400" />
              </div>
              <h2 className="text-xl font-medium mb-2">No products found</h2>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                We couldn't find any products matching your search. Try using different keywords or browse our categories.
              </p>
              <Link 
                href="/products" 
                className="inline-flex items-center justify-center h-10 px-6 bg-black text-white rounded-full text-sm font-medium hover:bg-black/90 transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1">Search Results</h1>
              <p className="text-gray-500">Loading...</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div key={item} className="flex flex-col space-y-3">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4 rounded-md" />
                  <Skeleton className="h-4 w-1/2 rounded-md" />
                  <Skeleton className="h-4 w-1/4 rounded-md" />
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
} 