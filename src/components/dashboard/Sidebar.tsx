'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { cn } from '@/lib/utils';
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
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

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
      title: 'Products',
      href: '/user/products',
      icon: ShoppingBag,
    },
    {
      title: 'Orders',
      href: '/user/orders',
      icon: ListOrdered,
    },
    {
      title: 'Favorites',
      href: '/user/favorites',
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

  // Animation configuration matching parent
  const springTransition = {
    type: "spring",
    stiffness: 300,
    damping: 30
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <motion.div
      className="flex h-full flex-col border-r border-gray-800 bg-black py-3"
      initial={false}
      animate={{
        width: isMobile ? "100%" : (isCollapsed ? 70 : 240),
      }}
      transition={springTransition}
      layout
    >
      <motion.div 
        className={cn(
          "flex w-full items-center px-4", 
          isMobile ? "justify-between" : (isCollapsed ? "justify-center" : "justify-between")
        )}
        layout
      >
        <AnimatePresence mode="wait">
          {(isMobile || !isCollapsed) && (
            <motion.span 
              key="logo"
              className="text-lg font-semibold text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              Urban<span className="text-blue-400">IQ</span>
            </motion.span>
          )}
        </AnimatePresence>
        
        {/* Only show collapse button on desktop */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-800"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChevronLeft className="h-4 w-4" />
            </motion.div>
          </Button>
        )}
      </motion.div>

      <motion.div 
        className="mt-4 w-full space-y-1 px-2"
        layout
      >
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
                  ? "bg-gray-900 text-white font-medium"
                  : "text-gray-400 hover:text-white hover:bg-gray-900"
              )}
              title={!isMobile && isCollapsed ? route.title : undefined}
            >
              <motion.div
                className="flex items-center"
                animate={{ 
                  justifyContent: !isMobile && isCollapsed ? "center" : "flex-start",
                  width: "100%"
                }}
                transition={springTransition}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <AnimatePresence mode="wait">
                  {(isMobile || !isCollapsed) && (
                    <motion.span
                      key={`text-${route.title}`}
                      className="ml-3"
                      initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                      animate={{ 
                        opacity: 1,
                        width: "auto",
                        marginLeft: 12
                      }}
                      exit={{ 
                        opacity: 0,
                        width: 0,
                        marginLeft: 0
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      {route.title}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>
            </Link>
          );
        })}
      </motion.div>

      <motion.div 
        className="mt-auto w-full px-2 mb-2"
        layout
      >
        <button
          className={cn(
            "flex h-9 w-full items-center rounded-md px-3 text-sm text-gray-400 transition-colors hover:bg-gray-800 hover:text-white",
            !isMobile && isCollapsed && "justify-center px-0"
          )}
          title={!isMobile && isCollapsed ? "Logout" : undefined}
          onClick={handleLogout}
        >
          <motion.div
            className="flex items-center"
            animate={{ 
              justifyContent: !isMobile && isCollapsed ? "center" : "flex-start",
              width: "100%" 
            }}
            transition={springTransition}
          >
            <LogOut className="h-4 w-4 flex-shrink-0" />
            <AnimatePresence mode="wait">
              {(isMobile || !isCollapsed) && (
                <motion.span
                  key="logout-text"
                  className="ml-3"
                  initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                  animate={{ 
                    opacity: 1,
                    width: "auto",
                    marginLeft: 12
                  }}
                  exit={{ 
                    opacity: 0,
                    width: 0,
                    marginLeft: 0
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Logout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        </button>
      </motion.div>
    </motion.div>
  );
} 