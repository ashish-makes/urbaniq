import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ProductsClient } from './ProductsClient';

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
  images: string[];
  isBestseller?: boolean;
  featured?: boolean;
  category: string;
  inStock?: boolean;
  onSale?: boolean;
  freeShipping?: boolean;
}

// Generate metadata for SEO
export const metadata: Metadata = {
  title: 'Pet Tech Products | UrbanIQ',
  description: 'Browse our wide selection of smart pet technology products including GPS trackers, automated feeders, smart toys, and health monitors for modern pet parents.',
  keywords: 'pet tech, smart pet devices, pet gadgets, dog tech, cat tech, pet GPS trackers, pet health monitors',
  openGraph: {
    title: 'Pet Tech Products | UrbanIQ',
    description: 'Discover innovative smart technology for your pets. From GPS trackers to automated feeders, browse our collection of modern pet gadgets.',
    type: 'website',
    url: '/products',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'UrbanIQ Pet Tech Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pet Tech Products | UrbanIQ',
    description: 'Browse our collection of smart pet technology for modern pet parents.',
    images: ['/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://urbaniq.vercel.app/products',
  },
};

// Fetch categories from API
async function fetchCategories(): Promise<Category[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/categories`, {
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
}

// Fetch products from API
async function fetchProducts(categorySlug?: string, featured?: boolean): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    let url = `${baseUrl}/api/products`;
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
    
    console.log("Server-side fetching products from:", url);
      
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
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
}

export default async function ProductsPage() {
  // Server-side data fetching
  const categoriesPromise = fetchCategories();
  const allProductsPromise = fetchProducts();
  const featuredProductsPromise = fetchProducts(undefined, true);
  
  // Await promises in parallel
  const [categories, allProducts, featuredProducts] = await Promise.all([
    categoriesPromise, 
    allProductsPromise, 
    featuredProductsPromise
  ]);
  
  // Generate structured data for SEO
  const productsListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": allProducts.slice(0, 10).map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Product",
        "name": product.name,
        "description": product.description,
        "image": product.images[0],
        "url": `https://urbaniq.vercel.app/products/${product.slug}`,
        "sku": product.id,
        "offers": {
          "@type": "Offer",
          "price": product.price,
          "priceCurrency": "USD",
          "availability": product.inStock 
            ? "https://schema.org/InStock" 
            : "https://schema.org/OutOfStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": product.rating || 4.5,
          "reviewCount": product.reviewCount || 10
        }
      }
    }))
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Add JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productsListSchema) }}
        />
        
        <Suspense fallback={
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-4">
                <Skeleton className="w-48 h-8" />
              </h1>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                    <Skeleton className="h-4 w-1/4 rounded-md" />
                      </div>
                    ))}
              </div>
            </div>
          </div>
        }>
          <ProductsClient 
            initialCategories={categories}
            initialAllProducts={allProducts}
            initialFeaturedProducts={featuredProducts}
          />
        </Suspense>
      </main>
      
      <Footer />
    </div>
  );
} 