import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UrbanIQ | Smart Pet Products",
  description: "UrbanIQ offers innovative, high-quality smart products for modern pet owners.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ReactQueryProvider>
            <CartProvider>
              {children}
            </CartProvider>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
} 