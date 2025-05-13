import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, Phone, MapPin, Clock, MessageSquare } from 'lucide-react';
import ContactForm from './ContactForm';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Contact UrbanIQ | Get Support & Connect With Us',
  description: 'Have questions about UrbanIQ pet tech products? Contact our support team for assistance or inquire about partnerships and wholesale opportunities.',
  keywords: 'contact UrbanIQ, pet tech support, UrbanIQ customer service, pet technology help, contact form, tech support',
  openGraph: {
    title: 'Contact UrbanIQ Pet Tech',
    description: 'Have questions about UrbanIQ pet tech products? Contact our support team for assistance or inquire about partnerships and wholesale opportunities.',
    url: 'https://urbaniq.vercel.app/contact',
    siteName: 'UrbanIQ Pet Tech',
    images: [
      {
        url: '/images/contact-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'UrbanIQ Contact',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact UrbanIQ Pet Tech',
    description: 'Have questions about UrbanIQ pet tech products? Contact our support team for assistance or inquire about partnerships and wholesale opportunities.',
    images: ['/images/contact-og-image.jpg'],
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gray-50 py-12 md:py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            <h1 className="font-bold text-4xl md:text-5xl mb-6 text-center">Get in Touch</h1>
            <p className="text-lg md:text-xl text-gray-700 text-center max-w-2xl mx-auto mb-8">
              Have questions about our products or need support? We're here to help you and your pets.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="#support"
                className="px-6 py-2.5 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                Customer Support
              </Link>
              <Link 
                href="#business"
                className="px-6 py-2.5 border border-black text-black font-medium rounded-full hover:bg-gray-100 transition-colors"
              >
                Business Inquiries
              </Link>
            </div>
          </div>
        </section>

        {/* Contact Grid Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
              {/* Contact Form */}
              <div>
                <h2 className="font-bold text-2xl md:text-3xl mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="font-bold text-2xl md:text-3xl mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-gray-100 p-2 rounded-full mr-4">
                      <Mail className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Email</h3>
                      <p className="text-gray-700">support@urbaniq.com</p>
                      <p className="text-gray-700">partnerships@urbaniq.com</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-gray-100 p-2 rounded-full mr-4">
                      <Phone className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Phone</h3>
                      <p className="text-gray-700">+1 (555) 123-4567</p>
                      <p className="text-gray-500 text-sm">Mon-Fri: 9am - 5pm PST</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-gray-100 p-2 rounded-full mr-4">
                      <MapPin className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Location</h3>
                      <p className="text-gray-700">123 Innovation Drive</p>
                      <p className="text-gray-700">San Francisco, CA 94107</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="bg-gray-100 p-2 rounded-full mr-4">
                      <Clock className="h-5 w-5 text-gray-700" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg mb-1">Office Hours</h3>
                      <p className="text-gray-700">Monday - Friday: 9am - 5pm PST</p>
                      <p className="text-gray-700">Saturday - Sunday: Closed</p>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div className="mt-10">
                  <h3 className="font-medium text-lg mb-4">Connect With Us</h3>
                  <div className="flex gap-4">
                    {['facebook', 'twitter', 'instagram', 'linkedin'].map((platform) => (
                      <a 
                        key={platform}
                        href={`https://www.${platform}.com/urbaniq`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`Follow us on ${platform}`}
                        className="bg-gray-100 p-3 rounded-full hover:bg-gray-200 transition-colors"
                      >
                        <Image 
                          src={`/icons/${platform}.svg`} 
                          alt={platform} 
                          width={20} 
                          height={20}
                        />
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Support Section */}
        <section id="support" className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-col md:flex-row md:items-center gap-8">
              <div className="md:w-1/3">
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image 
                    src="/images/customer-support.jpg"
                    alt="UrbanIQ customer support"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="font-bold text-3xl md:text-4xl mb-4">Customer Support</h2>
                <p className="text-gray-700 mb-4">
                  Our dedicated support team is here to help you with any questions or issues you might have with your UrbanIQ products.
                </p>
                <div className="flex gap-4 items-center">
                  <Link
                    href="#"
                    className="inline-flex items-center px-5 py-2.5 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
                  >
                    <MessageSquare className="mr-2 h-5 w-5" />
                    Live Chat
                  </Link>
                  <Link
                    href="/faq"
                    className="text-black font-medium hover:underline"
                  >
                    View FAQs
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Business Inquiries Section */}
        <section id="business" className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="flex flex-col md:flex-row-reverse md:items-center gap-8">
              <div className="md:w-1/3">
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image 
                    src="/images/business-partnerships.jpg"
                    alt="UrbanIQ business partnerships"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <h2 className="font-bold text-3xl md:text-4xl mb-4">Business Inquiries</h2>
                <p className="text-gray-700 mb-6">
                  Interested in partnering with UrbanIQ? We're always looking for collaborations with pet stores, veterinarians, and other businesses in the pet industry.
                </p>
                <Link
                  href="mailto:partnerships@urbaniq.com"
                  className="inline-flex items-center px-5 py-2.5 bg-black text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
                >
                  <Mail className="mr-2 h-5 w-5" />
                  Email Our Partnership Team
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="h-96 relative">
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

        {/* Add JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ContactPage",
              "name": "Contact UrbanIQ Pet Tech",
              "description": "Contact UrbanIQ for product support, business inquiries, or general questions about our pet technology products.",
              "publisher": {
                "@type": "Organization",
                "name": "UrbanIQ Pet Tech",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://urbaniq.vercel.app/logo.png"
                }
              },
              "mainEntity": {
                "@type": "Organization",
                "name": "UrbanIQ Pet Tech",
                "telephone": "+1-555-123-4567",
                "email": "support@urbaniq.com",
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": "123 Innovation Drive",
                  "addressLocality": "San Francisco",
                  "addressRegion": "CA",
                  "postalCode": "94107",
                  "addressCountry": "US"
                },
                "openingHours": "Mo,Tu,We,Th,Fr 09:00-17:00",
                "contactPoint": [
                  {
                    "@type": "ContactPoint",
                    "contactType": "customer service",
                    "telephone": "+1-555-123-4567",
                    "email": "support@urbaniq.com",
                    "availableLanguage": "English"
                  },
                  {
                    "@type": "ContactPoint",
                    "contactType": "business development",
                    "telephone": "+1-555-123-4567",
                    "email": "partnerships@urbaniq.com",
                    "availableLanguage": "English"
                  }
                ]
              }
            })
          }}
        />
      </main>
      <Footer />
    </div>
  );
} 