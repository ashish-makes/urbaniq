'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if the screen is mobile-sized
  useEffect(() => {
    const checkIfMobile = () => {
      const isMobileScreen = window.innerWidth < 768; // 768px is the md breakpoint in Tailwind
      setIsMobile(isMobileScreen);
      
      // Auto-collapse sidebar on smaller screens
      if (window.innerWidth < 1024 && !isCollapsed) {
        setIsCollapsed(true);
      }
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [isCollapsed]);

  // Handle manual sidebar toggle
  const handleSidebarToggle = () => {
    setIsCollapsed(!isCollapsed);
  };

  // If the user is not authenticated, redirect to login
  if (status === 'unauthenticated') {
    router.push('/login');
    return null;
  }

  // Show loading state while checking session
  if (status === 'loading') {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 border-t-black"></div>
      </div>
    );
  }

  return (
    <div className="relative h-screen flex bg-gray-50">
      {/* Only show the sidebar on desktop */}
      <div className="hidden md:block fixed top-0 left-0 h-full z-40">
        <Sidebar 
          isCollapsed={isCollapsed} 
          setIsCollapsed={handleSidebarToggle} 
        />
      </div>
      <motion.div 
        className="flex flex-col h-screen w-full"
        initial={false}
        animate={{ 
          marginLeft: isMobile ? 0 : (isCollapsed ? 70 : 240) 
        }}
        transition={{
          type: "spring",
          bounce: 0.15,
          duration: 0.4
        }}
      >
        <Header isCollapsed={isCollapsed} setIsCollapsed={handleSidebarToggle} />
        <motion.main 
          className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50"
          layout
          transition={{
            type: "spring",
            bounce: 0.15,
            duration: 0.4
          }}
        >
          <div className="container mx-auto px-4 py-6">
            {children}
          </div>
        </motion.main>
      </motion.div>
    </div>
  );
} 