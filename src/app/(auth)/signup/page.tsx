import { Suspense } from 'react';
import { Metadata } from 'next';
import { SignupClient } from './SignupClient';

export const metadata: Metadata = {
  title: 'Create Account | UrbanIQ Pet Tech',
  description: 'Sign up for UrbanIQ Pet Tech and join our community of pet lovers. Create an account to access exclusive features, track orders, and manage your pet tech devices.',
  keywords: 'signup, register, create account, pet tech, UrbanIQ, sign up',
  openGraph: {
    title: 'Create Your UrbanIQ Account',
    description: 'Sign up for UrbanIQ Pet Tech and join our community of pet lovers. Create an account to access exclusive features and manage your pet tech devices.',
    type: 'website',
    url: 'https://urbaniq.vercel.app/signup',
    images: [
      {
        url: '/images/og-signup.jpg',
        width: 1200,
        height: 630,
        alt: 'UrbanIQ Pet Tech - Create Account',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Your UrbanIQ Account',
    description: 'Sign up for UrbanIQ Pet Tech and join our community of pet lovers. Create an account to access exclusive features and manage your pet tech devices.',
  },
};

export default function SignupPage() {
  return (
    <>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <SignupClient />
      </Suspense>

      {/* Add structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Create UrbanIQ Account",
            "description": "Sign up for UrbanIQ Pet Tech and join our community of pet lovers. Create an account to access exclusive features and manage your pet tech devices.",
            "publisher": {
              "@type": "Organization",
              "name": "UrbanIQ Pet Tech",
              "logo": {
                "@type": "ImageObject",
                "url": "https://urbaniq.vercel.app/logo.png"
              }
            },
            "breadcrumb": {
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://urbaniq.vercel.app"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Sign Up",
                  "item": "https://urbaniq.vercel.app/signup"
                }
              ]
            },
            "mainEntity": {
              "@type": "CreateAction",
              "object": {
                "@type": "UserAccount",
                "name": "UrbanIQ User Account"
              }
            }
          })
        }}
      />
    </>
  );
} 