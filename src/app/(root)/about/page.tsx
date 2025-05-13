import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'About UrbanIQ | Smart Pet Technology for Modern Pet Owners',
  description: 'Learn about UrbanIQ\'s mission to revolutionize pet care through innovative smart technology solutions designed for modern urban pet owners.',
  keywords: 'pet technology, smart pet devices, UrbanIQ, pet innovation, pet care technology, about us, pet tech company',
  openGraph: {
    title: 'About UrbanIQ | Smart Pet Technology for Modern Pet Owners',
    description: 'Learn about UrbanIQ\'s mission to revolutionize pet care through innovative smart technology solutions designed for modern urban pet owners.',
    url: 'https://urbaniq.vercel.app/about',
    siteName: 'UrbanIQ Pet Tech',
    images: [
      {
        url: '/images/about-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'UrbanIQ - Smart Pet Technology',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About UrbanIQ | Smart Pet Technology for Modern Pet Owners',
    description: 'Learn about UrbanIQ\'s mission to revolutionize pet care through innovative smart technology solutions designed for modern urban pet owners.',
    images: ['/images/about-og-image.jpg'],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-black text-white py-24 md:py-32">
          <div className="absolute inset-0 opacity-50">
            <Image
              src="/images/about-hero.jpg"
              alt="Urban pet tech"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="container mx-auto px-4 relative z-10 max-w-4xl">
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl mb-6">Revolutionizing Pet Care for Urban Life</h1>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl">
              We build intelligent pet technology that adapts to the unique challenges of modern urban living
            </p>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-bold text-3xl md:text-4xl mb-8">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="mb-4 text-gray-700">
                  UrbanIQ was born in 2020 when our founder, a pet owner living in a small apartment, struggled with monitoring and caring for her dog while working long hours.
                </p>
                <p className="mb-4 text-gray-700">
                  The available pet tech solutions weren't designed with urban constraints in mind — limited space, noise concerns, and the unique needs of pets in city environments.
                </p>
                <p className="text-gray-700">
                  That's when we set out to create smart, space-efficient pet technology that understands both pets and their urban-dwelling owners.
                </p>
              </div>
              <div className="relative h-80 rounded-lg overflow-hidden">
                <Image
                  src="/images/founder-story.jpg"
                  alt="UrbanIQ founder with her dog"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Mission & Values */}
        <section className="py-16 md:py-24 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-bold text-3xl md:text-4xl mb-12 text-center">Our Mission & Values</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-xl mb-3">Innovation</h3>
                <p className="text-gray-700">
                  We constantly push the boundaries of what pet technology can do, combining cutting-edge AI with thoughtful design.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-xl mb-3">Pet Wellbeing</h3>
                <p className="text-gray-700">
                  Everything we create starts with the question: "How will this improve the lives of pets and their owners?"
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="font-bold text-xl mb-3">Sustainability</h3>
                <p className="text-gray-700">
                  We're committed to creating products that are environmentally responsible and built to last.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-bold text-3xl md:text-4xl mb-12 text-center">Meet Our Team</h2>
            
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { name: "Emily Chen", role: "Founder & CEO", image: "/images/team/emily.jpg" },
                { name: "Marcus Torres", role: "CTO", image: "/images/team/marcus.jpg" },
                { name: "Aisha Johnson", role: "Head of Design", image: "/images/team/aisha.jpg" },
                { name: "David Park", role: "Lead Engineer", image: "/images/team/david.jpg" },
              ].map((member, index) => (
                <div key={index} className="text-center">
                  <div className="relative w-48 h-48 mx-auto rounded-full overflow-hidden mb-4">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-gray-600">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-black text-white">
          <div className="container mx-auto px-4 max-w-4xl text-center">
            <h2 className="font-bold text-3xl md:text-4xl mb-6">Join the UrbanIQ Family</h2>
            <p className="text-lg md:text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Experience the future of pet care with our innovative products designed for urban pet owners.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link 
                href="/products" 
                className="px-8 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-100 transition-colors"
              >
                Explore Products
              </Link>
              <Link 
                href="/contact" 
                className="px-8 py-3 border border-white text-white font-medium rounded-full hover:bg-white hover:text-black transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* Add JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "UrbanIQ Pet Tech",
              "url": "https://urbaniq.vercel.app",
              "logo": "https://urbaniq.vercel.app/logo.png",
              "description": "UrbanIQ creates innovative smart technology solutions designed for modern urban pet owners.",
              "foundingDate": "2020",
              "founders": [
                {
                  "@type": "Person",
                  "name": "Emily Chen"
                }
              ],
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Innovation Drive",
                "addressLocality": "San Francisco",
                "addressRegion": "CA",
                "postalCode": "94107",
                "addressCountry": "US"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "telephone": "+1-555-123-4567",
                "email": "support@urbaniq.com"
              },
              "sameAs": [
                "https://www.facebook.com/urbaniqpets",
                "https://www.instagram.com/urbaniq",
                "https://twitter.com/urbaniq",
                "https://www.linkedin.com/company/urbaniq"
              ]
            })
          }}
        />
      </main>
      <Footer />
    </div>
  );
} 