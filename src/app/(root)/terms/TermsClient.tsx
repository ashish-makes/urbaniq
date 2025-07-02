'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";

export function TermsClient() {
  const [activeSection, setActiveSection] = useState('agreement');

  // Handle scroll and highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('section[id]');
      const scrollPosition = window.scrollY + 100;

      sections.forEach((section) => {
        if (section instanceof HTMLElement) {
          const sectionTop = section.offsetTop;
          const sectionHeight = section.offsetHeight;
          
          if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            setActiveSection(section.id);
          }
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Adjust for header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative bg-[#fafafa] py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-2xl">
            <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
              LEGAL
            </div>
            <h1 className="text-5xl font-light text-gray-900 mb-6 leading-tight">
              Terms and Conditions
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Please read these terms carefully before using our services. These terms outline 
              your rights and responsibilities when using UrbanIQ products and services.
            </p>
            <div className="mt-4">
              <button
                onClick={() => scrollToSection('agreement')}
                className="group inline-flex items-center justify-center py-2.5 pl-6 pr-4 rounded-full bg-black text-white border border-black hover:bg-gray-900 transition-all font-medium text-sm"
              >
                <span className="mr-2">Read terms</span>
                <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                  <div className="w-[14px] h-[14px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section with Table of Contents */}
      <div className="border-t border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl py-24">
          <div className="flex flex-col md:flex-row gap-16">
            {/* Table of Contents - Left Sidebar */}
            <aside className="md:w-72 flex-shrink-0">
              <div className="sticky top-8">
                <div className="text-sm uppercase tracking-wider text-gray-500 mb-6">
                  ON THIS PAGE
                </div>
                <nav className="flex flex-col space-y-2">
                  {[
                    { id: 'agreement', label: 'Agreement to Terms' },
                    { id: 'products', label: 'Products & Services' },
                    { id: 'accounts', label: 'User Accounts' },
                    { id: 'privacy', label: 'Privacy Policy' },
                    { id: 'payment', label: 'Payment Terms' },
                    { id: 'shipping', label: 'Shipping & Returns' },
                    { id: 'intellectual', label: 'Intellectual Property' },
                    { id: 'contact', label: 'Contact Information' }
                  ].map(({ id, label }) => (
                    <button
                      key={id}
                      onClick={() => scrollToSection(id)}
                      className={`text-left px-4 py-2 text-sm transition-colors ${
                          activeSection === id
                            ? 'text-black font-semibold'
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      {label}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content - Right Side */}
            <div className="flex-grow max-w-3xl">
              <div className="space-y-16">
                <section id="agreement" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 1
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Agreement to Terms</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      By accessing and using UrbanIQ's website and services, you agree to be bound by these Terms and Conditions. These terms constitute a legally binding agreement between you and UrbanIQ regarding your use of our smart pet technology products and services.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      If you disagree with any part of these terms, you may not access our services. We reserve the right to modify these terms at any time, and your continued use of our services following any changes constitutes your acceptance of the modified terms.
                    </p>
                  </div>
                </section>

                <section id="products" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 2
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Products and Services</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      UrbanIQ provides innovative smart pet technology products and services designed to enhance the lives of pets and their owners. Our product offerings include smart feeders, pet cameras, interactive toys, and other connected devices.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      All product descriptions, specifications, and prices are subject to change without notice. While we strive to provide accurate product information, we do not warrant that product descriptions or other content is accurate, complete, or current.
                    </p>
                  </div>
                </section>

                <section id="accounts" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 3
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">User Accounts</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      When creating an account with UrbanIQ, you must provide accurate and complete information. You are responsible for maintaining the security of your account credentials and for all activities that occur under your account.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      We reserve the right to suspend or terminate accounts that violate our terms or policies, or if we suspect unauthorized or fraudulent use of our services.
                    </p>
                  </div>
                </section>

                <section id="privacy" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 4
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Privacy Policy</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information when you use our services. By using UrbanIQ products and services, you consent to the data practices described in our Privacy Policy.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      We implement various security measures to maintain the safety of your personal information and ensure it is used only as described in our Privacy Policy.
                    </p>
                  </div>
                </section>

                <section id="payment" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 5
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Payment Terms</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      All prices are listed in Canadian Dollars (CAD) unless otherwise specified. We accept major credit cards, debit cards, and other payment methods as indicated during checkout. Payment must be made through our approved payment methods.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      We use secure payment processing services to protect your financial information. Your payment information is encrypted and handled according to industry standards.
                    </p>
                  </div>
                </section>

                <section id="shipping" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 6
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Shipping and Returns</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      We ship to addresses within Canada and select international locations. Orders are typically processed within 1-2 business days. Shipping times and costs vary based on location and selected shipping method.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      Our return policy allows for returns within 30 days of purchase for unused products in original packaging. Defective items can be returned within 90 days of purchase for replacement or refund.
                    </p>
                  </div>
                </section>

                <section id="intellectual" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 7
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Intellectual Property</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      All content on the UrbanIQ website and mobile applications, including text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of UrbanIQ or its content suppliers.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      This content is protected by Canadian and international copyright, trademark, patent, trade secret, and other intellectual property laws.
                    </p>
                  </div>
                </section>

                <section id="contact" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 8
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Contact Information</h2>
                  <div className="bg-[#fafafa] p-8 rounded-2xl">
                    <div className="space-y-3">
                      <p className="text-gray-600">UrbanIQ Headquarters</p>
                      <p className="text-gray-600">123 Innovation Drive</p>
                      <p className="text-gray-600">Toronto, ON M5V 2T6</p>
                      <p className="text-gray-600">Canada</p>
                      <p className="text-gray-600 mt-4">Email: legal@urbaniq.ca</p>
                      <p className="text-gray-600">Phone: +1 (555) 123-4567</p>
                    </div>
                  </div>
                </section>

                <div className="border-t border-gray-100 pt-8">
                  <p className="text-gray-500 text-sm">
                    Last updated: {new Date().toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ending CTA Section */}
      <section className="relative bg-black py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-2xl">
            <div className="text-sm uppercase tracking-wider text-gray-400 mb-4">
              NEED HELP?
            </div>
            <h2 className="text-5xl font-light text-white mb-6 leading-tight">
              Have questions about our terms?
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Our support team is here to help you understand our policies and answer 
              any questions you may have about our terms and conditions.
            </p>
            <div className="mt-4">
              <Link href="/contact">
                <div className="group inline-flex items-center justify-center py-2.5 pl-6 pr-4 rounded-full bg-white text-black border border-white hover:bg-gray-100 transition-all font-medium text-sm">
                  <span className="mr-2">Contact our team</span>
                  <div className="bg-black rounded-full p-1.5 flex items-center justify-center">
                    <div className="w-[14px] h-[14px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 