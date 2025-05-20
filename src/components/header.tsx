"use client";

import Link from "next/link";
import { ArrowRight, ChevronDown, Search, User, LogOut, Settings, LayoutDashboard, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { CartSidebar } from "@/components/CartSidebar";
import { MobileSidebar } from "@/components/MobileSidebar";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter, usePathname } from "next/navigation";
import { Form } from "@/components/ui/form";
import { motion, AnimatePresence } from "framer-motion";

// Custom link component without animation
const AnimatedLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <Link 
      href={href} 
      className="text-sm font-medium text-gray-800 hover:text-black transition-colors"
    >
      {children}
    </Link>
  );
};

export function Header() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const isAboutPage = pathname === "/about";
  const isAdmin = session?.user?.role === "ADMIN";
  const isAuthenticated = status === "authenticated";
  
  const placeholders = [
    "Search pet tech...",
    "Find smart feeders...",
    "Search GPS trackers...",
    "Find pet cameras...",
    "Search pet toys..."
  ];
  
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholders[0]);
  const [isTyping, setIsTyping] = useState(true);
  const [typingText, setTypingText] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [pastHeroSection, setPastHeroSection] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Handle scroll events to add shadow and detect hero section
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      
      // Get the hero section element and calculate its height if on the About page
      let heroSectionHeight = 500; // Default fallback
      if (isAboutPage) {
        const heroSection = document.getElementById('about-hero');
        if (heroSection) {
          // Get the bottom position of the hero section
          const heroRect = heroSection.getBoundingClientRect();
          // Use the full height of the hero section, including its top position
          // A negative top means we've scrolled down and the hero is moving up out of view
          heroSectionHeight = heroRect.height;
          
          // Only consider the section fully passed when the hero's bottom edge is at or above the viewport top
          const isPastHero = heroRect.bottom <= 0;
          
          if (isPastHero !== pastHeroSection) {
            setPastHeroSection(isPastHero);
          }
        }
      } else {
        // For non-about pages, no special hero handling
        if (pastHeroSection !== false) {
          setPastHeroSection(false);
        }
      }
      
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Initial check on mount
    handleScroll();
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled, pastHeroSection, isAboutPage]);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isTyping) {
      if (typingText.length < placeholders[placeholderIndex].length) {
        timeout = setTimeout(() => {
          setTypingText(placeholders[placeholderIndex].slice(0, typingText.length + 1));
        }, 100);
      } else {
        timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
      }
    } else {
      if (typingText.length > 0) {
        timeout = setTimeout(() => {
          setTypingText(typingText.slice(0, -1));
        }, 50);
      } else {
        timeout = setTimeout(() => {
          const nextIndex = (placeholderIndex + 1) % placeholders.length;
          setPlaceholderIndex(nextIndex);
          setIsTyping(true);
        }, 500);
      }
    }
    
    return () => clearTimeout(timeout);
  }, [typingText, isTyping, placeholderIndex, placeholders]);
  
  useEffect(() => {
    setCurrentPlaceholder(typingText);
  }, [typingText]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Determine current theme based on page and scroll position
  const isDarkTheme = isAboutPage && !pastHeroSection;

  return (
    <motion.header 
      animate={{
        backgroundColor: isDarkTheme ? '#060a0d' : 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(8px)'
      }}
      transition={{ duration: 0.3 }}
      className={`py-2 px-3 sticky top-0 z-50 transition-shadow duration-400 ${scrolled ? 'shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]' : ''}`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Mobile menu sidebar component */}
          <MobileSidebar isAboutPage={isDarkTheme} />
          
          <Link href="/" aria-label="UrbanIQ Home">
            <motion.h1
              animate={{ 
                color: isDarkTheme ? "#FFFFFF" : "#000000"
              }}
              transition={{ duration: 0.3 }}
              className="text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity"
            >
              UrbanIQ
            </motion.h1>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-5">
            {/* Dogs Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium flex items-center gap-1.5 focus:outline-none transition-colors">
                <motion.span
                  animate={{ 
                    color: isDarkTheme ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Dogs
                </motion.span>
                <motion.span
                  animate={{
                    color: isDarkTheme ? 'rgb(209, 213, 219)' : 'rgb(107, 114, 128)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={14} />
                </motion.span>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className={`w-56 shadow-lg transition-all duration-300 ${isDarkTheme ? 'bg-[#060a0d] border-[#030507] text-gray-200 shadow-[#030507]/50' : 'bg-white border-gray-200 text-gray-800 shadow-gray-200/70'}`}
              >
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href="/dogs/tech-essentials" className={`w-full cursor-pointer transition-colors duration-150`}>Smart Tech Essentials</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href="/dogs/activity-trackers" className={`w-full cursor-pointer transition-colors duration-150`}>Activity Trackers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href="/dogs/feeding" className={`w-full cursor-pointer transition-colors duration-150`}>Smart Feeding Solutions</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href="/dogs/toys" className={`w-full cursor-pointer transition-colors duration-150`}>Interactive Toys</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className={isDarkTheme ? 'bg-[#0c151c]' : ''} />
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href="/dogs/all" className={`w-full cursor-pointer transition-colors duration-150`}>All Dog Products</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cats Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium flex items-center gap-1.5 focus:outline-none transition-colors">
                <motion.span
                  animate={{ 
                    color: isDarkTheme ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Cats
                </motion.span>
                <motion.span
                  animate={{
                    color: isDarkTheme ? 'rgb(209, 213, 219)' : 'rgb(107, 114, 128)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={14} />
                </motion.span>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className={`w-56 shadow-lg transition-all duration-300 ${isDarkTheme ? 'bg-[#060a0d] border-[#030507] text-gray-200 shadow-[#030507]/50' : 'bg-white border-gray-200 text-gray-800 shadow-gray-200/70'}`}
              >
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href="/cats/tech-essentials" className={`w-full cursor-pointer transition-colors duration-150`}>Smart Tech Essentials</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href="/cats/activity-trackers" className={`w-full cursor-pointer transition-colors duration-150`}>Activity Trackers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href="/cats/litter" className={`w-full cursor-pointer transition-colors duration-150`}>Smart Litter Solutions</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href="/cats/toys" className={`w-full cursor-pointer transition-colors duration-150`}>Interactive Toys</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className={isDarkTheme ? 'bg-[#0c151c]' : ''} />
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href="/cats/all" className={`w-full cursor-pointer transition-colors duration-150`}>All Cat Products</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Smart Home */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium flex items-center gap-1.5 focus:outline-none transition-colors">
                <motion.span
                  animate={{ 
                    color: isDarkTheme ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  Smart Home
                </motion.span>
                <motion.span
                  animate={{
                    color: isDarkTheme ? 'rgb(209, 213, 219)' : 'rgb(107, 114, 128)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={14} />
                </motion.span>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="start" 
                className={`w-56 shadow-lg transition-all duration-300 ${isDarkTheme ? 'bg-[#060a0d] border-[#030507] text-gray-200 shadow-[#030507]/50' : 'bg-white border-gray-200 text-gray-800 shadow-gray-200/70'}`}
              >
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href="/smart-home/feeders" className={`w-full cursor-pointer transition-colors duration-150`}>Automatic Feeders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href="/smart-home/cameras" className={`w-full cursor-pointer transition-colors duration-150`}>Pet Cameras & Monitors</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href="/smart-home/doors" className={`w-full cursor-pointer transition-colors duration-150`}>Smart Pet Doors</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href="/smart-home/accessories" className={`w-full cursor-pointer transition-colors duration-150`}>Smart Accessories</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className={isDarkTheme ? 'bg-[#0c151c]' : ''} />
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href="/smart-home/all" className={`w-full cursor-pointer transition-colors duration-150`}>All Smart Home</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Deals & Bundles */}
            <Link 
              href="/deals" 
              className="text-sm font-medium transition-colors relative group"
            >
              <motion.span
                animate={{ 
                  color: isDarkTheme ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)'
                }}
                transition={{ duration: 0.3 }}
              >
                Deals & Bundles
              </motion.span>
              <motion.span 
                className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                animate={{ 
                  backgroundColor: isDarkTheme ? 'rgb(229, 231, 235)' : 'rgb(0, 0, 0)'
                }}
                transition={{ duration: 0.3 }}
              ></motion.span>
            </Link>
            
            {/* New Arrivals */}
            <Link 
              href="/new" 
              className="text-sm font-medium transition-colors relative group"
            >
              <motion.span
                animate={{ 
                  color: isDarkTheme ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)'
                }}
                transition={{ duration: 0.3 }}
              >
                New Arrivals
              </motion.span>
              <motion.span 
                className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                animate={{ 
                  backgroundColor: isDarkTheme ? 'rgb(229, 231, 235)' : 'rgb(0, 0, 0)'
                }}
                transition={{ duration: 0.3 }}
              ></motion.span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <form onSubmit={handleSearchSubmit}>
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none z-10">
                  <motion.span
                    animate={{ 
                      color: isDarkTheme ? 'rgb(209, 213, 219)' : 'rgb(156, 163, 175)'
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <Search size={16} />
                  </motion.span>
                </div>
                <motion.div
                  animate={{ 
                    backgroundColor: isDarkTheme ? '#0c151c' : 'rgb(255, 255, 255)',
                    borderColor: isDarkTheme ? '#030507' : 'rgb(229, 231, 235)',
                    color: isDarkTheme ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'
                  }}
                  transition={{ duration: 0.3 }}
                  className="relative rounded-full border"
                >
                  <Input 
                    type="search" 
                    placeholder={currentPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`pl-8 pr-10 py-1 h-8 w-[180px] lg:w-[220px] text-sm rounded-full placeholder:text-gray-400 focus:border-gray-300 focus-visible:ring-0 focus:ring-0 shadow-none [&::-webkit-search-cancel-button]:appearance-none bg-transparent border-transparent transition-none`}
                  />
                </motion.div>
                {searchQuery && (
                  <button 
                    type="button"
                    className={`absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center w-5 h-5 rounded-full transition-colors ${isDarkTheme ? 'hover:bg-[#030507] text-gray-300' : 'hover:bg-gray-100 text-gray-400'}`}
                    onClick={() => setSearchQuery("")}
                  >
                    <X size={12} />
                  </button>
                )}
              </form>
            </div>
            
            {/* Desktop Cart */}
            <CartSidebar isAboutPage={isDarkTheme} />

            {/* Authentication UI */}
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1.5 focus:outline-none">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                      <AvatarFallback className={`${isDarkTheme ? 'bg-[#0c151c] text-gray-200' : 'bg-gray-100 text-gray-700'} text-xs`}>
                        {session?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className={`w-56 ${isDarkTheme ? 'bg-[#060a0d] border-[#030507] text-gray-200' : ''} shadow-lg ${isDarkTheme ? 'shadow-[#030507]/50' : 'shadow-gray-200/70'}`}>
                    <div className={`px-2 py-2 text-sm font-medium ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                      {session?.user?.name || 'User'}
                    </div>
                    <DropdownMenuSeparator className={isDarkTheme ? 'bg-[#0c151c]' : ''} />
                    
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                          <Link href="/admin/dashboard" className="w-full cursor-pointer">
                            <LayoutDashboard className={`mr-2 h-4 w-4 ${isDarkTheme ? 'text-gray-300' : ''}`} />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className={isDarkTheme ? 'bg-[#0c151c]' : ''} />
                      </>
                    )}
                    
                    <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                      <Link href={isAdmin ? "/admin/dashboard" : "/user/dashboard"} className="w-full cursor-pointer">
                        <LayoutDashboard className={`mr-2 h-4 w-4 ${isDarkTheme ? 'text-gray-300' : ''}`} />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                      <Link href={isAdmin ? "/admin/profile" : "/user/profile"} className="w-full cursor-pointer">
                        <User className={`mr-2 h-4 w-4 ${isDarkTheme ? 'text-gray-300' : ''}`} />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                      <Link href={isAdmin ? "/admin/settings" : "/user/settings"} className="w-full cursor-pointer">
                        <Settings className={`mr-2 h-4 w-4 ${isDarkTheme ? 'text-gray-300' : ''}`} />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator className={isDarkTheme ? 'bg-[#0c151c]' : ''} />
                    
                    <DropdownMenuItem className={`cursor-pointer ${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`} onClick={handleSignOut}>
                      <LogOut className={`mr-2 h-4 w-4 ${isDarkTheme ? 'text-gray-300' : ''}`} />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login">
                    <div className={`group inline-flex items-center justify-center py-1.5 pl-3 pr-2 rounded-full ${isDarkTheme ? 'bg-[#0c151c] text-white border border-[#030507] hover:bg-[#030507]' : 'bg-white text-black border border-gray-200 hover:bg-gray-50'} transition-all font-bricolage text-xs`}>
                      <span className="mr-1.5">Log in</span>
                      <div className={`${isDarkTheme ? 'bg-gray-200' : 'bg-black'} rounded-full p-1 flex items-center justify-center`}>
                        <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                          <ArrowRight size={12} stroke={isDarkTheme ? 'black' : 'white'} strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/signup">
                    <div className={`group inline-flex items-center justify-center py-1.5 pl-3 pr-2 rounded-full ${isDarkTheme ? 'bg-white text-[#060a0d] hover:bg-gray-100' : 'bg-black text-white hover:bg-black/90'} transition-all font-bricolage text-xs`}>
                      <span className="mr-1.5">Sign up</span>
                      <div className={`${isDarkTheme ? 'bg-[#060a0d]' : 'bg-white'} rounded-full p-1 flex items-center justify-center`}>
                        <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                          <ArrowRight size={12} stroke={isDarkTheme ? 'white' : 'black'} strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile search and cart */}
        <div className="flex md:hidden items-center space-x-3 flex-1 ml-3">
          <div className="relative flex-1 mx-2">
            <form onSubmit={handleSearchSubmit}>
              <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none z-10">
                <motion.span
                  animate={{ 
                    color: isDarkTheme ? 'rgb(209, 213, 219)' : 'rgb(156, 163, 175)'
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <Search size={16} />
                </motion.span>
              </div>
              <motion.div
                animate={{ 
                  backgroundColor: isDarkTheme ? '#0c151c' : 'rgb(255, 255, 255)',
                  borderColor: isDarkTheme ? '#030507' : 'rgb(229, 231, 235)',
                  color: isDarkTheme ? 'rgb(255, 255, 255)' : 'rgb(0, 0, 0)'
                }}
                transition={{ duration: 0.3 }}
                className="relative rounded-full border"
              >
                <Input 
                  type="search" 
                  placeholder={currentPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`pl-8 pr-10 py-1 h-8 w-full text-sm rounded-full placeholder:text-gray-400 focus:border-gray-300 focus-visible:ring-0 focus:ring-0 shadow-none [&::-webkit-search-cancel-button]:appearance-none bg-transparent border-transparent transition-none`}
                />
              </motion.div>
              {searchQuery && (
                <button 
                  type="button"
                  className={`absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center w-5 h-5 rounded-full ${isDarkTheme ? 'hover:bg-[#030507] text-gray-300' : 'hover:bg-gray-100 text-gray-400'} transition-colors`}
                  onClick={() => setSearchQuery("")}
                >
                  <X size={12} />
                </button>
              )}
            </form>
          </div>
          {/* Mobile Cart */}
          <CartSidebar isAboutPage={isDarkTheme} />
          
          {/* Mobile authentication */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                  <AvatarFallback className={`${isDarkTheme ? 'bg-[#0c151c] text-gray-200' : 'bg-gray-100 text-gray-700'} text-xs`}>
                    {session?.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={`w-56 ${isDarkTheme ? 'bg-[#060a0d] border-[#030507] text-gray-200' : ''} shadow-lg ${isDarkTheme ? 'shadow-[#030507]/50' : 'shadow-gray-200/70'}`}>
                <div className={`px-2 py-2 text-sm font-medium ${isDarkTheme ? 'text-gray-200' : 'text-gray-700'}`}>
                  {session?.user?.name || 'User'}
                </div>
                <DropdownMenuSeparator className={isDarkTheme ? 'bg-[#0c151c]' : ''} />
                
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                      <Link href="/admin/dashboard" className="w-full cursor-pointer">
                        <LayoutDashboard className={`mr-2 h-4 w-4 ${isDarkTheme ? 'text-gray-300' : ''}`} />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className={isDarkTheme ? 'bg-[#0c151c]' : ''} />
                  </>
                )}
                
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href={isAdmin ? "/admin/dashboard" : "/user/dashboard"} className="w-full cursor-pointer">
                    <LayoutDashboard className={`mr-2 h-4 w-4 ${isDarkTheme ? 'text-gray-300' : ''}`} />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href={isAdmin ? "/admin/profile" : "/user/profile"} className="w-full cursor-pointer">
                    <User className={`mr-2 h-4 w-4 ${isDarkTheme ? 'text-gray-300' : ''}`} />
                    Profile
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild className={`${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`}>
                  <Link href={isAdmin ? "/admin/settings" : "/user/settings"} className="w-full cursor-pointer">
                    <Settings className={`mr-2 h-4 w-4 ${isDarkTheme ? 'text-gray-300' : ''}`} />
                    Settings
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className={isDarkTheme ? 'bg-[#0c151c]' : ''} />
                
                <DropdownMenuItem className={`cursor-pointer ${isDarkTheme ? 'focus:bg-[#0c151c] focus:text-white data-[highlighted]:bg-[#0c151c] data-[highlighted]:text-white' : ''}`} onClick={handleSignOut}>
                  <LogOut className={`mr-2 h-4 w-4 ${isDarkTheme ? 'text-gray-300' : ''}`} />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <motion.div
                animate={{ 
                  color: isDarkTheme ? 'rgb(255, 255, 255)' : 'rgb(107, 114, 128)'
                }}
                transition={{ duration: 0.3 }}
              >
                <User size={20} />
              </motion.div>
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  );
} 