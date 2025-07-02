'use client';

import { useState } from 'react';
import Link from "next/link";

export function FaqsClient() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const faqSections = [
    {
      title: "Getting Started",
      description: "Essential information about our products and how to begin using them effectively.",
      questions: [
        {
          id: 'what-is-urbaniq',
          question: 'What is UrbanIQ?',
          answer: 'UrbanIQ is a leading provider of smart pet technology solutions designed to enhance the lives of pets and their owners. We offer innovative products like smart feeders, pet cameras, and interactive toys.'
        },
        {
          id: 'how-to-start',
          question: 'How do I get started with UrbanIQ products?',
          answer: 'Getting started is easy! Simply choose your desired product, create an account, and follow our step-by-step setup guide. Our products are designed to be user-friendly and can be set up within minutes.'
        },
        {
          id: 'app-compatibility',
          question: 'Which devices are compatible with the UrbanIQ app?',
          answer: 'The UrbanIQ app is available for iOS 12+ and Android 8+ devices. It requires a stable internet connection and Bluetooth capability for optimal performance.'
        }
      ]
    },
    {
      title: "Orders & Shipping",
      description: "Information about our shipping process, timelines, and tracking your orders.",
      questions: [
        {
          id: 'shipping-time',
          question: 'How long does shipping take?',
          answer: 'Standard shipping within Canada typically takes 3-5 business days. International shipping times vary by location. Express shipping options are available at checkout.'
        },
        {
          id: 'order-tracking',
          question: 'How can I track my order?',
          answer: 'Once your order ships, you\'ll receive a tracking number via email. You can also view your order status by logging into your account and visiting the Orders section.'
        },
        {
          id: 'shipping-cost',
          question: 'What are the shipping costs?',
          answer: 'We offer free standard shipping on orders over $50 within Canada. For international orders and express shipping options, rates are calculated at checkout based on location and weight.'
        }
      ]
    },
    {
      title: "Product Support",
      description: "Technical assistance and troubleshooting for your UrbanIQ devices.",
      questions: [
        {
          id: 'warranty',
          question: 'What warranty do your products come with?',
          answer: 'All UrbanIQ products come with a standard 1-year warranty covering manufacturing defects. Extended warranty options are available for purchase.'
        },
        {
          id: 'troubleshooting',
          question: 'What should I do if my device isn\'t working?',
          answer: 'First, check our troubleshooting guide in the app or website. If the issue persists, contact our support team with your device details and the problem description.'
        },
        {
          id: 'replacement-parts',
          question: 'Can I purchase replacement parts?',
          answer: 'Yes, replacement parts are available for most UrbanIQ products. Visit our online store or contact customer support to find the specific parts you need.'
        }
      ]
    },
    {
      title: "Returns & Refunds",
      description: "Details about our return policy and refund processing.",
      questions: [
        {
          id: 'return-policy',
          question: 'What is your return policy?',
          answer: 'We offer a 30-day return policy for unused products in original packaging. Defective items can be returned within 90 days of purchase.'
        },
        {
          id: 'refund-process',
          question: 'How long do refunds take to process?',
          answer: 'Once we receive your return, refunds are processed within 3-5 business days. The funds may take an additional 5-10 business days to appear in your account.'
        },
        {
          id: 'return-shipping',
          question: 'Who pays for return shipping?',
          answer: 'For defective items, we provide a prepaid return label. For other returns, customers are responsible for return shipping costs unless otherwise specified.'
        }
      ]
    }
  ];

  const toggleQuestion = (questionId: string) => {
    setOpenQuestion(openQuestion === questionId ? null : questionId);
  };

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="relative bg-[#fafafa] py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-2xl">
            <div className="text-sm uppercase tracking-wider text-gray-500 mb-4">
              FAQS
            </div>
            <h1 className="text-5xl font-light text-gray-900 mb-6 leading-tight">
              Frequently asked questions
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              What to do with your smart pet technology is a major decision. 
              Making one isn't simple. Here are answers to some of our 
              most commonly asked questions.
            </p>
            <div className="mt-4">
              <Link href="/contact">
                <div className="group inline-flex items-center justify-center py-2.5 pl-6 pr-4 rounded-full bg-black text-white border border-black hover:bg-gray-900 transition-all font-medium text-sm">
                  <span className="mr-2">Talk with us</span>
                  <div className="bg-white rounded-full p-1.5 flex items-center justify-center">
                    <div className="w-[14px] h-[14px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Sections */}
      <div className="bg-white">
        {faqSections.map((section, sectionIndex) => (
          <section 
            key={sectionIndex} 
            className={`border-t border-gray-100 ${sectionIndex === faqSections.length - 1 ? 'border-b' : ''}`}
          >
            <div className="container mx-auto px-4 max-w-6xl py-16">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Category Title */}
                <div className="md:col-span-3">
                  <h2 className="text-xl font-medium text-gray-900 mb-2">
                    {section.title}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {section.description}
                  </p>
                </div>
                
                {/* Accordions */}
                <div className="md:col-span-9">
                  <div className="space-y-6">
                    {section.questions.map((item) => (
                      <div
                        key={item.id}
                        className="border-b border-gray-100 last:border-b-0"
                      >
                        <button
                          onClick={() => toggleQuestion(item.id)}
                          className="w-full flex items-center justify-between py-4 text-left group"
                        >
                          <h3 className="text-base text-gray-900 group-hover:text-gray-600 transition-colors">
                            {item.question}
                          </h3>
                          <div className={`flex-shrink-0 ml-4 transition-transform duration-200 ${
                            openQuestion === item.id ? 'rotate-180' : ''
                          }`}>
                            <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </button>
                        <div
                          className={`transition-all duration-200 ease-in-out overflow-hidden ${
                            openQuestion === item.id ? 'max-h-96 pb-4' : 'max-h-0'
                          }`}
                        >
                          <p className="text-sm text-gray-600">{item.answer}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Call to Action */}
      <section className="relative bg-black py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="max-w-2xl">
            <div className="text-sm uppercase tracking-wider text-gray-400 mb-4">
              NEED MORE HELP?
            </div>
            <h2 className="text-5xl font-light text-white mb-6 leading-tight">
              Still have questions?
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Can't find what you're looking for? Our support team is here to help you 
              with any questions you may have about our smart pet technology solutions.
            </p>
            <div className="mt-4">
              <Link href="/contact">
                <div className="group inline-flex items-center justify-center py-2.5 pl-6 pr-4 rounded-full bg-white text-black border border-white hover:bg-gray-100 transition-all font-medium text-sm">
                  <span className="mr-2">Contact our team</span>
                  <div className="bg-black rounded-full p-1.5 flex items-center justify-center">
                    <div className="w-[14px] h-[14px] group-hover:-rotate-45 transition-transform duration-300 ease-in-out">
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
} 