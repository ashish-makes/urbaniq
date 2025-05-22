import { Metadata } from 'next';

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