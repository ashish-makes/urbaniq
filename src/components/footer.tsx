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
              <div className="flex flex-col items-center">
                <div className="w-20 h-20">
                  <Image 
                    src="/urbaniq-logo.png"
                    alt="UrbanIQ Logo"
                    width={80}
                    height={80}
                    className="w-full h-full object-contain"
                    priority
                  />
                </div>
                <span className="mt-2 text-xl font-medium">UrbanIQ</span>
              </div>
            <p className="text-gray-600 text-sm max-w-xs">
              Elevating pet care with smart technology and innovative solutions for modern pet parents.
            </p>
            <div className="flex space-x-4">
              <Link
                href="https://www.facebook.com/share/1AmLWpsDPL/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="https://www.instagram.com/urbaniq_ca/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="https://twitter.com/urbaniq"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-800 transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          {/* Shop column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-600 hover:text-gray-900 text-sm group flex items-center">
                  <span>All products</span>
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/products/category/cameras" className="text-gray-600 hover:text-gray-900 text-sm group flex items-center">
                  <span>Cameras</span>
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              <li>
                <Link href="/products/category/smart-feeders" className="text-gray-600 hover:text-gray-900 text-sm group flex items-center">
                  <span>Smart Feeders</span>
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              {/* <li>
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
              </li> */}
            </ul>
          </div>

          {/* Support column */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-500 mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faqs" className="text-gray-600 hover:text-gray-900 text-sm group flex items-center">
                  <span>FAQs</span>
                  <ArrowUpRight size={14} className="ml-1 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </Link>
              </li>
              {/* <li>
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
              </li> */}
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-900 text-sm group flex items-center">
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
                <span className="text-gray-600 text-sm">123 Innovation Drive, Toronto, ON M5V 2T6</span>
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
              <Link href="/terms" className="text-xs text-gray-500 hover:text-gray-900 transition-colors group flex items-center">
                <span>Terms</span>
                <ArrowUpRight size={12} className="ml-0.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
              <Link href="/privacy" className="text-xs text-gray-500 hover:text-gray-900 transition-colors group flex items-center">
                <span>Privacy</span>
                <ArrowUpRight size={12} className="ml-0.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
              <Link href="/cookies" className="text-xs text-gray-500 hover:text-gray-900 transition-colors group flex items-center">
                <span>Cookies</span>
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