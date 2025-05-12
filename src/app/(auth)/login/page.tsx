import { Suspense } from 'react';
import { Metadata } from 'next';
import { LoginClient } from './LoginClient';

export const metadata: Metadata = {
  title: 'Login | UrbanIQ Pet Tech',
  description: 'Sign in to your UrbanIQ account. Access your dashboard, orders, and manage your pet tech devices.',
  keywords: 'login, sign in, account, pet tech, UrbanIQ',
  openGraph: {
    title: 'Login to Your UrbanIQ Account',
    description: 'Sign in to your UrbanIQ account to access your dashboard, track orders, and manage your pet tech devices.',
    type: 'website',
    url: 'https://urbaniq.com/login',
    images: [
      {
        url: '/images/og-login.jpg',
        width: 1200,
        height: 630,
        alt: 'UrbanIQ Login',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login to Your UrbanIQ Account',
    description: 'Sign in to your UrbanIQ account to access your dashboard, track orders, and manage your pet tech devices.',
  },
};

export default function LoginPage() {
  return (

    <>
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
        <LoginClient />
      </Suspense>

      {/* Add structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Login to UrbanIQ",
            "description": "Sign in to your UrbanIQ account. Access your dashboard, orders, and manage your pet tech devices.",
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
                  "name": "Login",
                  "item": "https://urbaniq.vercel.app/login"
                }
              ]
            }
          })
        }}
      />
      </>
  );
} 