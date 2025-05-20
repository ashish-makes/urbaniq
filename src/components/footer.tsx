import Link from "next/link";
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone, ArrowUpRight } from "lucide-react";

export function Footer() {
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
                <span className="text-gray-600 text-sm">support@urbanpaws.com</span>
              </li>
            </ul>
            <div className="mt-4">
              <h4 className="text-xs font-medium text-gray-500 mb-2">Payment Methods</h4>
              <div className="flex space-x-2">
                <div className="h-8 w-12 bg-white border border-gray-200 rounded-md flex items-center justify-center">
                  <svg viewBox="0 0 32 21" width="28" height="18" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><g fillRule="nonzero"><rect fill="#252525" width="32" height="21" rx="2"/><path d="M11.66 7.177c0-.82.58-1.24 1.693-1.24.92 0 1.874.267 2.755.76V4.62c-.92-.427-1.853-.64-2.755-.64-2.262 0-3.839 1.133-3.839 3.29 0 3.944 5.404 3.304 5.404 5.011 0 .854-.72 1.284-1.873 1.284-1.06 0-2.182-.437-3.162-1.07v2.116c1.06.541 2.14.82 3.162.82 2.342 0 4.059-1.112 4.059-3.29-.04-4.244-5.444-3.517-5.444-4.965zm10.2-3.09h-2.06v8.302c0 1.261.501 2.137 2.08 2.137.673 0 1.194-.097 1.612-.274v-1.777c-.307.11-.818.179-1.156.179-.557 0-.78-.296-.78-.895v-2.66h1.957V7.156h-1.653V4.086zm-23.203.82v7.974h2.16V4.907h-2.16zm12.705 0l-2.14 5.17-2.14-5.17h-2.32l3.31 7.533-.098 2.062c-.105.427-.334.555-.88.555-.213 0-.507-.02-.696-.04v1.736c.313.04.626.06.96.06 1.854 0 2.814-.854 3.44-3.03L18.87 4.906h-2.302z" fill="#FFF"/></g></g></svg>
                </div>
                <div className="h-8 w-12 bg-white border border-gray-200 rounded-md flex items-center justify-center">
                  <svg viewBox="0 0 32 21" width="28" height="18" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><g fillRule="nonzero"><rect fill="#252525" width="32" height="21" rx="2"/><rect fill="#FF5F00" x="11.5" y="6.5" width="9" height="8"/><path d="M12.801 10.5a5.052 5.052 0 0 1 1.94-4A5.08 5.08 0 0 0 11 5a5.08 5.08 0 0 0-5 5.142 5.08 5.08 0 0 0 5 5.142 5.08 5.08 0 0 0 3.74-1.5 5.052 5.052 0 0 1-1.94-4z" fill="#EB001B"/><path d="M23 10.5a5.08 5.08 0 0 1-5 5.142 5.08 5.08 0 0 1-3.74-1.5 5.052 5.052 0 0 0 0-8 5.08 5.08 0 0 1 3.74-1.5A5.08 5.08 0 0 1 23 10.5z" fill="#F79E1B"/></g></g></svg>
                </div>
                <div className="h-8 w-12 bg-white border border-gray-200 rounded-md flex items-center justify-center">
                  <svg viewBox="0 0 32 21" width="28" height="18" xmlns="http://www.w3.org/2000/svg"><g fill="none" fillRule="evenodd"><g fillRule="nonzero"><rect fill="#252525" width="32" height="21" rx="2"/><path d="M15.51 12.27c.06-.78-.18-1.56-.69-2.1-.51-.54-1.23-.9-2.04-.96h-.03c-.03 0-.06-.03-.06-.06v-.96c0-.03.03-.06.06-.06h.15c.81-.06 1.53-.39 2.01-.9a2.73 2.73 0 0 0 .72-2.01 3.4 3.4 0 0 0-2.55-3.15.06.06 0 0 1-.03-.06V2a.06.06 0 0 1 .06-.06h1.5c.03 0 .06.03.06.06v.06c1.44.27 2.61 1.29 3.06 2.67.24.69.24 1.44.06 2.13a3.036 3.036 0 0 1-.96 1.56c-.06.03-.09.09-.03.15.18.21.33.42.45.66.33.72.42 1.53.24 2.31a3.693 3.693 0 0 1-1.49 2.24c-.66.42-1.44.63-2.22.63h-1.35a.06.06 0 0 1-.06-.06v-.06a.06.06 0 0 1 .03-.06 3.03 3.03 0 0 0 2.16-2.01zm-6.57 2.13h-1.5a.06.06 0 0 1-.06-.06V2a.06.06 0 0 1 .06-.06h1.5c.03 0 .06.03.06.06v12.33a.06.06 0 0 1-.06.06zm17.74-3.04c-.03 0-.06-.02-.08-.05L23.87 2c-.02-.03 0-.07.04-.07h1.79c.03 0 .05.02.06.04l1.72 5.73c.01.02.03.02.04 0l1.72-5.73a.06.06 0 0 1 .06-.04h1.79c.04 0 .06.04.04.07l-2.73 9.31a.7.07 0 0 1-.07.05h-1.85zm-5.58 0a.06.06 0 0 1-.06-.06V2c0-.03.03-.06.06-.06h1.5c.03 0 .06.03.06.06v9.29a.06.06 0 0 1-.06.06h-1.5z" fill="#FFF"/></g></g></svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="pt-6 border-t border-gray-200 mt-10 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 mb-4 md:mb-0">© 2023 UrbanPaws. All Rights Reserved</p>
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