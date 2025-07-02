'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, Facebook, Instagram, Linkedin } from 'lucide-react';
import ContactForm from './ContactForm';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-[#fafafa] py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-2xl">
              <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                CONTACT US
              </div>
              <h1 className="text-5xl font-light text-gray-900 mb-6 leading-tight">
                Get in touch with our team
              </h1>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Have questions about our smart pet technology or need assistance? 
                We're here to help you find the perfect solution for your needs.
              </p>
              <div className="mt-4">
                <Link href="#contact-form">
                  <div className="group inline-flex items-center justify-center py-2.5 pl-6 pr-4 rounded-full bg-black text-white border border-black hover:bg-gray-900 transition-all font-medium text-sm">
                    <span className="mr-2">Send us a message</span>
                    <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                      <div className="w-[14px] h-[14px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

        {/* Contact Grid Section */}
        <section id="contact-form" className="py-24 bg-white border-t border-gray-100">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-12 gap-16">
              {/* Contact Form */}
              <div className="md:col-span-7">
                <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                  SEND MESSAGE
                </div>
                <h2 className="text-3xl font-light text-gray-900 mb-8">
                  How can we help?
                </h2>
                <ContactForm />
              </div>

              {/* Contact Info */}
              <div className="md:col-span-5">
                <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                  CONTACT INFO
                </div>
                <h2 className="text-3xl font-light text-gray-900 mb-8">
                  Get in touch
                </h2>
                <div className="space-y-8 mb-12">
                  <div className="flex items-start">
                    <div className="p-2 mr-4">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Email</h3>
                      <a 
                        href="mailto:support@urbaniq.com" 
                        className="text-gray-600 hover:text-black transition-colors block"
                      >
                        support@urbaniq.com
                      </a>
                      <a 
                        href="mailto:partnerships@urbaniq.com"
                        className="text-gray-600 hover:text-black transition-colors block"
                      >
                        partnerships@urbaniq.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 mr-4">
                      <Phone className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Phone</h3>
                      <a 
                        href="tel:+15551234567" 
                        className="text-gray-600 hover:text-black transition-colors block"
                      >
                        +1 (555) 123-4567
                      </a>
                      <p className="text-gray-500 text-sm mt-1">Mon-Fri: 9am - 5pm PST</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 mr-4">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Location</h3>
                      <p className="text-gray-600">123 Innovation Drive</p>
                      <p className="text-gray-600">Toronto, ON M5V 2T6</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 mr-4">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Office Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9am - 5pm PST</p>
                      <p className="text-gray-600">Saturday - Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="border-t border-gray-100 pt-8">
                  <h3 className="text-sm uppercase tracking-wider text-gray-500 mb-6">Connect With Us</h3>
                  <div className="flex gap-6">
                    <a 
                      href="https://www.facebook.com/share/1AmLWpsDPL/?mibextid=wwXIfr" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Follow us on Facebook"
                      className="text-gray-400 hover:text-black transition-colors"
                    >
                      <Facebook size={24} />
                    </a>
                    <a 
                      href="https://www.instagram.com/urbaniq_ca/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Follow us on Instagram"
                      className="text-gray-400 hover:text-black transition-colors"
                    >
                      <Instagram size={24} />
                    </a>
                    <a 
                      href="https://www.linkedin.com/urbaniq" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Follow us on LinkedIn"
                      className="text-gray-400 hover:text-black transition-colors"
                    >
                      <Linkedin size={24} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="h-[500px] relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d184552.57289742547!2d-79.51814267070312!3d43.71840349999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d4cb90d7c63ba5%3A0x323555502ab4c477!2sToronto%2C%20ON%2C%20Canada!5e0!3m2!1sen!2s!4v1651234567890!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            aria-label="Map showing UrbanIQ office location in Toronto"
          ></iframe>
        </section>

        {/* Ending CTA Section */}
        <section className="relative bg-black py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="max-w-2xl">
              <div className="text-sm uppercase tracking-wider text-gray-400 mb-4">
                EXPLORE MORE
              </div>
              <h2 className="text-5xl font-light text-white mb-6 leading-tight">
                Discover our smart pet products
              </h2>
              <p className="text-lg text-gray-300 mb-8 leading-relaxed">
                Browse our collection of innovative pet technology solutions designed 
                to make pet care easier and more enjoyable.
              </p>
              <div className="mt-4">
                <Link href="/products">
                  <div className="group inline-flex items-center justify-center py-2.5 pl-6 pr-4 rounded-full bg-white text-black border border-white hover:bg-gray-100 transition-all font-medium text-sm">
                    <span className="mr-2">View all products</span>
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
      <Footer />
    </div>
  );
} 