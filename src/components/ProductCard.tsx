import { Button } from "./ui/button";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  description: string;
  rating: number;
  reviewCount: number;
  image: string;
  isBestseller?: boolean;
  featured?: boolean;
  slug?: string;
  onAddToCart?: () => void; // Optional callback for adding to cart
}

// Base ProductCard that works in both server and client components
export function ProductCard({ 
  id, 
  name, 
  price, 
  description, 
  rating, 
  reviewCount, 
  image, 
  isBestseller = false,
  featured = false,
  slug,
  onAddToCart
}: ProductCardProps) {
  // Generate a proper URL-friendly slug by removing special characters and spaces
  const generateSlug = (str: string) => {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
      .trim();                  // Trim leading/trailing spaces
  };
  
  // Use slug if provided, otherwise generate it from name
  const productSlug = slug || (name ? generateSlug(name) : id);

  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden group transition-all duration-500 relative flex flex-col h-full border border-gray-100 hover:bg-gray-100/50">
      {/* Product badge - show appropriate badge based on product status */}
      {(isBestseller || featured) && (
        <div className="absolute top-4 left-4 z-10">
          <div className={`text-xs font-medium py-1 px-3 rounded-full shadow-sm ${
            featured ? "bg-black text-white" : "bg-white"
          }`}>
            {featured ? "Featured" : isBestseller ? "Top selling" : ""}
          </div>
        </div>
      )}
      
      {/* Product image */}
      <div className="aspect-square bg-white relative overflow-hidden">
        {image ? (
          <>
            <Image
              src={image}
              alt={name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300">
            No image
          </div>
        )}
      </div>
      
      {/* Product info */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="mb-auto">
          <Link href={`/products/${productSlug}`} className="block">
            <h3 className="font-medium text-base mb-1 transition-colors duration-200 group-hover:text-black/80">{name}</h3>
          </Link>
          
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{description}</p>
        </div>
        
        <div className="mt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-xl">${price.toFixed(2)}</span>
            
            {/* Star rating */}
            <div className="flex items-center text-xs">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="black" stroke="none">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </div>
              <span className="ml-1 text-gray-600">{rating.toFixed(1)} <span className="text-gray-400">({reviewCount})</span></span>
            </div>
          </div>
          
          {/* Add to cart button */}
          <Button 
            className="w-full bg-black hover:bg-black/90 text-white rounded-full py-6 h-10 text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer" 
            onClick={onAddToCart}
          >
            <span className="mr-1">Add to cart</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Create a separate file for the client component to avoid the "use client" directive affecting imports
export { ClientProductCard } from "./ClientProductCard"; 