'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";

export function PrivacyClient() {
  const [activeSection, setActiveSection] = useState('collection');

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
                Privacy Policy
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                We take your privacy seriously. Learn how we collect, use, and protect your personal information.
              </p>
              <button
                onClick={() => scrollToSection('collection')}
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
                    { id: 'collection', label: 'Information Collection' },
                    { id: 'use', label: 'Use of Information' },
                    { id: 'sharing', label: 'Information Sharing' },
                    { id: 'security', label: 'Data Security' },
                    { id: 'cookies', label: 'Cookies & Tracking' },
                    { id: 'rights', label: 'Your Rights' },
                    { id: 'children', label: 'Children\'s Privacy' },
                    { id: 'changes', label: 'Changes to Policy' },
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
                <section id="collection" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 1
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Information Collection</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      We collect various types of information to provide and improve our services. This includes information you provide directly, such as your name, email address, and billing information when creating an account or making a purchase, as well as information about your pet when using our smart devices.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      Our smart devices may collect data about your pet's behavior, feeding patterns, activity levels, and other metrics to provide you with insights and improve our services. We also automatically collect certain information about your device and how you interact with our services.
                    </p>
                  </div>
                </section>

                <section id="use" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 2
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Use of Information</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      We use the collected information to provide, maintain, and improve our services, including personalizing your experience, processing your transactions, and sending you important updates. Your pet's data helps us develop insights and recommendations for better pet care.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      We may also use your information to communicate with you about our services, send you marketing communications (subject to your preferences), and to detect and prevent fraud or other harmful activities.
                    </p>
                  </div>
                </section>

                <section id="sharing" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 3
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Information Sharing</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      We do not sell your personal information to third parties. We may share your information with service providers who assist us in operating our services, processing payments, analyzing data, and providing customer support. These partners are bound by strict confidentiality agreements.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      We may also share information when required by law, to protect our rights, or with your consent. Any shared data is protected through appropriate contractual, organizational, and technical safeguards.
                    </p>
                  </div>
                </section>

                <section id="security" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 4
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Data Security</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure socket layer technology, and regular security assessments.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      While we strive to protect your information, no method of transmission over the Internet or electronic storage is 100% secure. We continuously update our security practices to provide the best possible protection for your data.
                    </p>
                  </div>
                </section>

                <section id="cookies" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 5
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Cookies & Tracking</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      We use cookies and similar tracking technologies to enhance your experience on our website. These tools help us understand how you use our services, remember your preferences, and provide personalized content and advertisements.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      You can control cookie preferences through your browser settings. Please note that disabling certain cookies may limit your ability to use some features of our services. For more information about our use of cookies, please visit our Cookie Policy.
                    </p>
                  </div>
                </section>

                <section id="rights" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 6
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Your Rights</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      You have the right to access, correct, or delete your personal information. You can also request a copy of your data, restrict its processing, or object to certain uses. We will respond to your requests within the timeframe specified by applicable law.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      To exercise your rights or update your preferences, you can access your account settings or contact our privacy team. We will make reasonable efforts to fulfill your request, subject to legal and operational requirements.
                    </p>
                  </div>
                </section>

                <section id="children" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 7
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Children's Privacy</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected information from a child, please contact us immediately.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      Parents or guardians who believe their child has submitted personal information should contact us to request deletion. We will take steps to verify the requestor's identity and relationship to the child before processing such requests.
                    </p>
                  </div>
                </section>

                <section id="changes" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 8
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Changes to Policy</h2>
                  <div className="prose prose-gray max-w-none">
                    <p className="text-gray-600 leading-relaxed">
                      We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes through our website or email before they become effective.
                    </p>
                    <p className="text-gray-600 leading-relaxed mt-4">
                      Your continued use of our services after such modifications constitutes your acknowledgment of the modified Privacy Policy and your agreement to abide and be bound by it.
                    </p>
                  </div>
                </section>

                <section id="contact" className="scroll-mt-24">
                  <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                    SECTION 9
                  </div>
                  <h2 className="text-3xl font-light text-gray-900 mb-6">Contact Us</h2>
                  <div className="bg-[#fafafa] p-8 rounded-2xl">
                    <div className="space-y-3">
                      <p className="text-gray-600">Privacy Officer</p>
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
              Have questions about our privacy practices?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Our support team is here to help you understand how we protect your data and answer any privacy-related questions.
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