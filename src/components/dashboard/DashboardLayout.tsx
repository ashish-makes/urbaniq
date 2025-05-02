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
      setIsMobile(window.innerWidth < 768); // 768px is the md breakpoint in Tailwind
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

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

  const sidebarWidth = isCollapsed ? 70 : 240;

  return (
    <div className="relative h-screen overflow-hidden bg-gray-40">
      {/* Only show the sidebar on desktop */}
      <div className="hidden md:block fixed top-0 left-0 h-full z-20">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>
      <motion.div 
        className="flex flex-col h-full"
        initial={false}
        animate={{ 
          marginLeft: isMobile ? 0 : `${sidebarWidth}px`
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
      >
        <Header isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
        <motion.main 
          className="flex-1 overflow-y-auto p-6"
          layout
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
        >
          <div className="container mx-auto px-0">
            {children}
          </div>
        </motion.main>
      </motion.div>
    </div>
  );
} 