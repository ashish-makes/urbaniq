"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion, AnimatePresence } from "framer-motion";

// Regular menu link for subcategories with animation
const MenuLink = ({ href, children, index }: { href: string; children: React.ReactNode; index: number }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.2, delay: index * 0.05 }}
  >
    <Link 
      href={href} 
      className="block py-2.5 text-sm text-gray-700 hover:text-black transition-colors hover:pl-1 duration-200 ease-in-out"
    >
      {children}
    </Link>
  </motion.div>
);

// Mobile menu links component with accordion categories
const MobileMenuLinks = () => {
  return (
    <div className="flex flex-col">
      <Accordion 
        type="multiple" 
        className="pt-2 w-full [&_[data-state]]:border-none [&>div]:border-b-0 [&_button]:border-b-0"
      >
        <AccordionItem value="dogs" className="!border-none">
          <AccordionTrigger className="py-3.5 text-base font-medium hover:no-underline !border-b-0">Dogs</AccordionTrigger>
          <AccordionContent className="pb-2">
            <AnimatePresence>
              <div className="flex flex-col gap-1 pl-2">
                <MenuLink href="/dogs/tech-essentials" index={0}>Smart Tech Essentials</MenuLink>
                <MenuLink href="/dogs/activity-trackers" index={1}>Activity Trackers</MenuLink>
                <MenuLink href="/dogs/feeding" index={2}>Smart Feeding Solutions</MenuLink>
                <MenuLink href="/dogs/toys" index={3}>Interactive Toys</MenuLink>
                <MenuLink href="/dogs/all" index={4}>All Dog Products</MenuLink>
              </div>
            </AnimatePresence>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="cats" className="!border-none">
          <AccordionTrigger className="py-3.5 text-base font-medium hover:no-underline !border-b-0">Cats</AccordionTrigger>
          <AccordionContent className="pb-2">
            <AnimatePresence>
              <div className="flex flex-col gap-1 pl-2">
                <MenuLink href="/cats/tech-essentials" index={0}>Smart Tech Essentials</MenuLink>
                <MenuLink href="/cats/activity-trackers" index={1}>Activity Trackers</MenuLink>
                <MenuLink href="/cats/litter" index={2}>Smart Litter Solutions</MenuLink>
                <MenuLink href="/cats/toys" index={3}>Interactive Toys</MenuLink>
                <MenuLink href="/cats/all" index={4}>All Cat Products</MenuLink>
              </div>
            </AnimatePresence>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="smart-home" className="!border-none">
          <AccordionTrigger className="py-3.5 text-base font-medium hover:no-underline !border-b-0">Smart Home</AccordionTrigger>
          <AccordionContent className="pb-2">
            <AnimatePresence>
              <div className="flex flex-col gap-1 pl-2">
                <MenuLink href="/smart-home/feeders" index={0}>Automatic Feeders</MenuLink>
                <MenuLink href="/smart-home/cameras" index={1}>Pet Cameras & Monitors</MenuLink>
                <MenuLink href="/smart-home/doors" index={2}>Smart Pet Doors</MenuLink>
                <MenuLink href="/smart-home/accessories" index={3}>Smart Accessories</MenuLink>
                <MenuLink href="/smart-home/all" index={4}>All Smart Home</MenuLink>
              </div>
            </AnimatePresence>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Link href="/deals" className="flex items-center justify-between py-4 text-base font-medium text-gray-800 hover:text-black transition-colors group">
        <span>Deals & Bundles</span>
        <ArrowRight size={16} className="text-gray-400 group-hover:-rotate-45 transition-transform duration-300 ease-in-out" />
      </Link>

      <Link href="/new" className="flex items-center justify-between py-4 text-base font-medium text-gray-800 hover:text-black transition-colors group">
        <span>New Arrivals</span>
        <ArrowRight size={16} className="text-gray-400 group-hover:-rotate-45 transition-transform duration-300 ease-in-out" />
      </Link>
      
      <div className="pt-10 flex flex-row gap-3">
        <Link href="/login" className="flex-1">
          <div className="group inline-flex items-center justify-center py-2 pl-4 pr-3 rounded-full bg-white text-black border border-gray-200 hover:bg-gray-50 transition-all font-bricolage text-sm w-full">
            <span className="mr-1.5">Log in</span>
            <div className="bg-black rounded-full p-1 flex items-center justify-center ml-auto">
              <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                <ArrowRight size={12} stroke="white" strokeWidth={2} />
              </div>
            </div>
          </div>
        </Link>

        <Link href="/signup" className="flex-1">
          <div className="group inline-flex items-center justify-center py-2 pl-4 pr-3 rounded-full bg-black text-white hover:bg-black/90 transition-all font-bricolage text-sm w-full">
            <span className="mr-1.5">Sign up</span>
            <div className="bg-white rounded-full p-1 flex items-center justify-center ml-auto">
              <div className="w-[12px] h-[12px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                <ArrowRight size={12} stroke="black" strokeWidth={2} />
              </div>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export function MobileSidebar() {
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
        <button aria-label="Open menu" className="p-1 -ml-1 hover:bg-gray-100 rounded-md transition-colors">
          <Menu size={20} />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="mobile-sidebar w-[280px] sm:w-[350px] overflow-y-auto p-0 rounded-tr-2xl rounded-br-2xl">
        <div className="flex justify-between items-center py-3 px-5 mb-1">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#000000" viewBox="0 0 256 256">
              <path d="M96,140a12,12,0,1,1-12-12A12,12,0,0,1,96,140Zm76-12a12,12,0,1,0,12,12A12,12,0,0,0,172,128Zm60-80v88c0,52.93-46.65,96-104,96S24,188.93,24,136V48A16,16,0,0,1,51.31,36.69c.14.14.26.27.38.41L69,57a111.22,111.22,0,0,1,118.1,0L204.31,37.1c.12-.14.24-.27.38-.41A16,16,0,0,1,232,48Zm-16,0-21.56,24.8A8,8,0,0,1,183.63,74,88.86,88.86,0,0,0,168,64.75V88a8,8,0,1,1-16,0V59.05a97.43,97.43,0,0,0-16-2.72V88a8,8,0,1,1-16,0V56.33a97.43,97.43,0,0,0-16,2.72V88a8,8,0,1,1-16,0V64.75A88.86,88.86,0,0,0,72.37,74a8,8,0,0,1-10.81-1.17L40,48v88c0,41.66,35.21,76,80,79.67V195.31l-13.66-13.66a8,8,0,0,1,11.32-11.31L128,180.68l10.34-10.34a8,8,0,0,1,11.32,11.31L136,195.31v20.36c44.79-3.69,80-38,80-79.67Z"></path>
            </svg>
          </Link>
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        </div>
        <div className="px-5 py-1">
          <MobileMenuLinks />
        </div>
      </SheetContent>
    </Sheet>
  );
} 