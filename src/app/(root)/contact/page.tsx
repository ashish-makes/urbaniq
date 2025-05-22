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
        <section className="py-12 bg-black border-b border-gray-800">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="font-bold text-3xl md:text-4xl mb-4 text-center text-white">
              Contact Us
            </h1>
            <p className="text-gray-300 text-center max-w-2xl mx-auto">
              Have questions or need assistance? We're here to help with your UrbanIQ products.
            </p>
          </div>
        </section>

        {/* Contact Grid Section */}
        <section id="contact-form" className="py-12 md:py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid md:grid-cols-2 gap-12 items-start">
              {/* Contact Form */}
              <div>
                <h2 className="font-semibold text-xl md:text-2xl mb-6">Send a Message</h2>
                <ContactForm />
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="font-semibold text-xl md:text-2xl mb-6">Contact Information</h2>
                <div className="space-y-6 mb-8">
                  <div className="flex items-start">
                    <div className="p-2 mr-4">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Email</h3>
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
                      <h3 className="font-medium mb-1">Phone</h3>
                      <a 
                        href="tel:+15551234567" 
                        className="text-gray-600 hover:text-black transition-colors block"
                      >
                        +1 (555) 123-4567
                      </a>
                      <p className="text-gray-500 text-sm">Mon-Fri: 9am - 5pm PST</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 mr-4">
                      <MapPin className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Location</h3>
                      <p className="text-gray-600">123 Innovation Drive</p>
                      <p className="text-gray-600">San Francisco, CA 94107</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="p-2 mr-4">
                      <Clock className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Office Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9am - 5pm PST</p>
                      <p className="text-gray-600">Saturday - Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="border-t border-gray-100 pt-6">
                  <h3 className="font-medium mb-4">Connect With Us</h3>
                  <div className="flex gap-4">
                    <a 
                      href="https://www.facebook.com/urbaniq" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Follow us on Facebook"
                      className="text-gray-400 hover:text-black transition-colors"
                    >
                      <Facebook size={20} />
                    </a>
                    <a 
                      href="https://www.twitter.com/urbaniq" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Follow us on X (formerly Twitter)"
                      className="text-gray-400 hover:text-black transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                      </svg>
                    </a>
                    <a 
                      href="https://www.instagram.com/urbaniq" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Follow us on Instagram"
                      className="text-gray-400 hover:text-black transition-colors"
                    >
                      <Instagram size={20} />
                    </a>
                    <a 
                      href="https://www.linkedin.com/urbaniq" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      aria-label="Follow us on LinkedIn"
                      className="text-gray-400 hover:text-black transition-colors"
                    >
                      <Linkedin size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section - Simplified */}
        <section className="h-80">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d201064.44927021432!2d-122.57640750672577!3d37.7576171876848!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA%2C%20USA!5e0!3m2!1sen!2s!4v1651234567890!5m2!1sen!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            aria-label="Map showing UrbanIQ office location in San Francisco"
          ></iframe>
        </section>
      </main>
      <Footer />
    </div>
  );
} 