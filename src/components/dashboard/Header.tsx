'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Bell, Search, X, User, Settings, LogOut, Shield } from 'lucide-react';
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

interface HeaderProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export function Header({ isCollapsed, setIsCollapsed }: HeaderProps) {
  const { data: session } = useSession();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      // Use a very small threshold to show shadow almost immediately
      setIsScrolled(window.scrollY > 1);
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initial check
    handleScroll();
    
    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Get the current page title from the path
  const getPageTitle = () => {
    const path = pathname.split('/');
    const currentPage = path[path.length - 1];
    return currentPage.charAt(0).toUpperCase() + currentPage.slice(1);
  };

  // Check if user is in admin section
  const isInAdminSection = pathname.startsWith('/admin');
  const isInUserSection = pathname.startsWith('/user');

  return (
    <header 
      className={cn(
        "h-14 w-full flex items-center justify-between bg-white border-b border-gray-100 px-4 sticky top-0 z-50",
        "transition-all duration-200",
        isScrolled 
          ? "shadow-[0_2px_15px_-5px_rgba(0,0,0,0.1)]" 
          : "shadow-none"
      )}
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
        
        <h1 className="font-medium tracking-tight">
          <span className="font-semibold">{getPageTitle()}</span>
        </h1>
      </div>

      <div className="flex items-center gap-3">
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
              className="h-8 rounded-full pl-1 pr-2 flex items-center gap-2 hover:bg-gray-50"
              aria-label="Open user menu"
            >
              <div className="relative">
                <Avatar className={cn(
                  "h-6 w-6 border", 
                  session?.user?.role === 'ADMIN' 
                    ? "border-primary/40 ring-1 ring-primary/20" 
                    : "border-gray-100"
                )}>
                  <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                  <AvatarFallback className={cn(
                    "text-xs font-medium", 
                    session?.user?.role === 'ADMIN'
                      ? "bg-primary/20 text-primary"
                      : "bg-primary/10 text-primary"
                  )}>
                    {session?.user?.name
                      ? session.user.name.charAt(0).toUpperCase()
                      : 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span className="text-sm font-medium hidden sm:inline-block">
                {session?.user?.name?.split(' ')[0] || 'User'}
                {session?.user?.role === 'ADMIN' && (
                  <span className="ml-1 text-xs text-primary font-medium">•</span>
                )}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1.5">
            <div className="flex items-center gap-3 px-2 py-1.5">
              <Avatar className={cn(
                "h-8 w-8 border", 
                session?.user?.role === 'ADMIN' 
                  ? "border-primary/40 ring-1 ring-primary/20" 
                  : "border-gray-100"
              )}>
                <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'User'} />
                <AvatarFallback className={cn(
                  "text-xs font-medium", 
                  session?.user?.role === 'ADMIN'
                    ? "bg-primary/20 text-primary"
                    : "bg-primary/10 text-primary"
                )}>
                  {session?.user?.name
                    ? session.user.name.charAt(0).toUpperCase()
                    : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{session?.user?.name || 'User'}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {session?.user?.email || ''}
                  {session?.user?.role === 'ADMIN' && (
                    <span className="ml-1 text-red-500 font-medium">• Admin</span>
                  )}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator className="my-1.5" />
            {session?.user?.role === 'ADMIN' && (
              <>
                {isInAdminSection ? (
                  <DropdownMenuItem asChild className="py-1.5">
                    <Link href="/user/dashboard" className="cursor-pointer text-sm">
                      <User className="mr-2.5 h-3.5 w-3.5" />
                      <span>User Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem asChild className="py-1.5">
                    <Link href="/admin/dashboard" className="cursor-pointer text-sm">
                      <Shield className="mr-2.5 h-3.5 w-3.5 text-red-500" />
                      <span>Admin Portal</span>
                    </Link>
                  </DropdownMenuItem>
                )}
              </>
            )}
            <DropdownMenuItem asChild className="py-1.5">
              <Link href={session?.user?.role === 'ADMIN' ? '/admin/profile' : '/user/profile'} className="cursor-pointer text-sm">
                <User className="mr-2.5 h-3.5 w-3.5" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="py-1.5">
              <Link href={session?.user?.role === 'ADMIN' ? '/admin/settings' : '/user/settings'} className="cursor-pointer text-sm">
                <Settings className="mr-2.5 h-3.5 w-3.5" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="my-1.5" />
            <DropdownMenuItem 
              className="text-sm cursor-pointer py-1.5 text-red-500 focus:text-red-500 focus:bg-red-50"
              onClick={() => signOut({ callbackUrl: '/' })}
            >
              <LogOut className="mr-2.5 h-3.5 w-3.5" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile search input */}
      {showSearch && (
        <div className="absolute inset-x-0 top-14 z-50 border-b border-gray-100 bg-white p-3 md:hidden">
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
        </div>
      )}

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
    </header>
  );} 
