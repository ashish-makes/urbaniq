"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu, User, LogOut, Settings, LayoutDashboard } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";

interface MobileSidebarProps {
  isAboutPage?: boolean;
}

// Regular menu link for subcategories with animation
const MenuLink = ({ href, children, index, isAboutPage }: { href: string; children: React.ReactNode; index: number; isAboutPage?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.2, delay: index * 0.05 }}
  >
    <Link 
      href={href} 
      className={`block py-2.5 text-sm ${isAboutPage ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors hover:pl-1 duration-200 ease-in-out`}
    >
      {children}
    </Link>
  </motion.div>
);

// Mobile menu links component with accordion categories
const MobileMenuLinks = ({ isAboutPage }: { isAboutPage?: boolean }) => {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";
  const isAuthenticated = status === "authenticated";

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <div className="flex flex-col">
      <Accordion 
        type="multiple" 
        className="pt-2 w-full [&_[data-state]]:border-none [&>div]:border-b-0 [&_button]:border-b-0"
      >
        <AccordionItem value="dogs" className="!border-none">
          <AccordionTrigger className={`py-3.5 text-base font-medium hover:no-underline !border-b-0 ${isAboutPage ? 'text-white' : 'text-gray-800'}`}>Dogs</AccordionTrigger>
          <AccordionContent className="pb-2">
            <AnimatePresence>
              <div className="flex flex-col gap-1 pl-2">
                <MenuLink href="/dogs/tech-essentials" index={0} isAboutPage={isAboutPage}>Smart Tech Essentials</MenuLink>
                <MenuLink href="/dogs/activity-trackers" index={1} isAboutPage={isAboutPage}>Activity Trackers</MenuLink>
                <MenuLink href="/dogs/feeding" index={2} isAboutPage={isAboutPage}>Smart Feeding Solutions</MenuLink>
                <MenuLink href="/dogs/toys" index={3} isAboutPage={isAboutPage}>Interactive Toys</MenuLink>
                <MenuLink href="/dogs/all" index={4} isAboutPage={isAboutPage}>All Dog Products</MenuLink>
              </div>
            </AnimatePresence>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cats" className="!border-none">
          <AccordionTrigger className={`py-3.5 text-base font-medium hover:no-underline !border-b-0 ${isAboutPage ? 'text-white' : 'text-gray-800'}`}>Cats</AccordionTrigger>
          <AccordionContent className="pb-2">
            <AnimatePresence>
              <div className="flex flex-col gap-1 pl-2">
                <MenuLink href="/cats/tech-essentials" index={0} isAboutPage={isAboutPage}>Smart Tech Essentials</MenuLink>
                <MenuLink href="/cats/activity-trackers" index={1} isAboutPage={isAboutPage}>Activity Trackers</MenuLink>
                <MenuLink href="/cats/litter" index={2} isAboutPage={isAboutPage}>Smart Litter Solutions</MenuLink>
                <MenuLink href="/cats/toys" index={3} isAboutPage={isAboutPage}>Interactive Toys</MenuLink>
                <MenuLink href="/cats/all" index={4} isAboutPage={isAboutPage}>All Cat Products</MenuLink>
              </div>
            </AnimatePresence>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="smart-home" className="!border-none">
          <AccordionTrigger className={`py-3.5 text-base font-medium hover:no-underline !border-b-0 ${isAboutPage ? 'text-white' : 'text-gray-800'}`}>Smart Home</AccordionTrigger>
          <AccordionContent className="pb-2">
            <AnimatePresence>
              <div className="flex flex-col gap-1 pl-2">
                <MenuLink href="/smart-home/feeders" index={0} isAboutPage={isAboutPage}>Automatic Feeders</MenuLink>
                <MenuLink href="/smart-home/cameras" index={1} isAboutPage={isAboutPage}>Pet Cameras & Monitors</MenuLink>
                <MenuLink href="/smart-home/doors" index={2} isAboutPage={isAboutPage}>Smart Pet Doors</MenuLink>
                <MenuLink href="/smart-home/accessories" index={3} isAboutPage={isAboutPage}>Smart Accessories</MenuLink>
                <MenuLink href="/smart-home/all" index={4} isAboutPage={isAboutPage}>All Smart Home</MenuLink>
              </div>
            </AnimatePresence>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Link href="/deals" className={`flex items-center justify-between py-4 text-base font-medium ${isAboutPage ? 'text-white hover:text-gray-200' : 'text-gray-800 hover:text-black'} transition-colors group`}>
        <span>Deals & Bundles</span>
        <ArrowRight size={16} className={`${isAboutPage ? 'text-gray-300' : 'text-gray-400'} group-hover:-rotate-45 transition-transform duration-300 ease-in-out`} />
      </Link>

      <Link href="/new" className={`flex items-center justify-between py-4 text-base font-medium ${isAboutPage ? 'text-white hover:text-gray-200' : 'text-gray-800 hover:text-black'} transition-colors group`}>
        <span>New Arrivals</span>
        <ArrowRight size={16} className={`${isAboutPage ? 'text-gray-300' : 'text-gray-400'} group-hover:-rotate-45 transition-transform duration-300 ease-in-out`} />
      </Link>
      
      {/* Show user menu or login/signup buttons based on authentication status */}
      {isAuthenticated ? (
        <div className="pt-10 flex flex-col gap-3">
          <div className={`px-1 py-2 text-base font-medium ${isAboutPage ? 'text-gray-200' : 'text-gray-700'}`}>
            {session?.user?.name || 'User'}
          </div>

          {isAdmin && (
            <Link href="/admin/dashboard" className={`flex items-center py-3 px-1 ${isAboutPage ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
              <LayoutDashboard className="mr-3 h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          )}

          <Link href={isAdmin ? "/admin/dashboard" : "/user/dashboard"} className={`flex items-center py-3 px-1 ${isAboutPage ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
            <LayoutDashboard className="mr-3 h-4 w-4" />
            <span>Dashboard</span>
          </Link>

          <Link href={isAdmin ? "/admin/profile" : "/user/profile"} className={`flex items-center py-3 px-1 ${isAboutPage ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
            <User className="mr-3 h-4 w-4" />
            <span>Profile</span>
          </Link>

          <Link href={isAdmin ? "/admin/settings" : "/user/settings"} className={`flex items-center py-3 px-1 ${isAboutPage ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}>
            <Settings className="mr-3 h-4 w-4" />
            <span>Settings</span>
          </Link>

          <button 
            onClick={handleSignOut}
            className={`flex items-center py-3 px-1 ${isAboutPage ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span>Log out</span>
          </button>
        </div>
      ) : (
        <div className="pt-10 flex flex-row gap-3">
          <Link href="/login" className="flex-1">
            <div className={`group inline-flex items-center justify-center py-2 pl-4 pr-3 rounded-full ${isAboutPage ? 'bg-[#0e1419] text-white border border-gray-700 hover:bg-[#181f29]' : 'bg-white text-black border border-gray-200 hover:bg-gray-50'} transition-all font-bricolage text-sm w-full`}>
              <span className="mr-1.5">Log in</span>
              <div className={`${isAboutPage ? 'bg-gray-200' : 'bg-black'} rounded-full p-1 flex items-center justify-center ml-auto`}>
                <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                  <ArrowRight size={12} stroke={isAboutPage ? 'black' : 'white'} strokeWidth={2} />
                </div>
              </div>
            </div>
          </Link>

          <Link href="/signup" className="flex-1">
            <div className={`group inline-flex items-center justify-center py-2 pl-4 pr-3 rounded-full ${isAboutPage ? 'bg-white text-[#060a0d] hover:bg-gray-100' : 'bg-black text-white hover:bg-black/90'} transition-all font-bricolage text-sm w-full`}>
              <span className="mr-1.5">Sign up</span>
              <div className={`${isAboutPage ? 'bg-[#060a0d]' : 'bg-white'} rounded-full p-1 flex items-center justify-center ml-auto`}>
                <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                  <ArrowRight size={12} stroke={isAboutPage ? 'white' : 'black'} strokeWidth={2} />
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
};

export function MobileSidebar({ isAboutPage = false }: MobileSidebarProps) {
  const [open, setOpen] = useState(false);

  // Update body attribute when sidebar opens/closes
  useEffect(() => {
    if (open) {
      document.body.setAttribute('data-sidebar-open', 'true');
    } else {
      document.body.removeAttribute('data-sidebar-open');
    }
  }, [open]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden mr-3">
        <motion.button 
          aria-label="Open menu" 
          className="p-1 -ml-1 rounded-md transition-colors"
          whileHover={{ 
            backgroundColor: isAboutPage ? '#0c151c' : 'rgb(243, 244, 246)' 
          }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            animate={{ 
              color: isAboutPage ? 'rgb(255, 255, 255)' : 'rgb(31, 41, 55)'
            }}
            transition={{ duration: 0.3 }}
          >
            <Menu size={20} />
          </motion.div>
        </motion.button>
      </SheetTrigger>
      <SheetContent side="left" className={`mobile-sidebar w-[280px] sm:w-[350px] overflow-y-auto p-0 rounded-tr-2xl rounded-br-2xl ${isAboutPage ? 'bg-[#0e1419] border-r-gray-800' : 'bg-white'}`}>
        <div className="flex justify-between items-center py-3 px-5 mb-1">
          <Link href="/" aria-label="UrbanIQ Home" className="hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill={isAboutPage ? "#FFFFFF" : "#000000"} viewBox="0 0 256 256">
              <path d="M96,140a12,12,0,1,1-12-12A12,12,0,0,1,96,140Zm76-12a12,12,0,1,0,12,12A12,12,0,0,0,172,128Zm60-80v88c0,52.93-46.65,96-104,96S24,188.93,24,136V48A16,16,0,0,1,51.31,36.69c.14.14.26.27.38.41L69,57a111.22,111.22,0,0,1,118.1,0L204.31,37.1c.12-.14.24-.27.38-.41A16,16,0,0,1,232,48Zm-16,0-21.56,24.8A8,8,0,0,1,183.63,74,88.86,88.86,0,0,0,168,64.75V88a8,8,0,1,1-16,0V59.05a97.43,97.43,0,0,0-16-2.72V88a8,8,0,1,1-16,0V56.33a97.43,97.43,0,0,0-16,2.72V88a8,8,0,1,1-16,0V64.75A88.86,88.86,0,0,0,72.37,74a8,8,0,0,1-10.81-1.17L40,48v88c0,41.66,35.21,76,80,79.67V195.31l-13.66-13.66a8,8,0,0,1,11.32-11.31L128,180.68l10.34-10.34a8,8,0,0,1,11.32,11.31L136,195.31v20.36c44.79-3.69,80-38,80-79.67Z"></path>
            </svg>
          </Link>
          <SheetTitle className={`sr-only ${isAboutPage ? 'text-white' : ''}`}>Navigation Menu</SheetTitle>
        </div>
        <div className="px-5 py-1">
          <MobileMenuLinks isAboutPage={isAboutPage} />
        </div>
      </SheetContent>
    </Sheet>
  );
} 