import { Metadata } from 'next';
import { HomeClient } from '@/components/HomeClient';
import slugify from "slugify";

// Define the Product interface to match your API
interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  slug: string;
  images: string[];
  rating?: number;
  reviewCount?: number;
  isBestseller?: boolean;
  featured?: boolean;
  inStock?: boolean;
}

// Generate metadata for better SEO
export const metadata: Metadata = {
  title: 'UrbanIQ - Smart Pet Tech for Modern Pet Parents',
  description: 'Smart pet technology for the modern pet parent. GPS trackers, automated feeders, smart toys, health monitors and more to keep your pets happy, healthy, and safe.',
  keywords: 'pet tech, smart pet devices, pet gadgets, dog tech, cat tech, automated pet feeders, pet GPS trackers, pet health monitors',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://urbaniq.vercel.app/'),
  openGraph: {
    title: 'UrbanIQ - Smart Pet Tech for Modern Pet Parents',
    description: 'Discover innovative smart technology for your pets. From GPS trackers to automated feeders, we help you care for your pets in the smartest way possible.',
    url: '/',
    siteName: 'UrbanIQ',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'UrbanIQ - Smart Pet Technology',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'UrbanIQ - Smart Pet Tech',
    description: 'Smart technology for modern pet parents. Keep your furry friends happy, healthy and safe with our innovative pet gadgets.',
    images: ['/twitter-image.jpg'],
  },
  alternates: {
    canonical: 'https://urbaniq.vercel.app/',
  },
}

// Ensure product has a valid slug using slugify
const ensureProductSlug = (product: Product): Product => {
  // If product has a slug property, use it
  if (product.slug && product.slug.trim().length > 0) {
    return product;
  }
  
  // If no slug, generate one from name using slugify
  if (product.name) {
    return {
      ...product,
      slug: slugify(product.name, { lower: true, strict: true })
    };
  }
  
  // If no name, use ID as fallback
  return {
    ...product,
    slug: product.id
  };
};

// Fetch products from the API - server side
async function fetchProducts(featured?: boolean): Promise<Product[]> {
  try {
    let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    let endpoint = '/api/products';
    
    // Add featured filter if specified
    if (featured) {
      endpoint += '?featured=true&limit=20'; // Ensure we get enough featured products
    } else {
      // Explicitly request more products to ensure we have enough after filtering
      endpoint += '?limit=30';
    }
    
    console.log("Server-side fetching products from:", `${url}${endpoint}`);
    
    const res = await fetch(`${url}${endpoint}`, {
      next: { revalidate: 3600 }, // Revalidate every hour
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const products = await res.json();
    console.log(`Fetched ${products.length} products server-side`);
    
    // Ensure each product has a valid slug
    return products.map(ensureProductSlug);
  } catch (error) {
    console.error('Server error fetching products:', error);
    return []; // Return empty array on error
  }
}

export default async function Home() {
  // Fetch products server-side
  const products = await fetchProducts();
  
  // Get featured products for structured data
  const featuredProducts = products.filter(product => product.featured || product.isBestseller).slice(0, 4);
  
  // Structured data for SEO (JSON-LD)
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "UrbanIQ - Smart Pet Technology",
    "url": "https://urbaniq.vercel.app/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://urbaniq.vercel.app/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "description": "Smart pet technology for modern pet parents. Discover innovative gadgets to help care for your furry friends."
  };
  
  // Add Product schema for featured products
  const productsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": featuredProducts.map((product, index) => ({
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
    <>
      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Add Product structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productsSchema) }}
      />
      
      {/* Render the client component with server-fetched initial data */}
      <HomeClient initialProducts={products} />
    </>
  );
}

