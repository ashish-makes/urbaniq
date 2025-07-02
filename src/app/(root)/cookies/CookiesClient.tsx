'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";

export function CookiesClient() {
  const [activeSection, setActiveSection] = useState('essential');

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 96; // Account for fixed header
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -80% 0px'
      }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <div className="bg-[#fafafa]">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="py-24">
            <div className="max-w-3xl">
              <div className="text-sm uppercase tracking-wider text-gray-500 mb-6">
                LEGAL
              </div>
              <h1 className="text-5xl font-light text-gray-900 mb-8">
                Cookie Policy
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Learn how we use cookies and similar technologies to improve your browsing experience.
              </p>
              <button
                onClick={() => scrollToSection('essential')}
                className="group inline-flex items-center justify-center py-2.5 pl-6 pr-4 rounded-full bg-black text-white hover:bg-gray-900 transition-all font-medium text-sm"
              >
                <span className="mr-2">Read policy</span>
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
      </div>

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
                    { id: 'essential', label: 'Essential Cookies' },
                    { id: 'functional', label: 'Functional Cookies' },
                    { id: 'analytics', label: 'Analytics Cookies' },
                    { id: 'advertising', label: 'Advertising Cookies' },
                    { id: 'social', label: 'Social Media Cookies' },
                    { id: 'management', label: 'Cookie Management' },
                    { id: 'updates', label: 'Policy Updates' },
                    { id: 'contact', label: 'Contact Us' }
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
                <section id="essential" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 1
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Essential Cookies</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      Essential cookies are necessary for the basic functionality of our website. These cookies enable core features such as security, account authentication, and remembering your preferences. Without these cookies, our website cannot function properly.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      These cookies do not store any personally identifiable information and cannot be disabled through our cookie management system. You can set your browser to block these cookies, but some parts of the site may not function correctly.
                    </p>
                  </div>
                </section>

                <section id="functional" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 2
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Functional Cookies</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      Functional cookies enhance your experience by remembering your preferences and choices. They help provide enhanced features like remembering your shopping cart contents, saving your wishlist, and personalizing your experience across our website.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      While these cookies are not essential, disabling them may result in a less personalized experience and require you to re-enter information more frequently.
                    </p>
                  </div>
                </section>

                <section id="analytics" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 3
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Analytics Cookies</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      Analytics cookies help us understand how visitors interact with our website. They collect information about page visits, time spent on site, and navigation patterns. This data helps us improve our website and provide better content and features.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      All information collected by these cookies is aggregated and anonymous. We use services like Google Analytics to process this data and generate insights about website usage.
                    </p>
                  </div>
                </section>

                <section id="advertising" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 4
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Advertising Cookies</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      Advertising cookies are used to deliver relevant advertisements and track the performance of our marketing campaigns. They remember your interests and browsing habits to show you targeted advertisements that match your preferences.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant ads on other sites.
                    </p>
                  </div>
                </section>

                <section id="social" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 5
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Social Media Cookies</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      Social media cookies enable you to share our content on social platforms and interact with our social media features. These cookies may also be used to track your activity across websites and build a profile of your interests.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      These cookies are set by third-party social media services that we have added to our pages. You can disable these cookies through your browser settings or the cookie management system.
                    </p>
                  </div>
                </section>

                <section id="management" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 6
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Cookie Management</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      You can control and manage cookies in various ways. You can modify your browser settings to reject or delete cookies, or use our cookie management system to set your preferences for non-essential cookies.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      Please note that restricting cookies may impact your experience on our website and limit access to certain features. For more information about cookies and how to manage them, visit www.allaboutcookies.org.
                    </p>
                  </div>
                </section>

                <section id="updates" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 7
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Policy Updates</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      We may update this Cookie Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes through our website.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      Your continued use of our website after such modifications constitutes your acknowledgment of the modified Cookie Policy and your agreement to be bound by it.
                    </p>
                  </div>
                </section>

                <section id="contact" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 8
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Contact Us</h2>
                  <div className="bg-[#fafafa] p-8 rounded-2xl">
                    <div className="space-y-3">
                      <p className="text-gray-600">Cookie Policy Inquiries</p>
                      <p className="text-gray-600">UrbanIQ Headquarters</p>
                      <p className="text-gray-600">123 Innovation Drive</p>
                      <p className="text-gray-600">Toronto, ON M5V 2T6</p>
                      <p className="text-gray-600">Canada</p>
                      <p className="text-gray-600 mt-4">Email: privacy@urbaniq.ca</p>
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
      <div className="bg-black text-white">
        <div className="container mx-auto px-4 max-w-6xl py-24">
          <div className="max-w-3xl">
            <h2 className="text-4xl font-light mb-8">
              Questions about our cookie practices?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Our team is here to help you understand how we use cookies to enhance your experience.
            </p>
            <Link href="/contact">
              <div className="group inline-flex items-center justify-center py-2.5 pl-6 pr-4 rounded-full bg-white text-black border border-gray-200 hover:bg-gray-50 transition-all font-medium text-sm">
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
    </main>
  );
} 