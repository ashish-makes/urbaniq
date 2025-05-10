'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  LayoutDashboard,
  User,
  ShoppingBag,
  ListOrdered,
  Heart,
  Settings,
  LogOut,
  BarChart3,
  Users,
  Store,
  ShoppingCart
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobile?: boolean;
}

export function Sidebar({ isCollapsed, setIsCollapsed, isMobile = false }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const isAdmin = session?.user?.role === 'ADMIN';

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const userRoutes = [
    {
      title: 'Dashboard',
      href: '/user/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Profile',
      href: '/user/profile',
      icon: User,
    },
    {
      title: 'Orders',
      href: '/user/orders',
      icon: ListOrdered,
    },
    {
      title: 'Cart',
      href: '/user/cart',
      icon: ShoppingCart,
    },
    {
      title: 'Wishlist',
      href: '/user/wishlist',
      icon: Heart,
    },
    {
      title: 'Settings',
      href: '/user/settings',
      icon: Settings,
    },
  ];

  const adminRoutes = [
    {
      title: 'Dashboard',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
    },
    {
      title: 'Users',
      href: '/admin/users',
      icon: Users,
    },
    {
      title: 'Customers',
      href: '/admin/customers',
      icon: Users,
    },
    {
      title: 'Categories',
      href: '/admin/categories',
      icon: ListOrdered,
    },
    {
      title: 'Products',
      href: '/admin/products',
      icon: Store,
    },
    {
      title: 'Orders',
      href: '/admin/orders',
      icon: ListOrdered,
    },
    {
      title: 'Settings',
      href: '/admin/settings',
      icon: Settings,
    },
  ];

  const routes = isAdmin ? adminRoutes : userRoutes;

  // Animation variants
  const sidebarVariants = {
    expanded: { width: "240px" },
    collapsed: { width: "70px" }
  };

  const textVariants = {
    expanded: { opacity: 1, display: "block" },
    collapsed: { 
      opacity: 0, 
      display: "none",
      transition: { 
        display: { delay: 0.15 } 
      }
    }
  };

  const chevronVariants = {
    expanded: { rotate: 0 },
    collapsed: { rotate: 180 }
  };

  return (
    <motion.div
      initial={false}
      animate={isCollapsed && !isMobile ? "collapsed" : "expanded"}
      variants={sidebarVariants}
      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
      className={cn(
        "flex h-full flex-col border-r border-zinc-900 bg-black py-3",
        // Only apply mobile-specific classes
        isMobile && "w-full"
      )}
    >
      <div className="flex w-full items-center justify-between px-4">
        {!isCollapsed || isMobile ? (
          <span className="text-lg font-semibold text-white">
            Urban<span className="text-blue-500 font-bold">IQ</span>
          </span>
        ) : (
          <span className="text-lg font-semibold text-white opacity-0">.</span>
        )}
        
        {/* Only show collapse button on desktop */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-zinc-900"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </Button>
        )}
      </div>

      <div className="mt-4 w-full space-y-1 px-2">
        {routes.map((route) => {
          const isActive = pathname === route.href;
          const Icon = route.icon;

          return (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex h-9 items-center rounded-md px-3 text-sm transition-colors",
                !isMobile && isCollapsed && "justify-center px-0",
                isActive
                  ? "bg-zinc-900 text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-zinc-900"
              )}
              title={!isMobile && isCollapsed ? route.title : undefined}
            >
              <Icon className={cn(
                "h-4 w-4", 
                !isMobile && isCollapsed ? "mx-auto" : "mr-3"
              )} />
              {(!isCollapsed || isMobile) && <span>{route.title}</span>}
            </Link>
          );
        })}
      </div>

      <div className="mt-auto w-full px-2 mb-2">
        <button
          className={cn(
            "flex h-9 w-full items-center rounded-md px-3 text-sm text-gray-400 transition-colors hover:bg-zinc-900 hover:text-white",
            !isMobile && isCollapsed && "justify-center px-0"
          )}
          title={!isMobile && isCollapsed ? "Logout" : undefined}
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className={cn(
            "h-4 w-4", 
            !isMobile && isCollapsed ? "mx-auto" : "mr-3"
          )} />
          {(!isCollapsed || isMobile) && <span>Logout</span>}
        </button>
      </div>
    </motion.div>
  );
} 