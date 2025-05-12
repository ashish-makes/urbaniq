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
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";

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
  const [searchQuery, setSearchQuery] = useState("");
  
  // Handle scroll events to add shadow
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);
  
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

  return (
    <header className={`py-2 px-3 sticky top-0 z-50 bg-white/90 backdrop-blur-md transition-shadow duration-400 ${scrolled ? 'shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]' : ''}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Mobile menu sidebar component */}
          <MobileSidebar />
          
          <Link href="/" aria-label="UrbanIQ Home" className="hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#000000" viewBox="0 0 256 256">
              <path d="M96,140a12,12,0,1,1-12-12A12,12,0,0,1,96,140Zm76-12a12,12,0,1,0,12,12A12,12,0,0,0,172,128Zm60-80v88c0,52.93-46.65,96-104,96S24,188.93,24,136V48A16,16,0,0,1,51.31,36.69c.14.14.26.27.38.41L69,57a111.22,111.22,0,0,1,118.1,0L204.31,37.1c.12-.14.24-.27.38-.41A16,16,0,0,1,232,48Zm-16,0-21.56,24.8A8,8,0,0,1,183.63,74,88.86,88.86,0,0,0,168,64.75V88a8,8,0,1,1-16,0V59.05a97.43,97.43,0,0,0-16-2.72V88a8,8,0,1,1-16,0V56.33a97.43,97.43,0,0,0-16,2.72V88a8,8,0,1,1-16,0V64.75A88.86,88.86,0,0,0,72.37,74a8,8,0,0,1-10.81-1.17L40,48v88c0,41.66,35.21,76,80,79.67V195.31l-13.66-13.66a8,8,0,0,1,11.32-11.31L128,180.68l10.34-10.34a8,8,0,0,1,11.32,11.31L136,195.31v20.36c44.79-3.69,80-38,80-79.67Z"></path>
            </svg>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <nav className="flex space-x-5">
            {/* Dogs Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium text-gray-800 hover:text-black transition-colors flex items-center gap-1.5 focus:outline-none">
                Dogs <ChevronDown size={14} className="text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dogs/tech-essentials" className="w-full cursor-pointer">Smart Tech Essentials</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dogs/activity-trackers" className="w-full cursor-pointer">Activity Trackers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dogs/feeding" className="w-full cursor-pointer">Smart Feeding Solutions</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dogs/toys" className="w-full cursor-pointer">Interactive Toys</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dogs/all" className="w-full cursor-pointer">All Dog Products</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cats Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium text-gray-800 hover:text-black transition-colors flex items-center gap-1.5 focus:outline-none">
                Cats <ChevronDown size={14} className="text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/cats/tech-essentials" className="w-full cursor-pointer">Smart Tech Essentials</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cats/activity-trackers" className="w-full cursor-pointer">Activity Trackers</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cats/litter" className="w-full cursor-pointer">Smart Litter Solutions</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/cats/toys" className="w-full cursor-pointer">Interactive Toys</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/cats/all" className="w-full cursor-pointer">All Cat Products</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Smart Home */}
            <DropdownMenu>
              <DropdownMenuTrigger className="text-sm font-medium text-gray-800 hover:text-black transition-colors flex items-center gap-1.5 focus:outline-none">
                Smart Home <ChevronDown size={14} className="text-gray-500" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/smart-home/feeders" className="w-full cursor-pointer">Automatic Feeders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/smart-home/cameras" className="w-full cursor-pointer">Pet Cameras & Monitors</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/smart-home/doors" className="w-full cursor-pointer">Smart Pet Doors</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/smart-home/accessories" className="w-full cursor-pointer">Smart Accessories</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/smart-home/all" className="w-full cursor-pointer">All Smart Home</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            {/* Deals & Bundles */}
            <AnimatedLink href="/deals">
              Deals & Bundles
            </AnimatedLink>
            
            {/* New Arrivals */}
            <AnimatedLink href="/new">
              New Arrivals
            </AnimatedLink>
          </nav>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <form onSubmit={handleSearchSubmit}>
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={16} className="text-gray-400" />
              </div>
              <Input 
                type="search" 
                placeholder={currentPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-1 h-8 w-[180px] lg:w-[220px] text-sm rounded-full border border-gray-200 focus:border-gray-300 focus-visible:ring-0 focus:ring-0 shadow-none [&::-webkit-search-cancel-button]:appearance-none"
              />
              {searchQuery && (
                <button 
                  type="button"
                  className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-100 transition-colors"
                  onClick={() => setSearchQuery("")}
                >
                  <X size={12} className="text-gray-400" />
                </button>
              )}
              </form>
            </div>
            
            {/* Desktop Cart */}
            <CartSidebar />

            {/* Authentication UI */}
            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1.5 focus:outline-none">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                      <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-2 text-sm font-medium text-gray-700">
                      {session?.user?.name || 'User'}
                    </div>
                    <DropdownMenuSeparator />
                    
                    {isAdmin && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/dashboard" className="w-full cursor-pointer">
                            <LayoutDashboard className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    
                    <DropdownMenuItem asChild>
                      <Link href={isAdmin ? "/admin/dashboard" : "/user/dashboard"} className="w-full cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href={isAdmin ? "/admin/profile" : "/user/profile"} className="w-full cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuItem asChild>
                      <Link href={isAdmin ? "/admin/settings" : "/user/settings"} className="w-full cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login">
                    <div className="group inline-flex items-center justify-center py-1.5 pl-3 pr-2 rounded-full bg-white text-black border border-gray-200 hover:bg-gray-50 transition-all font-bricolage text-xs">
                      <span className="mr-1.5">Log in</span>
                      <div className="bg-black rounded-full p-1 flex items-center justify-center">
                        <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                          <ArrowRight size={12} stroke="white" strokeWidth={2} />
                        </div>
                      </div>
                    </div>
                  </Link>

                  <Link href="/signup">
                    <div className="group inline-flex items-center justify-center py-1.5 pl-3 pr-2 rounded-full bg-black text-white hover:bg-black/90 transition-all font-bricolage text-xs">
                      <span className="mr-1.5">Sign up</span>
                      <div className="bg-white rounded-full p-1 flex items-center justify-center">
                        <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                          <ArrowRight size={12} stroke="black" strokeWidth={2} />
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
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-gray-400" />
            </div>
            <Input 
              type="search" 
              placeholder={currentPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10 py-1 h-8 w-full text-sm rounded-full border-gray-200 focus:border-gray-300 focus-visible:ring-0 focus:ring-0 shadow-none [&::-webkit-search-cancel-button]:appearance-none"
            />
            {searchQuery && (
              <button 
                type="button"
                className="absolute top-1/2 -translate-y-1/2 right-3 flex items-center justify-center w-5 h-5 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => setSearchQuery("")}
              >
                <X size={12} className="text-gray-400" />
              </button>
            )}
            </form>
          </div>
          {/* Mobile Cart */}
          <CartSidebar />
          
          {/* Mobile authentication */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                  <AvatarFallback className="bg-gray-100 text-gray-700 text-xs">
                    {session?.user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-2 text-sm font-medium text-gray-700">
                  {session?.user?.name || 'User'}
                </div>
                <DropdownMenuSeparator />
                
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/admin/dashboard" className="w-full cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                
                <DropdownMenuItem asChild>
                  <Link href={isAdmin ? "/admin/dashboard" : "/user/dashboard"} className="w-full cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href={isAdmin ? "/admin/profile" : "/user/profile"} className="w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild>
                  <Link href={isAdmin ? "/admin/settings" : "/user/settings"} className="w-full cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <User size={20} className="text-gray-700" />
            </Link>
          )}
        </div>
      </div>
    </header>
  );
} 