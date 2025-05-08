'use client';

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroCarousel } from "@/components/ui/hero-carousel";
import { ProductCardWrapper } from "@/components/ProductCardWrapper";
import { Quote, ArrowRight, Send } from "lucide-react";
import { NewsletterForm } from "@/components/NewsletterForm";
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from "@/components/ui/skeleton";
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

// Ensure product has a valid slug using slugify
const ensureProductSlug = (product: Product): string => {
  // If product has a slug property, use it
  if (product.slug && product.slug.trim().length > 0) {
    return product.slug;
  }
  
  // If no slug, generate one from name using slugify
  if (product.name) {
    return slugify(product.name, { lower: true, strict: true });
  }
  
  // If no name, use ID as fallback
  return product.id;
};

// Fetch products from the API - client side
const fetchProducts = async (featured?: boolean): Promise<Product[]> => {
  try {
    let url = '/api/products';
    
    // Add featured filter if specified
    if (featured) {
      url += '?featured=true';
    } else {
      // Explicitly request all products with a larger limit
      url += '?limit=20';
    }
    
    console.log("Fetching products from:", url);
    
    const res = await fetch(url, {
      // Add cache: 'no-store' to ensure fresh data
      cache: 'no-store',
      // Add a larger size limit if your API supports it
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch products');
    }
    
    const products = await res.json();
    console.log(`Fetched ${products.length} products from ${url}`);
    
    // Ensure each product has a valid slug
    return products.map((product: Product) => ({
      ...product,
      slug: ensureProductSlug(product)
    }));
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; // Return empty array on error
  }
};

export default function Home() {
  // Add CSS for shimmer effect
  useEffect(() => {
    // Add shimmer effect CSS if it doesn't exist
    if (!document.getElementById('shimmer-style')) {
      const style = document.createElement('style');
      style.id = 'shimmer-style';
      style.innerHTML = `
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .shimmer-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.5) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          animation: shimmer 2s infinite;
          pointer-events: none;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  
  // Simplified product fetching to get more products
  const { data: allProducts = [], isLoading: allProductsLoading, isError: allProductsError } = useQuery<Product[]>({
    queryKey: ['homeProducts', 'all'],
    queryFn: () => fetchProducts(),
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    refetchOnWindowFocus: false,
  });
  
  // Simplified display products logic
  // We will aim to show up to 8 products, prioritizing featured ones first
  const displayProducts = useMemo(() => {
    console.log("Total products fetched:", allProducts.length);
    
    // If no products, return empty array
    if (allProducts.length === 0) {
      return [];
    }
    
    // First get featured and bestsellers
    const priorityProducts = allProducts.filter(p => p.featured || p.isBestseller);
    console.log("Featured/bestseller products:", priorityProducts.length);
    
    // Then get the rest
    const regularProducts = allProducts.filter(p => !p.featured && !p.isBestseller);
    console.log("Regular products:", regularProducts.length);
    
    // Combine them, prioritizing featured/bestsellers
    const combined = [...priorityProducts, ...regularProducts];
    console.log("Total combined products:", combined.length);
    
    // Limit to 8 products
    return combined.slice(0, 8);
  }, [allProducts]);
  
  console.log("Final display products count:", displayProducts.length);

  // Product skeleton for loading state
  const ProductSkeleton = () => (
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
  );

  const heroSlides = [
    {
      title: "Care Beyond the Collar",
      description: "Keep your pet safe, healthy, and engaged — even when you're away.",
      buttonText: "Shop Now",
      image: "/hero-one.png",
      buttonLink: "/products"
    },
    {
      title: "Smart Tech for Smart Pets",
      description: "Innovative solutions designed for modern pet parents.",
      buttonText: "Browse Collection",
      image: "/hero-two.png",
      buttonLink: "/products/category/camera"
    },
    {
      title: "Travel With Confidence",
      description: "Premium carriers and accessories for adventures together.",
      buttonText: "Discover More",
      image: "/hero-three.png",
      buttonLink: "/products/category/collar"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Carousel Section */}
        <HeroCarousel slides={heroSlides} />

        {/* Products Section */}
        <section className="py-16 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
              These Are My All-Time Faves
          </h2>
            <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
              Trust me, I have great taste. These smart pet gadgets will transform how you care for your furry friend.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {allProductsLoading ? (
                // Show 8 loading skeletons
                Array.from({ length: 8 }).map((_, index) => (
                  <div key={index} className="relative overflow-hidden">
                    <ProductSkeleton />
                    <div className="shimmer-effect"></div>
                  </div>
                ))
              ) : allProductsError ? (
                // Show error state
                <div className="col-span-4 text-center py-10">
                  <p className="text-gray-500">Failed to load products. Please try again later!</p>
                </div>
              ) : displayProducts.length > 0 ? (
                // Show exactly 8 products or fewer if that's all we have
                displayProducts.map((product) => (
                  <ProductCardWrapper 
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    description={product.description || ""}
                    rating={product.rating || 4.5}
                    reviewCount={product.reviewCount || 0}
                    image={product.images?.[0] || "/placeholder.svg"}
                    isBestseller={product.isBestseller}
                    featured={product.featured}
                    slug={ensureProductSlug(product)}
                  />
                ))
              ) : (
                <div className="col-span-4 text-center py-10">
                  <p className="text-gray-500">No products available at the moment. Please check back later!</p>
                </div>
              )}
            </div>
            
            {displayProducts.length > 0 && (
              <div className="text-center mt-12">
                <Link href="/products">
                  <div className="group inline-flex items-center justify-center py-2.5 pl-6 pr-4 rounded-full bg-white text-black border border-gray-200 hover:bg-gray-50 transition-all font-medium text-sm">
                    <span className="mr-2">View all products</span>
                    <div className="bg-black rounded-full p-1.5 flex items-center justify-center">
                      <div className="w-[14px] h-[14px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            Lots of tail wags, happy meows & 5-star<br />barks.
          </h2>
            <p className="text-gray-500 text-center mb-16 max-w-xl mx-auto">
              See what our pet parents are saying about our smart products.
            </p>
            
            {/* Modern Minimal Testimonial Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Testimonial 1 */}
              <div className="bg-gray-50 rounded-xl overflow-hidden group flex flex-col h-full transform transition-all duration-300 hover:translate-y-[-8px]">
                <div className="p-7 flex flex-col flex-grow">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Alex" className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Alex W.</p>
                          <p className="text-xs text-gray-500">Chicago, IL</p>
                        </div>
                      </div>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#000000" stroke="none" className="mr-0.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative mb-6">
                    <p className="text-gray-800 leading-relaxed text-[15px] font-light relative z-10">
                      "I didn't think a feeder could actually change our routine — but this one did. My dog now eats on time, even when I'm stuck in meetings. Game-changer!"
                    </p>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <p className="text-xs uppercase tracking-wider font-medium">Smart Pet Feeder</p>
                    <p className="text-xs text-gray-400">Posted 2 weeks ago</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 2 */}
              <div className="bg-gray-50 rounded-xl overflow-hidden group flex flex-col h-full transform transition-all duration-300 hover:translate-y-[-8px]">
                <div className="p-7 flex flex-col flex-grow">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sarah" className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Sarah J.</p>
                          <p className="text-xs text-gray-500">Austin, TX</p>
                        </div>
                      </div>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#000000" stroke="none" className="mr-0.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative mb-6">
                    <p className="text-gray-800 leading-relaxed text-[15px] font-light relative z-10">
                      "My cat was skeptical at first, but now she loves her Smart Collar. The activity tracking helped us realize she needed more playtime, and now she's happier than ever!"
                    </p>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <p className="text-xs uppercase tracking-wider font-medium">GPS Smart Collar</p>
                    <p className="text-xs text-gray-400">Posted 5 days ago</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 3 */}
              <div className="bg-gray-50 rounded-xl overflow-hidden group flex flex-col h-full transform transition-all duration-300 hover:translate-y-[-8px]">
                <div className="p-7 flex flex-col flex-grow">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img src="https://randomuser.me/api/portraits/men/68.jpg" alt="Miguel" className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Miguel R.</p>
                          <p className="text-xs text-gray-500">Miami, FL</p>
                        </div>
                      </div>
                      <div className="flex">
                  {Array(5).fill(0).map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#000000" stroke="none" className="mr-0.5">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative mb-6">
                    <p className="text-gray-800 leading-relaxed text-[15px] font-light relative z-10">
                      "The PetCam has brought so much joy to our family. Being able to check on our dogs while at work and even dispense treats remotely has been amazing. Worth every penny!"
                    </p>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <p className="text-xs uppercase tracking-wider font-medium">HD Pet Camera</p>
                    <p className="text-xs text-gray-400">Posted 1 month ago</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 4 */}
              <div className="bg-gray-50 rounded-xl overflow-hidden group flex flex-col h-full transform transition-all duration-300 hover:translate-y-[-8px]">
                <div className="p-7 flex flex-col flex-grow">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img src="https://randomuser.me/api/portraits/women/62.jpg" alt="Taylor" className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Taylor K.</p>
                          <p className="text-xs text-gray-500">Portland, OR</p>
                        </div>
                      </div>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#000000" stroke="none" className="mr-0.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative mb-6">
                    <p className="text-gray-800 leading-relaxed text-[15px] font-light relative z-10">
                      "As a first-time pet parent, the Smart Health Monitor gave me peace of mind. It alerted me when my puppy wasn't drinking enough water, which turned out to be an early sign of illness. Literally a lifesaver!"
                    </p>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <p className="text-xs uppercase tracking-wider font-medium">Smart Health Monitor</p>
                    <p className="text-xs text-gray-400">Posted 3 weeks ago</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 5 */}
              <div className="bg-gray-50 rounded-xl overflow-hidden group flex flex-col h-full transform transition-all duration-300 hover:translate-y-[-8px]">
                <div className="p-7 flex flex-col flex-grow">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img src="https://randomuser.me/api/portraits/women/28.jpg" alt="Priya" className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">Priya N.</p>
                          <p className="text-xs text-gray-500">Seattle, WA</p>
                        </div>
                      </div>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#000000" stroke="none" className="mr-0.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative mb-6">
                    <p className="text-gray-800 leading-relaxed text-[15px] font-light relative z-10">
                      "The app integration with all my pet devices is seamless! Having everything in one place makes pet care so much easier. Their customer service is also top-notch when I had questions."
                    </p>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <p className="text-xs uppercase tracking-wider font-medium">Smart Home App</p>
                    <p className="text-xs text-gray-400">Posted 2 days ago</p>
                  </div>
                </div>
              </div>
              
              {/* Testimonial 6 */}
              <div className="bg-gray-50 rounded-xl overflow-hidden group flex flex-col h-full transform transition-all duration-300 hover:translate-y-[-8px]">
                <div className="p-7 flex flex-col flex-grow">
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                          <img src="https://randomuser.me/api/portraits/men/76.jpg" alt="James" className="w-full h-full object-cover" />
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium">James L.</p>
                          <p className="text-xs text-gray-500">Denver, CO</p>
                        </div>
                      </div>
                      <div className="flex">
                        {Array(5).fill(0).map((_, i) => (
                          <svg key={i} xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="#000000" stroke="none" className="mr-0.5">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="relative mb-6">
                    <p className="text-gray-800 leading-relaxed text-[15px] font-light relative z-10">
                      "Our senior cat has a new lease on life thanks to the Interactive Toy. It keeps her active and engaged even when we're not home. Seeing her play like a kitten again is priceless!"
                    </p>
                  </div>
                  <div className="mt-auto flex justify-between items-center">
                    <p className="text-xs uppercase tracking-wider font-medium">Interactive Toy Ball</p>
                    <p className="text-xs text-gray-400">Posted 1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 px-6 text-center bg-black text-white">
          <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Come on, hooman—treat yourself (and<br />me) to smart goodies today.
          </h2>
            <p className="text-sm md:text-base mb-8 max-w-2xl mx-auto">Save 10% OFF your first order + Free Shipping on orders shipping—code: Tail-5-4-treats</p>
            <div className="inline-block">
              <Link href="/products">
                <Button className="bg-white text-black rounded-full pl-8 pr-14 py-4 text-base hover:bg-gray-100 relative group cursor-pointer">
                  Shop All Pets
                  <div className="absolute right-3 bg-black rounded-full w-8 h-8 flex items-center justify-center">
                    <ArrowRight 
                      size={16}
                      className="text-white transform transition-transform duration-300 group-hover:-rotate-45"
                    />
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="py-12 px-6 text-center bg-gray-50">
          <div className="max-w-lg mx-auto">
            <h2 className="text-lg md:text-xl font-bold mb-2">
            Stay in the loop on new arrivals & deals
          </h2>
          <p className="text-sm text-gray-500 mb-6">We never spam. Unpawlievable promise.</p>
            
            <NewsletterForm />
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

