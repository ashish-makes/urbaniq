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