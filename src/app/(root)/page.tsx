import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { HeroCarousel } from "@/components/ui/hero-carousel";
import { ProductCard } from "@/components/ProductCard";
import { Quote, ArrowRight, Send } from "lucide-react";

export default function Home() {
  const heroSlides = [
    {
      title: "Care Beyond the Collar",
      description: "Keep your pet safe, healthy, and engaged — even when you're away.",
      buttonText: "Shop Now",
      image: "/hero-one.png"
    },
    {
      title: "Smart Tech for Smart Pets",
      description: "Innovative solutions designed for modern pet parents.",
      buttonText: "Browse Collection",
      image: "/hero-two.png"
    },
    {
      title: "Travel With Confidence",
      description: "Premium carriers and accessories for adventures together.",
      buttonText: "Discover More",
      image: "/hero-three.png"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Carousel Section */}
        <HeroCarousel slides={heroSlides} />

        {/* Categories Section - Improved Bento Grid */}
        {/*
        <section className="py-16 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
            Paws down, this is the smartest stuff<br />I've ever sniffed out.
          </h2>
          <p className="text-gray-500 text-center mb-10 max-w-xl mx-auto">
            Smart gadgets for modern pet parents who want the best for their furry friends. 
            Tech that makes pet care easier, safer, and more fun.
          </p>
          
          <div className="grid grid-cols-12 grid-rows-[auto_auto_auto] gap-3 md:gap-4 max-w-7xl mx-auto">
            <div className="col-span-12 md:col-span-6 row-span-2 group relative overflow-hidden rounded-xl bg-white h-auto min-h-[26rem] border border-gray-100 transition-all duration-200 hover:border-gray-200">
              <div className="absolute inset-0">
                <img src="/pet-feeder.png" alt="Pet Feeders" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <Link href="/smart-home/feeders" className="absolute inset-0 z-20">
                <span className="sr-only">Feeders</span>
              </Link>
              <div className="absolute z-10 bottom-8 left-8">
                <span className="inline-block text-xs uppercase font-medium bg-white text-black px-2 py-0.5 rounded-full mb-3">Featured</span>
                <h3 className="text-2xl font-medium text-white mb-2">Smart Feeders</h3>
                <p className="text-white/90 text-sm mb-4 max-w-md leading-relaxed">Never miss a mealtime with automated feeding and portion control</p>
                <Link href="/smart-home/feeders" className="inline-flex items-center bg-white/20 backdrop-blur-md border border-white/30 px-4 py-2 rounded-full transition-colors duration-200 text-sm text-white">
                  <span>Shop Smart Feeders</span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="ml-2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className="col-span-12 md:col-span-6 group relative overflow-hidden rounded-xl bg-white h-64 border border-gray-100 transition-all duration-200 hover:border-gray-200">
              <div className="absolute inset-0">
                <img src="/pet-carrier.png" alt="Pet Carriers" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <Link href="/cats/carriers" className="absolute inset-0 z-20">
                <span className="sr-only">Pet Carriers</span>
              </Link>
              <div className="absolute z-10 bottom-6 left-6">
                <h3 className="text-xl font-medium text-white mb-1">Pet Carriers</h3>
                <div className="flex items-center space-x-1">
                  <Link href="/cats/carriers" className="text-white text-sm bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full">Browse Collection</Link>
                </div>
              </div>
            </div>

            <div className="col-span-6 md:col-span-3 group relative overflow-hidden rounded-xl bg-white h-64 border border-gray-100 transition-all duration-200 hover:border-gray-200">
              <div className="absolute inset-0">
                <img src="/pet-camera.png" alt="Pet Cameras" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <Link href="/smart-home/cameras" className="absolute inset-0 z-20">
                <span className="sr-only">Pet Cameras</span>
              </Link>
              <div className="absolute z-10 bottom-6 left-6">
                <h3 className="text-xl font-medium text-white mb-1">Cameras</h3>
                <div className="flex items-center space-x-1">
                  <Link href="/smart-home/cameras" className="text-white text-sm bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full">Explore</Link>
                </div>
              </div>
            </div>

            <div className="col-span-6 md:col-span-3 group relative overflow-hidden rounded-xl bg-white h-64 border border-gray-100 transition-all duration-200 hover:border-gray-200">
              <div className="absolute inset-0">
                <img src="/hero-one.png" alt="Self-Cleaning Litter Box" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <Link href="/cats/litter-boxes" className="absolute inset-0 z-20">
                <span className="sr-only">Self-Cleaning Litter Box</span>
              </Link>
              <div className="absolute z-10 bottom-6 left-6">
                <span className="inline-block text-xs uppercase font-medium bg-white text-black px-2 py-0.5 rounded-full mb-2">New</span>
                <h3 className="text-xl font-medium text-white mb-1">Litter Boxes</h3>
                <div className="flex items-center space-x-1">
                  <Link href="/cats/litter-boxes" className="text-white text-sm bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full">Shop Now</Link>
                </div>
              </div>
            </div>

            <div className="col-span-12 md:col-span-4 group relative overflow-hidden rounded-xl bg-white h-64 border border-gray-100 transition-all duration-200 hover:border-gray-200">
              <div className="absolute inset-0">
                <img src="/pet-toys.png" alt="Pet Toys" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <Link href="/dogs/toys" className="absolute inset-0 z-20">
                <span className="sr-only">Pet Toys</span>
              </Link>
              <div className="absolute z-10 bottom-6 left-6">
                <h3 className="text-xl font-medium text-white mb-1">Interactive Toys</h3>
                <div className="flex items-center space-x-1">
                  <Link href="/dogs/toys" className="text-white text-sm bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full">Discover</Link>
                </div>
              </div>
            </div>
            
            <div className="col-span-12 md:col-span-8 group relative overflow-hidden rounded-xl bg-white h-64 border border-gray-100 transition-all duration-200 hover:border-gray-200">
              <div className="absolute inset-0">
                <img src="/hero-three.png" alt="Smart Pet Beds" className="h-full w-full object-cover" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <Link href="/beds" className="absolute inset-0 z-20">
                <span className="sr-only">Pet Beds</span>
              </Link>
              <div className="absolute z-10 bottom-6 left-6">
                <h3 className="text-xl font-medium text-white mb-1">Smart Pet Beds</h3>
                <p className="text-white/90 text-sm mb-3 max-w-md leading-relaxed">Temperature-controlled comfort for better sleep</p>
                <Link href="/beds" className="text-white text-sm bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full">Shop Collection</Link>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Link href="/categories">
              <div className="group inline-flex items-center justify-center py-2 pl-6 pr-4 rounded-full bg-white text-black border border-gray-200 hover:bg-gray-50 transition-all font-medium text-sm">
                <span className="mr-2">View all categories</span>
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
        </section>
        */}

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
              <ProductCard 
                id="smart-feeder-1"
                name="Smart Pet Feeder"
                price={129.99}
                description="Automated feeding with app control and portion management for your pet's diet"
                rating={4.7}
                reviewCount={120}
                image="/pet-feeder.png"
                isBestseller={true}
              />
              <ProductCard 
                id="pet-camera-1"
                name="HD Pet Camera"
                price={89.99}
                description="Monitor your pet with two-way audio and treat dispenser for remote interaction"
                rating={4.5}
                reviewCount={84}
                image="/pet-camera.png"
                isBestseller={true}
              />
              <ProductCard 
                id="smart-collar-1"
                name="GPS Smart Collar"
                price={79.99}
                description="Track location and activity with real-time notifications and health monitoring"
                rating={4.3}
                reviewCount={56}
                image="/hero-one.png"
              />
              <ProductCard 
                id="auto-toy-1"
                name="Interactive Toy Ball"
                price={39.99}
                description="Keeps pets entertained for hours with automated movement and light patterns"
                rating={4.8}
                reviewCount={92}
                image="/pet-toys.png"
              />
              <ProductCard 
                id="smart-water-1"
                name="Smart Water Fountain"
                price={59.99}
                description="Fresh filtered water on demand with flow monitoring and cleanliness alerts"
                rating={4.6}
                reviewCount={73}
                image="/hero-two.png"
              />
              <ProductCard 
                id="carrier-premium-1"
                name="Premium Pet Carrier"
                price={149.99}
                description="Comfortable travel with smart features including climate control and anxiety reduction"
                rating={4.9}
                reviewCount={38}
                image="/pet-carrier.png"
                isBestseller={true}
              />
              <ProductCard 
                id="smart-bed-1"
                name="Temperature Control Pet Bed"
                price={199.99}
                description="Self-heating and cooling bed that adjusts to your pet's body temperature for optimal comfort"
                rating={4.8}
                reviewCount={45}
                image="/hero-three.png"
              />
              <ProductCard 
                id="auto-litter-1"
                name="Self-Cleaning Litter Box"
                price={249.99}
                description="Automated waste removal and odor control with health monitoring system"
                rating={4.7}
                reviewCount={67}
                image="/pet-camera.png"
                isBestseller={true}
              />
            </div>
            
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
              <Button className="bg-white text-black rounded-full pl-8 pr-14 py-4 text-base hover:bg-gray-100 relative group cursor-pointer">
                Shop All Pets
                <div className="absolute right-3 bg-black rounded-full w-8 h-8 flex items-center justify-center">
                  <ArrowRight 
                    size={16}
                    className="text-white transform transition-transform duration-300 group-hover:-rotate-45"
                  />
                </div>
              </Button>
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
            
            <div className="relative max-w-sm mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="w-full py-2.5 pl-4 pr-10 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
              />
              <button className="absolute right-1 top-1/2 -translate-y-1/2 bg-black text-white p-1.5 rounded-full hover:bg-black/90 transition-all cursor-pointer">
                <Send size={14} className="text-white" />
              </button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}

