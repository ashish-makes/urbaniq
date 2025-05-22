import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';

export const metadata = {
  title: 'Page Not Found | UrbanIQ Pet Tech',
  description: 'The page you are looking for does not exist or has been moved.',
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="py-16 text-center">
            <div className="mx-auto w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <path d="M12 9v4" />
                <path d="M12 17h.01" />
              </svg>
            </div>
            
            <h1 className="text-3xl font-semibold mb-4">404 - Page Not Found</h1>
            
            <p className="text-gray-500 mb-8 max-w-lg mx-auto">
              The page you're looking for doesn't exist or might have been moved. 
              Please check the URL or navigate back to the homepage.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/">
                <div className="group inline-flex items-center justify-center py-2.5 pl-6 pr-4 rounded-full bg-black text-white border border-gray-800 hover:bg-black/80 transition-all font-medium text-sm">
                  <span className="mr-2">Go to Homepage</span>
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
              
              <Link href="/products">
                <div className="group inline-flex items-center justify-center py-2.5 pl-6 pr-4 rounded-full bg-white text-black border border-gray-200 hover:bg-gray-50 transition-all font-medium text-sm">
                  <span className="mr-2">Browse Products</span>
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
      </main>
      
      <Footer />
    </div>
  );
} 