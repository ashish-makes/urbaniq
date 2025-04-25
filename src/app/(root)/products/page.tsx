'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Filter, Grid3x3, List, SlidersHorizontal } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Product categories for filters
const categories = [
  { id: 'all', name: 'All Products' },
  { id: 'feeder', name: 'Smart Feeders' },
  { id: 'camera', name: 'Pet Cameras' },
  { id: 'collar', name: 'Smart Collars' },
  { id: 'toy', name: 'Interactive Toys' },
  { id: 'water', name: 'Water Fountains' },
  { id: 'carrier', name: 'Pet Carriers' },
  { id: 'bed', name: 'Smart Beds' },
  { id: 'litter', name: 'Litter Boxes' },
];

// Sample products data
const productsData = [
  {
    id: 'smart-feeder-1',
    name: 'Smart Pet Feeder',
    price: 129.99,
    description: 'Automated feeding with app control. Schedule meals and monitor your pet\'s food intake from anywhere.',
    rating: 4.7,
    reviewCount: 120,
    image: '/pet-feeder.png',
    isBestseller: true,
    category: 'feeder',
  },
  {
    id: 'pet-camera-1',
    name: 'HD Pet Camera',
    price: 89.99,
    description: 'Monitor your pet with two-way audio. Check in anytime and talk to your pet when you\'re away.',
    rating: 4.5,
    reviewCount: 84,
    image: '/pet-camera.png',
    isBestseller: true,
    category: 'camera',
  },
  {
    id: 'smart-collar-1',
    name: 'GPS Smart Collar',
    price: 79.99,
    description: 'Track location and activity with notifications. Get alerts when your pet leaves designated safe zones.',
    rating: 4.3,
    reviewCount: 56,
    image: '/hero-one.png',
    category: 'collar',
  },
  {
    id: 'auto-toy-1',
    name: 'Interactive Toy Ball',
    price: 39.99,
    description: 'Keeps pets entertained for hours. Features motion sensors and unpredictable movements to engage your pet.',
    rating: 4.8,
    reviewCount: 92,
    image: '/pet-toys.png',
    category: 'toy',
  },
  {
    id: 'smart-water-1',
    name: 'Smart Water Fountain',
    price: 59.99,
    description: 'Fresh filtered water on demand. Encourages hydration and monitors your pet\'s drinking habits.',
    rating: 4.6,
    reviewCount: 73,
    image: '/hero-two.png',
    category: 'water',
  },
  {
    id: 'carrier-premium-1',
    name: 'Premium Pet Carrier',
    price: 149.99,
    description: 'Comfortable travel with smart features. Includes climate control and anxiety reduction technology.',
    rating: 4.9,
    reviewCount: 38,
    image: '/pet-carrier.png',
    isBestseller: true,
    category: 'carrier',
  },
  {
    id: 'smart-bed-1',
    name: 'Temperature Control Pet Bed',
    price: 199.99,
    description: 'Self-heating and cooling bed for comfort. Adjusts to your pet\'s body temperature automatically.',
    rating: 4.8,
    reviewCount: 45,
    image: '/hero-three.png',
    category: 'bed',
  },
  {
    id: 'auto-litter-1',
    name: 'Self-Cleaning Litter Box',
    price: 249.99,
    description: 'Automated waste removal and odor control. Monitors usage patterns and health indicators.',
    rating: 4.7,
    reviewCount: 67,
    image: '/pet-camera.png',
    isBestseller: true,
    category: 'litter',
  },
];

