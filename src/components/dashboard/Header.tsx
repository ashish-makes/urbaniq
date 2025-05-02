'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Bell, Search, X, User, Settings, LogOut, LayoutDashboard, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Header({ isCollapsed, setIsCollapsed }: HeaderProps) {
  const { data: session } = useSession();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const pathname = usePathname();
  
  // Get the current page title from the path
  const getPageTitle = () => {
    const path = pathname.split('/');
    const currentPage = path[path.length - 1];
    return currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
  };

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
    <motion.header 
      className="h-14 w-full flex items-center justify-between bg-white border-b border-gray-100 px-4"
      layout
      transition={springTransition}
    >
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setShowMobileSidebar(true)}
          className="md:hidden h-8 w-8 hover:bg-gray-50"
          aria-label="Open menu"
        >
          <Menu className="h-4 w-4 text-gray-600" />
        </Button>
        
        <motion.h1 
          className="font-medium tracking-tight"
          layout
        >
          <span className="font-semibold">{getPageTitle()}</span>
        </motion.h1>
      </div>

      <motion.div 
        className="flex items-center gap-3"
        layout
      >
        {/* Search input - desktop */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
            <Search className="h-3.5 w-3.5 text-gray-400" />
          </div>
          <Input
            placeholder="Search..."
            className="w-56 h-8 rounded-full bg-gray-50 border-none pl-8 text-sm focus-visible:ring-1 focus-visible:ring-primary/20 shadow-none"
          />
        </div>

        {/* Search button - mobile */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden h-8 w-8 hover:bg-gray-50"
          onClick={() => setShowSearch(!showSearch)}
          aria-label={showSearch ? "Close search" : "Open search"}
        >
          {showSearch ? <X className="h-4 w-4 text-gray-600" /> : <Search className="h-4 w-4 text-gray-600" />}
        </Button>

        {/* Notifications */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative h-8 w-8 rounded-full hover:bg-gray-50" 
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4 text-gray-600" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white"></span>
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="h-8 rounded-full pl-1 pr-2 flex items-center gap-2 hover:bg-gray-50 relative"
              aria-label="Open user menu"
            >
              <Avatar className="h-6 w-6 border border-gray-100">
                <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                  {session?.user?.name
                    ? session.user.name.charAt(0).toUpperCase()
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium hidden sm:inline-block">
                {session?.user?.name?.split(' ')[0] || 'User'}
              </span>
              
              {/* Admin badge indicator */}
              {session?.user?.role === 'ADMIN' && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white shadow-sm">A</span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1.5">
            <div className="flex items-center gap-3 px-2 py-1.5">
              <Avatar className="h-8 w-8 border border-gray-100">
                <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                <AvatarFallback className="text-xs font-medium bg-primary/10 text-primary">
                  {session?.user?.name
                    ? session.user.name.charAt(0).toUpperCase()
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{session?.user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 mt-1">{session?.user?.email || ''}</p>
                {session?.user?.role === 'ADMIN' && (
                  <p className="text-xs font-medium text-primary mt-1">Administrator</p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator className="my-1.5" />
            
            {/* Admin Portal Link - Show only to admin users in user dashboard */}
            {session?.user?.role === 'ADMIN' && pathname.startsWith('/user') && (
              <DropdownMenuItem asChild className="py-1.5">
                <Link href="/admin/dashboard" className="cursor-pointer text-sm text-primary">
                  <Shield className="mr-2.5 h-3.5 w-3.5 text-primary" />
                  <span className="font-medium">Admin Portal</span>
                </Link>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem asChild className="py-1.5">
              <Link href={session?.user?.role === 'ADMIN' ? '/admin/profile' : '/user/profile'} className="cursor-pointer text-sm">
                <User className="mr-2.5 h-3.5 w-3.5" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            
            {/* For admin users in admin dashboard, offer quick link back to user dashboard */}
            {session?.user?.role === 'ADMIN' && pathname.startsWith('/admin') && (
              <DropdownMenuItem asChild className="py-1.5">
                <Link href="/user/dashboard" className="cursor-pointer text-sm">
                  <LayoutDashboard className="mr-2.5 h-3.5 w-3.5" />
                  <span>User Dashboard</span>
                </Link>
              </DropdownMenuItem>
            )}
            
            <DropdownMenuItem asChild className="py-1.5">
              <Link href={session?.user?.role === 'ADMIN' ? '/admin/settings' : '/user/settings'} className="cursor-pointer text-sm">
                <Settings className="mr-2.5 h-3.5 w-3.5" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1.5" />
            <DropdownMenuItem 
              className="text-sm cursor-pointer py-1.5 text-red-500 focus:text-red-500 focus:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut className="mr-2.5 h-3.5 w-3.5" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {/* Mobile search input */}
      <AnimatePresence>
        {showSearch && (
          <motion.div 
            className="absolute inset-x-0 top-14 z-50 border-b border-gray-100 bg-white p-3 md:hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-3.5 w-3.5 text-gray-400" />
              </div>
              <Input
                placeholder="Search..."
                className="w-full h-8 rounded-full bg-gray-50 border-none pl-8 text-sm focus-visible:ring-1 focus-visible:ring-primary/20 shadow-none"
                autoFocus
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile sidebar */}
      <Sheet open={showMobileSidebar} onOpenChange={setShowMobileSidebar}>
        <SheetContent side="left" className="p-0 w-[240px]">
          <Sidebar 
            isCollapsed={false} 
            setIsCollapsed={() => {}} 
            isMobile={true}
          />
        </SheetContent>
      </Sheet>
    </motion.header>
  );
} 