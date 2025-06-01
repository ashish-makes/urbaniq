import "./globals.css";
import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { CartProvider } from "@/context/CartContext";
import { Toaster } from "sonner";

const bricolage = Bricolage_Grotesque({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-bricolage",
});

export const metadata: Metadata = {
  title: "UrbanIQ | Smart Pet Products",
  description: "UrbanIQ offers innovative, high-quality smart products for modern pet owners.",
  metadataBase: new URL('https://urbaniq.ca'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://urbaniq.ca',
    siteName: 'UrbanIQ',
    title: 'UrbanIQ - Smart Pet Tech for Modern Pet Parents',
    description: 'UrbanIQ offers innovative, high-quality smart products for modern pet owners.',
    images: [
      {
        url: '/hero-one.png', // Create this image in your public folder
        width: 1200,
        height: 630,
        alt: 'UrbanIQ',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  applicationName: 'UrbanIQ',
  referrer: 'origin-when-cross-origin',
  keywords: ['smart pet products', 'pet tech', 'pet camera', 'pet feeder', 'urbaniq'],
  authors: [{ name: 'UrbanIQ' }],
  creator: 'UrbanIQ',
  publisher: 'UrbanIQ',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bricolage.variable} font-bricolage`}>
        <AuthProvider>
          <ReactQueryProvider>
            <CartProvider>
              {children}
              <Toaster position="bottom-right" />
            </CartProvider>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 