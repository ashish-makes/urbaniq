import { Suspense } from 'react';
import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { SearchClient } from './SearchClient';
import { Breadcrumb } from '@/components/Breadcrumb';

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

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: { searchParams: { q?: string } }): Promise<Metadata> {
  const params = await Promise.resolve(searchParams);
  const query = params.q || '';
  
  return {
    title: query ? `Search results for "${query}" | UrbanIQ` : 'Search | UrbanIQ',
    description: `Browse our selection of ${query ? `"${query}" related` : ''} smart pet technology products for modern pet parents.`,
    openGraph: {
      title: query ? `Search results for "${query}" | UrbanIQ` : 'Search | UrbanIQ',
      description: `Browse our selection of ${query ? `"${query}" related` : ''} smart pet technology products for modern pet parents.`,
      type: 'website',
    },
    alternates: {
      canonical: `https://urbaniq.vercel.app/search${query ? `?q=${query}` : ''}`,
    }
  };
}

// Fetch search results from the API
async function fetchSearchResults(query: string): Promise<Product[]> {
  if (!query.trim()) {
    return [];
      }

  try {
    // Use environment variable for the API URL with fallback
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/products/search?q=${encodeURIComponent(query)}`, {
      next: { revalidate: 60 } // Revalidate every minute
    });
    
        if (!response.ok) {
          throw new Error('Failed to fetch search results');
        }
    
        const data = await response.json();
    return data;
      } catch (error) {
        console.error('Error searching products:', error);
    return [];
  }
}

export default async function SearchPage({ searchParams }: { searchParams: { q?: string } }) {
  const params = await Promise.resolve(searchParams);
  const query = params.q || '';
  const products = await fetchSearchResults(query);

  // Build breadcrumb items - conditionally show search term only if there's a query
  const breadcrumbItems = [{ label: 'Search' }];
  if (query && query.trim()) {
    // Limit the query length in the breadcrumb to prevent UI issues with very long queries
    const displayQuery = query.length > 30 ? `${query.substring(0, 30)}...` : query;
    breadcrumbItems.push({ label: `Results for "${displayQuery}"` });
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb navigation */}
          <div className="mb-6">
            <Breadcrumb items={breadcrumbItems} />
          </div>
          
          <Suspense fallback={
            <div className="mb-8">
              <h1 className="text-2xl font-bold mb-1">Search Results</h1>
              <p className="text-gray-500">Loading...</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mt-8">
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
          }>
            <SearchClient initialQuery={query} initialProducts={products} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </div>
  );
} 