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
  
  const categoryName = category?.name || 'Category';
  const categoryDescription = category?.description || 'Browse our products in this category';
  
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
          url: category?.image || '/og-image.jpg',
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
async function fetchCategory(slug: string): Promise<Category> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/categories?slug=${slug}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
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
      throw new Error('Failed to fetch products');
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
  const categoryPromise = fetchCategory(slug);
  const productsPromise = fetchProducts(slug);
  
  // Await promises in parallel
  const [category, products] = await Promise.all([categoryPromise, productsPromise]);
  
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