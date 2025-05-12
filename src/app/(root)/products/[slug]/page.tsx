import { Metadata, ResolvingMetadata } from 'next';
import { Suspense } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductDetailsClient } from './ProductDetailsClient';
import { notFound } from 'next/navigation';

// Types
interface ProductSpec {
  [key: string]: string;
}

interface ReviewImage {
  id: string;
  url: string;
  fileId: string;
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
  images?: ReviewImage[];
  userId?: string;
  user?: {
    image?: string;
  };
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

// Fetch a product by slug
export async function fetchProduct(slug: string) {
  try {
    // Add a timestamp to prevent caching
    const timestamp = Date.now();
    
    // Ensure we have a base URL - safer check for server component
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (typeof window !== 'undefined' ? window.location.origin : '') || 
      'http://localhost:3000';
    
    // First try to fetch by slug
    const slugRes = await fetch(
      `${baseUrl}/api/products/${slug}?t=${timestamp}`,
      {
        next: { revalidate: 0 },
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
    
    if (slugRes.ok) {
      return slugRes.json();
    }
    
    // If slug fetch fails, try to fetch by ID (in case slug is actually an ID)
    const idRes = await fetch(
      `${baseUrl}/api/products/id/${slug}?t=${timestamp}`,
      {
        next: { revalidate: 0 },
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      }
    );
    
    if (idRes.ok) {
      return idRes.json();
    }
    
    throw new Error(`Failed to fetch product by slug or ID: ${slug}`);
    } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
}

// Fetch related products by category
async function fetchRelatedProducts(productData: Product): Promise<Product[]> {
  try {
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
  
    // Ensure we have a base URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 
      (typeof window !== 'undefined' ? window.location.origin : '') || 
      'http://localhost:3000';
      
    const timestamp = Date.now();
    let apiUrl = `${baseUrl}/api/products`;
    
    if (categoryId) {
      apiUrl += `?categoryId=${encodeURIComponent(categoryId)}&t=${timestamp}`;
    } else if (categoryName) {
      apiUrl += `?category=${encodeURIComponent(categoryName)}&t=${timestamp}`;
    } else {
      apiUrl += `?t=${timestamp}`;
    }
    
    const response = await fetch(apiUrl, {
      next: { revalidate: 0 },
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch products. Status: ${response.status}`);
    }
    
    const products = await response.json();
    
    // Filter out current product and limit to 4 related products
    const filtered = products
      .filter((p: Product) => p.slug !== productData.slug && p.id !== productData.id)
      .slice(0, 4);
    
    return filtered;
  } catch (error) {
    console.error('Error fetching related products:', error);
    return [];
  }
}

// Generate metadata for the product page
export async function generateMetadata(
  { params }: { params: { slug: string } },
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Properly await params before accessing its properties
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  try {
    const product = await fetchProduct(slug);

    if (!product) {
      return {
        title: 'Product Not Found | UrbanIQ Pet Tech',
        description: 'The requested product could not be found.',
      };
    }

    // Get parent metadata (e.g., from layout.tsx)
    const previousImages = (await parent).openGraph?.images || [];

    return {
      title: `${product.name} | UrbanIQ Pet Tech`,
      description: product.description || `Explore ${product.name} at UrbanIQ Pet Tech. Find the best tech products for your furry friends.`,
      keywords: product.tags || ["pet tech", "smart pet devices", "pet gadgets"],
      openGraph: {
        title: `${product.name} | UrbanIQ Pet Tech`,
        description: product.description,
        images: [
          {
            url: product.images[0],
            width: 1200,
            height: 630,
            alt: product.name,
          },
          ...previousImages,
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: product.name,
        description: product.description,
        images: [product.images[0]],
        creator: '@urbaniq',
      },
    };
        } catch (error) {
    console.error('Error generating product metadata:', error);
    return {
      title: 'Product Details | UrbanIQ Pet Tech',
      description: 'Explore our collection of smart pet tech products.',
    };
  }
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  // Properly await params before accessing its properties
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  const product = await fetchProduct(slug);
  
  // If product not found, return 404
  if (!product) {
    notFound();
  }
  
  // Fetch related products
  const relatedProducts = await fetchRelatedProducts(product);
  
  // Generate structured data for product
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "image": product.images.map((img: string) => img),
    "description": product.description,
    "sku": product.id,
    "mpn": product.id,
    "brand": {
      "@type": "Brand",
      "name": "UrbanIQ"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://urbaniq.vercel.app/products/${product.slug}`,
      "priceCurrency": "USD",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
      "itemCondition": "https://schema.org/NewCondition",
      "availability": product.inStock 
        ? "https://schema.org/InStock" 
        : "https://schema.org/OutOfStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": product.reviewCount
    },
    "review": product.reviews?.map((review: Review) => ({
      "@type": "Review",
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": review.rating,
        "bestRating": "5"
      },
      "author": {
        "@type": "Person",
        "name": review.username
      },
      "datePublished": review.date,
      "reviewBody": review.comment
    })) || []
  };

  return (
    <div className="bg-white">
      <Header />
      <Suspense fallback={<div className="h-[50vh] flex items-center justify-center">Loading...</div>}>
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <ProductDetailsClient product={product} relatedProducts={relatedProducts} />
          </Suspense>
      <Footer />
    </div>
  );
} 