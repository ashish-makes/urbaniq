import { Metadata } from "next";
import { PrivacyClient } from "./PrivacyClient";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "Privacy Policy | UrbanIQ",
  description: "Learn about how UrbanIQ collects, uses, and protects your personal information.",
  openGraph: {
    title: "Privacy Policy | UrbanIQ",
    description: "Learn about how UrbanIQ collects, uses, and protects your personal information.",
    type: "website",
  },
  twitter: {
    title: "Privacy Policy | UrbanIQ",
    description: "Learn about how UrbanIQ collects, uses, and protects your personal information.",
    card: "summary_large_image",
  },
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <PrivacyClient />
      <Footer />
    </>
  );
} 