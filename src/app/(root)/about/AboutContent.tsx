"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';

export default function AboutContent() {
  // Parallax effect for background elements
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  
  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };
  
  // Hero section text animation variants
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.15,
        delayChildren: 0.2,
      }
    }
  };
  
  const heroTextVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      }
    }
  };
  
  const fadeInVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.9,
        ease: "easeOut"
      }
    }
  };

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section id="about-hero" className="bg-[#060a0d] text-white py-6 md:py-12 relative min-h-[500px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[650px] overflow-hidden flex flex-col">
        {/* Particle background overlay */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-[15%] left-[10%] w-48 sm:w-60 h-48 sm:h-60 rounded-full bg-white mix-blend-screen blur-[80px] animate-pulse-slow"></div>
          <div className="absolute bottom-[15%] right-[15%] w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-white mix-blend-screen blur-[100px] animate-pulse-slower"></div>
        </div>
        
        {/* Abstract grid pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Mega background text */}
        <motion.div 
          className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
        >
          <h2 className="text-[10rem] xs:text-[12rem] sm:text-[15rem] md:text-[20rem] lg:text-[25rem] font-bold opacity-[0.02] tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-transparent transform -rotate-6 select-none max-w-full">
            urbaniq
          </h2>
        </motion.div>
        
        {/* Main content - now includes badge */}
        <div className="flex-grow flex flex-col items-center justify-center px-4">
          {/* Badge - now part of the flow */}
          <motion.div 
            className="mb-4 md:mb-6 lg:mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="text-xs md:text-sm px-3 py-1 border border-white/20 rounded-full bg-white/5 backdrop-blur-sm tracking-wide">
              EST. 2025
            </div>
          </motion.div>
          
          <motion.div 
            className="container mx-auto max-w-6xl z-10 flex flex-col items-center text-center"
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Heading with variable font weights and text animation */}
            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-3 sm:mb-4 leading-tight tracking-tight mx-auto max-w-4xl">
              <motion.span 
                className="font-light text-transparent bg-clip-text bg-gradient-to-br from-white to-white/80 inline-block"
                variants={heroTextVariants}
              >
                Revolutionizing
              </motion.span>{" "}
              <motion.span 
                className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-blue-100 inline-block"
                variants={heroTextVariants}
              >
                Pet Care
              </motion.span> 
              <motion.span 
                className="block mt-0 sm:mt-1 font-medium text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300"
                variants={heroTextVariants}
              >
                for Urban Life
              </motion.span>
            </h1>
            
            {/* Subheading with improved typography and animation */}
            <motion.p 
              className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mb-6 md:mb-8 leading-relaxed px-2"
              variants={fadeInVariants}
            >
              We build intelligent pet technology that adapts to the unique challenges of modern urban living
            </motion.p>
            
            {/* Button group with improved styling and animation */}
            <motion.div 
              className="flex flex-wrap gap-3 sm:gap-4 justify-center"
              variants={staggerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delayChildren: 0.9, staggerChildren: 0.15 }}
            >
              <motion.div variants={itemVariants}>
                <Link 
                  href="/products" 
                  className="group inline-flex items-center justify-center py-2.5 pl-6 pr-4 rounded-full bg-white text-black font-medium hover:bg-gray-50 transition-all shadow-sm text-sm sm:text-base"
                >
                  Explore Products <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  href="#cta" 
                  className="group inline-flex items-center justify-center py-2.5 pl-6 pr-4 rounded-full bg-black/10 backdrop-blur-md border border-white/10 text-white font-medium hover:bg-black/20 transition-all text-sm sm:text-base"
                >
                  Learn More <span className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5">→</span>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-16 md:py-24 bg-black text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="font-bold text-3xl md:text-4xl mb-6">Join the UrbanIQ Family</h2>
          <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Experience the future of pet care with our innovative products designed for urban pet owners.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/products" 
              className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-colors"
            >
              Explore Products
            </Link>
            <Link 
              href="/contact" 
              className="px-8 py-3 border border-white text-white font-medium rounded-full hover:bg-white hover:text-black transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Add JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "UrbanIQ Pet Tech",
            "url": "https://urbaniq.vercel.app",
            "logo": "https://urbaniq.vercel.app/logo.png",
            "description": "UrbanIQ creates innovative smart technology solutions designed for modern urban pet owners.",
            "foundingDate": "2025",
            "founders": [
              {
                "@type": "Person",
                "name": "Emily Chen"
              }
            ],
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "123 Innovation Drive",
              "addressLocality": "San Francisco",
              "addressRegion": "CA",
              "postalCode": "94107",
              "addressCountry": "US"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "customer service",
              "telephone": "+1-555-123-4567",
              "email": "support@urbaniq.com"
            },
            "sameAs": [
              "https://www.facebook.com/urbaniqpets",
              "https://www.instagram.com/urbaniq",
              "https://twitter.com/urbaniq",
              "https://www.linkedin.com/company/urbaniq"
            ]
          })
        }}
      />
    </main>
  );
} 