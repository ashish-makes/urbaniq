"use client"

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, PawPrint, ShieldCheck, Users, Package } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@/components/ui/carousel";

interface HeroSlide {
  title: string;
  description: string;
  buttonText: string;
  image: string;
  buttonLink?: string;
}

interface HeroCarouselProps {
  slides: HeroSlide[];
}

export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [progressWidth, setProgressWidth] = React.useState(0);
  const progressInterval = React.useRef<NodeJS.Timeout | null>(null);
  
  // Create autoplay plugin reference
  const plugin = React.useRef(
    Autoplay({
      delay: 5000,
    })
  );

  // Update current index when carousel changes
  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
      // Reset progress bar when slide changes
      setProgressWidth(0);
    };

    api.on("select", onSelect);
    
    // Initial selection
    setCurrent(api.selectedScrollSnap());

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  // Progress bar animation
  React.useEffect(() => {
    // Clear any existing interval
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
    
    // Start new interval for progress animation
    setProgressWidth(0);
    const startTime = Date.now();
    const duration = 5000; // match with autoplay delay
    
    progressInterval.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration * 100, 100);
      setProgressWidth(progress);
      
      if (progress >= 100) {
        clearInterval(progressInterval.current!);
      }
    }, 16); // ~60fps
    
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [current]);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);
  
  // Stats data
  const stats = [
    {
      icon: <PawPrint className="h-6 w-6 text-black" />,
      value: "10,000+",
      label: "Happy Pets",
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-black" />,
      value: "100%",
      label: "Satisfaction Guarantee",
    },
    {
      icon: <Users className="h-6 w-6 text-black" />,
      value: "50,000+",
      label: "Loyal Customers",
    },
    {
      icon: <Package className="h-6 w-6 text-black" />,
      value: "24/7",
      label: "Customer Support",
    },
  ];

  return (
    <>
      <style jsx global>{`
        /* Remove any gap between carousel items */
        .embla__container {
          backface-visibility: hidden;
          margin: 0 !important;
          padding: 0 !important;
          gap: 0 !important;
        }
        .embla__slide {
          flex: 0 0 100% !important;
          padding: 0 !important;
          margin: 0 !important;
          min-width: 0 !important;
        }
      `}</style>
      <section className="relative overflow-hidden">
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          className="w-full"
          opts={{
            loop: true,
            skipSnaps: false,
            align: "start",
            dragFree: false,
            containScroll: false,
          }}
        >
          <CarouselContent className="h-[80vh]">
            {slides.map((slide, index) => (
              <CarouselItem key={index} className="h-full overflow-hidden p-0 m-0">
                <div className="relative w-full h-full flex items-center">
                  {/* Background Image without zoom effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <div className="relative w-full h-full">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        className="object-cover"
                        priority={index === 0}
                        sizes="100vw"
                      />
                      <div className="absolute inset-0 bg-black/30"></div>
                    </div>
                  </div>
                  
                  {/* Content without animations */}
                  {current === index && (
                    <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
                      <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                        {slide.title}
                      </h1>
                      <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-white">
                        {slide.description}
                      </p>
                      <div>
                        <Link href={slide.buttonLink || "/products"}>
                          <div className="group inline-flex items-center justify-center py-1.5 pl-3 pr-2 rounded-full bg-white text-black hover:bg-white/90 transition-all font-bricolage text-sm">
                            <span className="mr-1.5">{slide.buttonText}</span>
                            <div className="bg-black rounded-full p-1 flex items-center justify-center">
                              <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                                <ArrowRight size={12} stroke="white" strokeWidth={2} />
                              </div>
                            </div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          {/* Navigation buttons positioned at the middle of left and right edges */}
          {/* Removed navigation buttons as requested */}
          
          {/* Pagination Dots */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-2 z-20">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  current === index 
                    ? "bg-white scale-110" 
                    : "bg-white/40 hover:bg-white/60"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          
          {/* Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 z-20 h-1 bg-white/10">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progressWidth}%` }}
            />
          </div>
        </Carousel>
      </section>
      
      {/* Stats Section - Modern Minimal Design */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="mb-4 bg-gray-50 rounded-full p-4">
                  {stat.icon}
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
} 