import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";

export function Footer() {
  // Get current year dynamically
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white pt-16 pb-0 relative overflow-hidden">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand column */}
          <div className="space-y-4">
            <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="#000000" viewBox="0 0 256 256">
              <path d="M96,140a12,12,0,1,1-12-12A12,12,0,0,1,96,140Zm76-12a12,12,0,1,0,12,12A12,12,0,0,0,172,128Zm60-80v88c0,52.93-46.65,96-104,96S24,188.93,24,136V48A16,16,0,0,1,51.31,36.69c.14.14.26.27.38.41L69,57a111.22,111.22,0,0,1,118.1,0L204.31,37.1c.12-.14.24-.27.38-.41A16,16,0,0,1,232,48Zm-16,0-21.56,24.8A8,8,0,0,1,183.63,74,88.86,88.86,0,0,0,168,64.75V88a8,8,0,1,1-16,0V59.05a97.43,97.43,0,0,0-16-2.72V88a8,8,0,1,1-16,0V56.33a97.43,97.43,0,0,0-16,2.72V88a8,8,0,1,1-16,0V64.75A88.86,88.86,0,0,0,72.37,74a8,8,0,0,1-10.81-1.17L40,48v88c0,41.66,35.21,76,80,79.67V195.31l-13.66-13.66a8,8,0,0,1,11.32-11.31L128,180.68l10.34-10.34a8,8,0,0,1,11.32,11.31L136,195.31v20.36c44.79-3.69,80-38,80-79.67Z"></path>
            </svg>
              <span className="ml-2 text-xl font-medium">UrbanIQ</span>
            </div>
            <p className="text-gray-600 text-sm max-w-xs">
              Elevating pet care with smart technology and innovative solutions for modern pet parents.
            </p>
            <div className="flex space-x-4">
              <Link href="/" aria-label="Visit our Facebook page" className="text-gray-500 hover:text-gray-800 transition-colors">
                <Facebook size={18} />
              </Link>
              <Link href="/" aria-label="Visit our Instagram profile" className="text-gray-500 hover:text-gray-800 transition-colors">
                <Instagram size={18} />
              </Link>
              <Link href="/" aria-label="Visit our Twitter profile" className="text-gray-500 hover:text-gray-800 transition-colors">
                <Twitter size={18} />
              </Link>
            </div>
          </div>

          {/* Shop column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm group flex items-center">
                  <span>Smart Feeders</span>
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm group flex items-center">
                  <span>Activity & Play</span>
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm group flex items-center">
                  <span>Health & Fitness</span>
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm group flex items-center">
                  <span>Travel Gear</span>
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm group flex items-center">
                  <span>Bundles</span>
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm group flex items-center">
                  <span>FAQs</span>
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm group flex items-center">
                  <span>Shipping</span>
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm group flex items-center">
                  <span>Returns</span>
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm group flex items-center">
                  <span>Order Tracking</span>
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm group flex items-center">
                  <span>Contact Us</span>
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={18} className="text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
                <span className="text-gray-600 text-sm">123 Innovation Drive, San Francisco, CA 94107</span>
              </li>
              <li className="flex items-center">
                <Phone size={18} className="text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={18} className="text-gray-500 mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm">info@urbaniq.ca</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-500 mb-2">Payment Methods</h4>
              <div className="flex space-x-3">
                <div className="h-8 w-12 bg-white border border-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                  <Image src="/applepay.png" alt="Apple Pay" width={40} height={24} />
                </div>
                <div className="h-8 w-12 bg-white border border-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                  <Image src="/mastercard.png" alt="Mastercard" width={40} height={24} />
                </div>
                <div className="h-8 w-12 bg-white border border-gray-200 rounded-md flex items-center justify-center overflow-hidden">
                  <Image src="/visa.png" alt="Visa" width={40} height={24} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-6 border-t border-gray-200 mt-10 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 mb-4 md:mb-0">© {currentYear} UrbanIQ. All Rights Reserved</p>
            <div className="flex flex-wrap gap-5">
              <Link href="/" className="text-xs text-gray-500 hover:text-gray-900 transition-colors group flex items-center">
                <span>Terms</span>
                <ArrowUpRight size={12} className="ml-0.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
              <Link href="/" className="text-xs text-gray-500 hover:text-gray-900 transition-colors group flex items-center">
                <span>Privacy</span>
                <ArrowUpRight size={12} className="ml-0.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
              <Link href="/" className="text-xs text-gray-500 hover:text-gray-900 transition-colors group flex items-center">
                <span>Cookies</span>
                <ArrowUpRight size={12} className="ml-0.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
              <Link href="/" className="text-xs text-gray-500 hover:text-gray-900 transition-colors group flex items-center">
                <span>Accessibility</span>
                <ArrowUpRight size={12} className="ml-0.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Large watermark text at the bottom */}
      <div className="w-full overflow-hidden h-[16vw] md:h-[20vw] lg:h-[25vw]">
        <h2 className="text-[16vw] md:text-[20vw] lg:text-[20vw] font-bold text-black select-none leading-[0.8] m-0 p-0 w-full text-center lg:pt-[5vw]">
          urbaniq
        </h2>
      </div>
    </footer>
  );
} 