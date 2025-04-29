import { Geist, Geist_Mono } from "next/font/google";
import { Bricolage_Grotesque } from "next/font/google";
import { SmoothScroll } from "@/components/SmoothScroll";
import '../globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body 
        className={`${geistSans.variable} ${geistMono.variable} ${bricolage.variable} font-sans bg-gray-50 min-h-screen flex flex-col`}
        suppressHydrationWarning
      >
        <SmoothScroll>
          <main className="flex-1 flex items-center justify-center p-4">
            {children}
          </main>
        </SmoothScroll>
      </body>
    </html>
  );
}