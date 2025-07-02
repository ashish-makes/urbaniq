import type { Metadata } from 'next';
import { CookiesClient } from './CookiesClient';
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: 'Cookie Policy | UrbanIQ',
  description: 'Learn about how UrbanIQ uses cookies and similar technologies to improve your browsing experience. Read our cookie policy and manage your preferences.',
  openGraph: {
    title: 'Cookie Policy | UrbanIQ',
    description: 'Learn about how UrbanIQ uses cookies and similar technologies to improve your browsing experience. Read our cookie policy and manage your preferences.',
  },
  twitter: {
    title: "Cookie Policy | UrbanIQ",
    description: "Learn about how UrbanIQ uses cookies and similar technologies to improve your browsing experience.",
    card: "summary_large_image",
  },
};

export default function CookiesPage() {
  return (
    <>
      <Header />
      <CookiesClient />
      <Footer />
    </>
  );
} 