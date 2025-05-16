import { Metadata } from 'next';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import AboutContent from './AboutContent';

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
      <AboutContent />
      <Footer />
    </div>
  );
} 