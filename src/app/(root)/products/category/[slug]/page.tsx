import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { CategoryClient } from './CategoryClient';
import { Breadcrumb } from '@/components/Breadcrumb';

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

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const category = await fetchCategory(slug);
  
  // Default metadata when category doesn't exist
  if (!category) {
    return {
      title: 'Category Not Found | UrbanIQ Pet Tech',
      description: 'The category you are looking for does not exist or may have been removed.',
      openGraph: {
        title: 'Category Not Found | UrbanIQ Pet Tech',
        description: 'The category you are looking for does not exist or may have been removed.',
        type: 'website',
        url: `/products/category/${slug}`,
        images: [
          {
            url: '/og-image.jpg',
            width: 1200,
            height: 630,
            alt: 'Category Not Found - UrbanIQ Pet Tech',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Category Not Found | UrbanIQ Pet Tech',
        description: 'The category you are looking for does not exist or may have been removed.',
      },
      alternates: {
        canonical: `https://urbaniq.vercel.app/products/category/${slug}`,
      }
    };
  }
  
  const categoryName = category.name;
  const categoryDescription = category.description || 'Browse our products in this category';
  
  return {
    title: `${categoryName} | UrbanIQ Pet Tech`,
    description: categoryDescription,
    openGraph: {
      title: `${categoryName} | UrbanIQ Pet Tech`,
      description: categoryDescription,
      type: 'website',
      url: `/products/category/${slug}`,
      images: [
        {
          url: category.image || '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: `${categoryName} - UrbanIQ Pet Tech`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${categoryName} | UrbanIQ Pet Tech`,
      description: categoryDescription,
    },
    alternates: {
      canonical: `https://urbaniq.vercel.app/products/category/${slug}`,
    }
  };
}

// Fetch category details from API
async function fetchCategory(slug: string): Promise<Category | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/categories?slug=${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      // If category is not found, return null instead of throwing
      if (response.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch category');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching category:', error);
    throw error;
  }
}

// Fetch products from API
async function fetchProducts(categorySlug: string): Promise<Product[]> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/products?category=${categorySlug}`;
    
    const response = await fetch(url, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      return []; // Return empty array instead of throwing
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

export default async function CategoryProductsPage({ params }: { params: { slug: string } }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  // Server-side data fetching
  const category = await fetchCategory(slug);
  
  // Handle case when category doesn't exist
  if (!category) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="mb-6">
              <Breadcrumb 
                items={[
                  { label: 'Products', href: '/products' },
                  { label: 'Category not found' }
                ]}
              />
            </div>
            
            <div className="py-16 text-center">
              <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <path d="M12 9v4" />
                  <path d="M12 17h.01" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Category Not Found</h3>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                The category you're looking for doesn't exist or might have been removed.
              </p>
              <a 
                href="/products" 
                className="group inline-flex items-center justify-center py-2.5 pl-6 pr-4 rounded-full bg-black text-white border border-gray-800 hover:bg-black/80 transition-all font-medium text-sm"
              >
                <span className="mr-2">Browse All Products</span>
                <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                  <div className="w-[14px] h-[14px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </a>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }
  
  // Only fetch products if category exists
  const products = await fetchProducts(slug);
  
  // Generate structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} Products`,
    "description": category.description,
    "url": `https://urbaniq.vercel.app/products/category/${slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": products.slice(0, 10).map((product, index) => ({
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
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Add JSON-LD structured data */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
          
          {/* Breadcrumb navigation */}
          <div className="mb-6">
            <Breadcrumb 
              items={[
                { label: 'Products', href: '/products' },
                { label: category.name }
              ]}
            />
          </div>
          
          <Suspense fallback={
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">
                <Skeleton className="w-48 h-8" />
            </h1>
              <Skeleton className="w-64 h-4" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="flex flex-col space-y-3">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4 rounded-md" />
                    <Skeleton className="h-4 w-1/2 rounded-md" />
                    <Skeleton className="h-4 w-1/4 rounded-md" />
                          </div>
                ))}
              </div>
            </div>
          }>
            <CategoryClient 
              initialCategory={category} 
              initialProducts={products} 
            />
          </Suspense>
        </div>
      </main>
      
      <Footer />
    </div>
  );
} 