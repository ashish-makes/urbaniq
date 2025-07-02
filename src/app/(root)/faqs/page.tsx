import { Metadata } from "next";
import { FaqsClient } from "./FaqsClient";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "FAQs | UrbanIQ",
  description: "Find answers to frequently asked questions about UrbanIQ's smart pet technology products and services.",
  openGraph: {
    title: "FAQs | UrbanIQ",
    description: "Find answers to frequently asked questions about UrbanIQ's smart pet technology products and services.",
    type: "website",
  },
  twitter: {
    title: "FAQs | UrbanIQ",
    description: "Find answers to frequently asked questions about UrbanIQ's smart pet technology products and services.",
    card: "summary_large_image",
  },
};

export default function FaqsPage() {
  return (
    <>
      <Header />
      <FaqsClient />
      <Footer />
    </>
  );
} 