export default function ProductsPage() {
  const [products, setProducts] = useState(productsData);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isGridView, setIsGridView] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOption, setSortOption] = useState('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [minPrice, setMinPrice] = useState(199);
  const [maxPrice, setMaxPrice] = useState(799);

  // Featured products - now using all products instead of just bestsellers
  const carouselProducts = products;

  // Filter and sort products
  const filteredProducts = products
    .filter(product => selectedCategory === 'all' || product.category === selectedCategory)
    .sort((a, b) => {
      switch (sortOption) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return 0; // In a real app, would compare dates
        default: // featured
          return (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0);
      }
    });

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <Header />
      
      <main>
        {/* Hero section with featured products carousel */}
        <section className="py-10 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Paws Down, My Faves Right Now!</h2>
            
            <div className="relative py-4">
              <Carousel
                opts={{
                  align: "start",
                  slidesToScroll: 1
                }}
                className="w-full"
              >
                <CarouselContent className="h-full">
                  {products.map((product) => (
                    <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 h-full">
                      <div className="p-1 h-full">
                        <ProductCard {...product} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 bg-black border-black hover:bg-black/80 text-white hover:text-white transition-all duration-200" />
                <CarouselNext className="right-0 bg-black border-black hover:bg-black/80 text-white hover:text-white transition-all duration-200" />
              </Carousel>
            </div>
          </div>
        </section>

        {/* Top Selling Products Section */}
        <section className="pt-2 pb-10 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Everyone's Sniffing These Out!</h2>
            
            <div className="relative py-4">
              <Carousel
                opts={{
                  align: "start",
                  slidesToScroll: 1
                }}
                className="w-full"
              >
                <CarouselContent className="h-full">
                  {products.map((product) => (
                    <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4 h-full">
                      <div className="p-1 h-full">
                        <ProductCard {...product} />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-0 bg-black border-black hover:bg-black/80 text-white hover:text-white transition-all duration-200" />
                <CarouselNext className="right-0 bg-black border-black hover:bg-black/80 text-white hover:text-white transition-all duration-200" />
              </Carousel>
            </div>
            
            {/* Category filter buttons */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              <a href="/products?category=new" className="px-5 py-2 rounded-full border border-gray-300 font-medium text-sm hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                New arrivals
              </a>
              <a href="/products?category=deals" className="px-5 py-2 rounded-full border border-gray-300 font-medium text-sm hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                Deals
              </a>
              <a href="/products?category=recommended" className="px-5 py-2 rounded-full border border-gray-300 font-medium text-sm hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                Recommended
              </a>
              <a href="/products?category=essentials" className="px-5 py-2 rounded-full border border-gray-300 font-medium text-sm hover:bg-black hover:text-white hover:border-black transition-all duration-200">
                Essentials
              </a>
            </div>
          </div>
        </section>

        {/* Search refinement and product listing section */}
        <section className="pt-6 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row gap-8">
              {/* Left sidebar with filters */}
              <div className="w-full md:w-72 shrink-0">
                <div className="sticky top-4">
                  <h2 className="text-2xl font-bold mb-6">Refine your search</h2>
                  
                  <Accordion type="multiple" defaultValue={["category", "price"]} className="w-full">
                    {/* Category filter */}
                    <AccordionItem value="category" className="border-none">
                      <AccordionTrigger className="py-2 px-0 hover:no-underline font-medium text-lg">
                        Category
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex flex-wrap gap-2">
                          <button 
                            className="px-3 py-1.5 rounded-full bg-black text-white text-sm font-medium"
                            onClick={() => setSelectedCategory('all')}
                          >
                            All pets
                          </button>
                          <button 
                            className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"
                            onClick={() => setSelectedCategory('dog')}
                          >
                            Dog
                          </button>
                          <button 
                            className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"
                            onClick={() => setSelectedCategory('cat')}
                          >
                            Cats
                          </button>
                          <button 
                            className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"
                            onClick={() => setSelectedCategory('toy')}
                          >
                            Toys
                          </button>
                          <button 
                            className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"
                            onClick={() => setSelectedCategory('treat')}
                          >
                            Treats
                          </button>
                          <button 
                            className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"
                            onClick={() => setSelectedCategory('bed')}
                          >
                            Bed & Comfort
                          </button>
                          <button 
                            className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"
                            onClick={() => setSelectedCategory('accessory')}
                          >
                            Accessories
                          </button>
                          <button 
                            className="px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-sm font-medium transition-colors"
                            onClick={() => setSelectedCategory('grooming')}
                          >
                            Grooming
                          </button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Price filter */}
                    <AccordionItem value="price" className="border-none">
                      <AccordionTrigger className="py-2 px-0 hover:no-underline font-medium text-lg">
                        Price
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-sm text-gray-500">$199 - $799</span>
                        </div>
                        
                        <div className="relative mb-6 pt-4">
                          <div className="h-1 bg-gray-200 rounded-full">
                            <div className="absolute h-1 bg-black rounded-full left-0 right-[50%]"></div>
                          </div>
                          
                          <div className="absolute left-0 top-0 h-4 w-4 rounded-full bg-black border-2 border-white -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"></div>
                          
                          <div className="absolute right-[50%] top-0 h-4 w-4 rounded-full bg-black border-2 border-white -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"></div>
                        </div>
                        
                        <div className="flex gap-4 mb-6">
                          <div className="flex-1">
                            <label htmlFor="min-price" className="text-xs text-gray-500 mb-1 block">Min</label>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                              <input 
                                type="number" 
                                id="min-price"
                                value={minPrice}
                                onChange={(e) => setMinPrice(Number(e.target.value))}
                                className="w-full bg-gray-50 border border-gray-200 rounded px-6 py-2 text-sm"
                              />
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <label htmlFor="max-price" className="text-xs text-gray-500 mb-1 block">Max</label>
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400">$</span>
                              <input 
                                type="number" 
                                id="max-price"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(Number(e.target.value))}
                                className="w-full bg-gray-50 border border-gray-200 rounded px-6 py-2 text-sm"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <button className="w-full bg-black text-white py-2.5 rounded-full font-medium text-sm transition-opacity hover:opacity-90">
                          Apply Filter
                        </button>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Rating filter */}
                    <AccordionItem value="rating" className="border-none">
                      <AccordionTrigger className="py-2 px-0 hover:no-underline font-medium text-lg">
                        Rating
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2">
                          <button className="flex items-center w-full py-1.5 hover:bg-gray-50 rounded transition-colors">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black" stroke="none" className="mr-1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black" stroke="none" className="mr-1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black" stroke="none" className="mr-1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black" stroke="none" className="mr-1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black" stroke="none" className="mr-1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            </div>
                            <span className="ml-2 text-sm">5 stars</span>
                          </button>
                          
                          <button className="flex items-center w-full py-1.5 hover:bg-gray-50 rounded transition-colors">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black" stroke="none" className="mr-1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black" stroke="none" className="mr-1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black" stroke="none" className="mr-1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black" stroke="none" className="mr-1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="gray" stroke="none" className="mr-1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            </div>
                            <span className="ml-2 text-sm">4 stars & up</span>
                          </button>
                          
                          <button className="flex items-center w-full py-1.5 hover:bg-gray-50 rounded transition-colors">
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black" stroke="none" className="mr-1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black" stroke="none" className="mr-1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black" stroke="none" className="mr-1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="gray" stroke="none" className="mr-1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="gray" stroke="none" className="mr-1">
                                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                              </svg>
                            </div>
                            <span className="ml-2 text-sm">3 stars & up</span>
                          </button>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                    
                    {/* Availability filter */}
                    <AccordionItem value="availability" className="border-none">
                      <AccordionTrigger className="py-2 px-0 hover:no-underline font-medium text-lg">
                        Availability
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3">
                          <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black h-4 w-4" />
                            <span className="ml-2 text-sm">In stock</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black h-4 w-4" />
                            <span className="ml-2 text-sm">On sale</span>
                          </label>
                          <label className="flex items-center cursor-pointer">
                            <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black h-4 w-4" />
                            <span className="ml-2 text-sm">Free shipping</span>
                          </label>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <button className="w-full border border-gray-300 text-gray-700 py-2.5 rounded-full font-medium text-sm mt-4 hover:bg-gray-50 transition-colors">
                    Reset Filters
                  </button>
                </div>
              </div>
              
              {/* Right side product listings */}
              <div className="flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {/* Use ProductCard component for each product */}
                  {productsData.slice(0, 8).map((product) => (
                    <div key={product.id} className="transition-all duration-300">
                          <ProductCard {...product} />
                      </div>
                    ))}
                  </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
} 