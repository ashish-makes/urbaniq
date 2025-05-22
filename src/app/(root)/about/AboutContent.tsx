"use client";

import Image from 'next/image';
import Link from 'next/link';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { Lightbulb, PawPrint, Leaf, Instagram, Linkedin, ArrowRight } from 'lucide-react';

// Twitter X SVG icon component
const TwitterX = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-twitter-x" viewBox="0 0 16 16">
    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
  </svg>
);

export default function AboutContent() {
  // Parallax effect for background elements
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  
  // Video loading states
  const [heroVideoLoaded, setHeroVideoLoaded] = useState(false);
  const [missionVideoLoaded, setMissionVideoLoaded] = useState(false);
  
  // Video references
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  const missionVideoRef = useRef<HTMLVideoElement>(null);
  
  // Animation references for scroll triggered animations
  const missionRef = useRef<HTMLDivElement>(null);
  const valuesRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // Track when sections are in view
  const missionInView = useInView(missionRef, { once: true, amount: 0.3 });
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.3 });
  const teamInView = useInView(teamRef, { once: true, amount: 0.3 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  // Handle video loading
  useEffect(() => {
    // Hero video loading
    if (heroVideoRef.current) {
      if (heroVideoRef.current.readyState >= 3) {
        setHeroVideoLoaded(true);
      } else {
        heroVideoRef.current.addEventListener('canplay', () => {
          setHeroVideoLoaded(true);
        });
      }
    }
    
    // Mission video loading - only start loading when it comes into view
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && missionVideoRef.current) {
          missionVideoRef.current.src = '/mission.mp4';
          missionVideoRef.current.addEventListener('canplay', () => {
            setMissionVideoLoaded(true);
          });
          observer.disconnect();
        }
      });
    }, { threshold: 0.1 });
    
    if (missionVideoRef.current) {
      observer.observe(missionVideoRef.current);
    }
    
    return () => {
      observer.disconnect();
      if (heroVideoRef.current) {
        heroVideoRef.current.removeEventListener('canplay', () => setHeroVideoLoaded(true));
      }
      if (missionVideoRef.current) {
        missionVideoRef.current.removeEventListener('canplay', () => setMissionVideoLoaded(true));
      }
    };
  }, []);

  // Animation variants
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
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut"
      }
    })
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
      <section id="about-hero" className="relative h-screen w-full overflow-hidden">
        {/* Background placeholder image */}
        <div className="absolute inset-0 w-full h-full bg-black">
          <Image 
            src="/hero-placeholder.jpg" 
            alt="Hero background" 
            fill 
            className="object-cover opacity-80"
            priority
          />
        </div>
        
        {/* Background video */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: heroVideoLoaded ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full z-0"
        >
          <video 
            ref={heroVideoRef}
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/hero-poster.jpg"
            onError={() => console.error("Error loading hero video")}
          >
            <source src="/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </motion.div>

        <div className="absolute inset-0 bg-black/30 z-1"></div>
        
        {/* Gradient overlay on the right side */}
        <div className="absolute top-0 bottom-0 right-0 w-full md:w-5/6 lg:w-3/4 z-1" 
          style={{ 
            background: 'linear-gradient(270deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.96) 20%, rgba(0,0,0,0.94) 30%, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0) 100%)',
            backdropFilter: 'blur(3px)'
          }}>
        </div>
        
        {/* Main content - absolutely positioned to bottom right */}
        <div className="absolute bottom-0 right-0 z-10 p-8 md:p-12 lg:p-16 max-w-full md:max-w-2xl lg:max-w-3xl">
          <motion.div 
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-end"
          >
            {/* Heading with variable font weights and text animation */}
            <h1 className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl mb-4 sm:mb-5 leading-tight sm:leading-none tracking-tight text-right">
              <motion.span 
                className="block font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/90 -mb-1 sm:-mb-2 italic"
                variants={heroTextVariants}
              >
                Smart Technology
              </motion.span>
              <motion.span 
                className="block font-medium text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 -mb-1 sm:-mb-2"
                variants={heroTextVariants}
              >
                for the Modern
              </motion.span> 
              <motion.span 
                className="block font-semibold text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-300"
                variants={heroTextVariants}
              >
                Pet Parent
              </motion.span>
            </h1>
            
            {/* Subheading with improved typography and animation */}
            <motion.p 
              className="text-base sm:text-lg text-white/90 mb-6 md:mb-8 leading-relaxed text-right"
              variants={fadeInVariants}
            >
              Transforming how urban pet owners care for their companions with intuitive, 
              AI-powered solutions that adapt to your pet's unique needs.
            </motion.p>
            
            {/* Button group with improved styling and animation */}
            <motion.div 
              className="flex flex-wrap gap-4 justify-end"
              variants={staggerVariants}
              initial="hidden"
              animate="visible"
              transition={{ delayChildren: 0.9, staggerChildren: 0.15 }}
            >
              <motion.div variants={itemVariants}>
                <Link 
                  href="/products" 
                  className="group inline-flex items-center justify-center py-1.5 pl-3 pr-2 rounded-full bg-white text-black hover:bg-gray-100 transition-all font-medium text-sm"
                >
                  <span className="mr-1.5">Our Solutions</span>
                  <div className="bg-black rounded-full p-1 flex items-center justify-center">
                    <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                      <ArrowRight size={12} stroke="white" strokeWidth={2} />
                    </div>
                  </div>
                </Link>
              </motion.div>
              <motion.div variants={itemVariants}>
                <Link 
                  href="#cta" 
                  className="group inline-flex items-center justify-center py-1.5 pl-3 pr-2 rounded-full bg-black/30 backdrop-blur-md border border-white/20 text-white hover:bg-black/40 transition-all font-medium text-sm"
                >
                  <span className="mr-1.5">Learn More</span>
                  <div className="bg-white/10 rounded-full p-1 flex items-center justify-center">
                    <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                      <ArrowRight size={12} stroke="white" strokeWidth={2} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="py-16 md:py-24 relative bg-cover bg-center bg-fixed overflow-hidden" ref={missionRef}>
        {/* Background placeholder image */}
        <div className="absolute inset-0 w-full h-full bg-gray-900">
          <Image 
            src="/mission-placeholder.jpg" 
            alt="Mission background" 
            fill 
            className="object-cover opacity-60"
          />
        </div>
        
        {/* Background video - lazy loaded */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: missionVideoLoaded ? 1 : 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full z-0"
        >
          <video 
            ref={missionVideoRef}
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/mission-poster.jpg"
            onError={() => console.error("Error loading mission video")}
          >
            {/* Source will be added dynamically when in view */}
            Your browser does not support the video tag.
          </video>
        </motion.div>

        <div className="absolute inset-0 bg-black/30 z-1"></div>
        
        {/* Gradient overlay on the left side */}
        <div className="absolute top-0 bottom-0 left-0 w-full md:w-5/6 lg:w-3/4 z-1" 
          style={{ 
            background: 'linear-gradient(90deg, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.96) 20%, rgba(0,0,0,0.94) 30%, rgba(0,0,0,0.92) 40%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.75) 60%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.2) 90%, rgba(0,0,0,0) 100%)',
            backdropFilter: 'blur(3px)'
          }}>
        </div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <motion.div
            className="flex justify-start"
            variants={sectionVariants}
            initial="hidden"
            animate={missionInView ? "visible" : "hidden"}
          >
            <div className="w-full md:w-2/3 lg:w-1/2 p-10">
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6 text-white"
                variants={itemVariants}
              >
                Our Mission
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-100 mb-10"
                variants={itemVariants}
              >
                To revolutionize urban pet care through innovative technology that makes pet ownership easier, 
                more enjoyable, and more sustainable in city environments.
              </motion.p>
              <motion.h2 
                className="text-3xl md:text-4xl font-bold mb-6 text-white"
                variants={itemVariants}
              >
                Our Vision
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-100"
                variants={itemVariants}
              >
                We envision a future where every urban pet owner has access to smart, intuitive technology 
                that enhances their pet's quality of life while making city living more pet-friendly.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-gray-50" ref={valuesRef}>
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div
            className="text-center mb-16"
            variants={sectionVariants}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Innovation",
                description: "Pushing boundaries in pet tech to create solutions that truly make a difference",
                icon: <Lightbulb className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
              },
              {
                title: "Pet-First Design",
                description: "Every product we create prioritizes the well-being and happiness of pets",
                icon: <PawPrint className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
              },
              {
                title: "Urban Sustainability",
                description: "Creating eco-friendly solutions that work harmoniously with city life",
                icon: <Leaf className="w-6 h-6 text-gray-800" strokeWidth={1.5} />
              }
            ].map((value, index) => (
              <motion.div
                key={value.title}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={valuesInView ? "visible" : "hidden"}
                className="bg-white p-8 rounded-xl border border-gray-100 shadow-[0_5px_30px_-15px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.08)] transition-all duration-300"
              >
                <div className="inline-block p-4 bg-gray-50 rounded-full mb-5">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-white" ref={teamRef}>
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div 
            className="text-center mb-16"
            variants={sectionVariants}
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Exceptional Team</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">
              Meet our outstanding team - a synergy of talent, creativity,
              and dedication, crafting success together.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 mb-12">
            {[
              {
                name: "Emily Chen",
                role: "Founder & CEO",
                image: "/images/team/emily.jpg",
                linkedin: "#",
                twitter: "#"
              },
              {
                name: "Dr. Sarah Martinez",
                role: "Head of Pet Wellness",
                image: "/images/team/sarah.jpg",
                linkedin: "#",
                twitter: "#"
              },
              {
                name: "Ashish",
                role: "CTO",
                image: "/ashish.png",
                linkedin: "https://www.linkedin.com/in/ashish-makes/",
                twitter: "https://twitter.com/ashish_makes"
              },
              {
                name: "Eleanor Morales",
                role: "HR",
                image: "/images/team/eleanor.jpg",
                linkedin: "#",
                twitter: "#"
              }
            ].map((member, index) => (
              <motion.div 
                key={member.name} 
                className="flex flex-col items-center text-center"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={teamInView ? "visible" : "hidden"}
              >
                <div className="w-40 h-40 md:w-48 md:h-48 mb-5 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={192}
                    height={192}
                    className="object-cover w-full h-full grayscale"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{member.role}</p>
                <div className="flex space-x-3">
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
                    <TwitterX />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    <Instagram size={16} />
                  </a>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
                    <Linkedin size={16} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-10 max-w-3xl mx-auto">
            {[
              {
                name: "Sophia Monic",
                role: "Product Manager",
                image: "/images/team/sophia.jpg",
                linkedin: "#",
                twitter: "#"
              },
              {
                name: "James Miller",
                role: "Marketing Lead",
                image: "/images/team/james.jpg",
                linkedin: "#",
                twitter: "#"
              }
            ].map((member, index) => (
              <motion.div 
                key={member.name} 
                className="flex flex-col items-center text-center"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate={teamInView ? "visible" : "hidden"}
                transition={{ delay: index * 0.15 + 0.4 }} // Additional delay after the first row
              >
                <div className="w-40 h-40 md:w-48 md:h-48 mb-5 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={192}
                    height={192}
                    className="object-cover w-full h-full grayscale"
                  />
                </div>
                <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                <p className="text-gray-500 text-sm mb-3">{member.role}</p>
                <div className="flex space-x-3">
                  <a href={member.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
                    <TwitterX />
                  </a>
                  <a href="#" className="text-gray-500 hover:text-gray-700">
                    <Instagram size={16} />
                  </a>
                  <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-gray-700">
                    <Linkedin size={16} />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="py-16 md:py-24 bg-black text-white" ref={ctaRef}>
        <motion.div 
          className="container mx-auto px-4 max-w-4xl text-center"
          variants={sectionVariants}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
        >
          <motion.h2 
            className="font-bold text-3xl md:text-4xl mb-6"
            variants={itemVariants}
          >
            Join the UrbanIQ Family
          </motion.h2>
          <motion.p 
            className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto"
            variants={itemVariants}
          >
            Experience the future of pet care with our innovative products designed for urban pet owners.
          </motion.p>
          <motion.div 
            className="flex flex-wrap justify-center gap-4"
            variants={staggerVariants}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
          >
            <motion.div variants={itemVariants}>
              <Link 
                href="/products" 
                className="group inline-flex items-center justify-center py-1.5 pl-3 pr-2 rounded-full bg-white text-black hover:bg-gray-100 transition-all font-medium text-sm"
              >
                <span className="mr-1.5">Explore Products</span>
                <div className="bg-black rounded-full p-1 flex items-center justify-center">
                  <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                    <ArrowRight size={12} stroke="white" strokeWidth={2} />
                  </div>
                </div>
              </Link>
            </motion.div>
            <motion.div variants={itemVariants}>
              <Link 
                href="/contact" 
                className="group inline-flex items-center justify-center py-1.5 pl-3 pr-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all font-medium text-sm"
              >
                <span className="mr-1.5">Contact Us</span>
                <div className="bg-white/10 rounded-full p-1 flex items-center justify-center">
                  <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                    <ArrowRight size={12} stroke="white" strokeWidth={2} />
                  </div>
                </div>
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
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