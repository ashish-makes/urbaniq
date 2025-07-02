import type { Metadata } from 'next';
import { TermsClient } from './TermsClient';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata: Metadata = {
  title: 'Terms and Conditions | UrbanIQ',
  description: 'Terms and conditions for using UrbanIQ services and products. Read our policies, user agreements, and legal information.',
  openGraph: {
    title: 'Terms and Conditions | UrbanIQ',
    description: 'Terms and conditions for using UrbanIQ services and products. Read our policies, user agreements, and legal information.',
  }
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <TermsClient />
      <Footer />
    </>
  )
} 