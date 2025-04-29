'use client';

import Link from 'next/link';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function EmailConfirmedPage() {
  return (
    <Card className="w-full max-w-md mx-auto border rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6">
      <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-4">
        <ArrowLeft size={18} className="mr-1" />
        Back to home
      </Link>
      
      <div className="flex flex-col items-center justify-center text-center mb-6">
        <div className="bg-green-50 rounded-full p-3 mb-4">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Email Confirmed!</h1>
        <p className="text-gray-600 max-w-sm">
          Your email has been successfully verified. You can now access all features of your account.
        </p>
      </div>
      
      <CardContent className="p-0 space-y-4">
        <div className="flex flex-col gap-3">
          <Link href="/login">
            <Button 
              className="w-full h-11 font-medium bg-black hover:bg-black/90 text-white rounded-full shadow-none focus:shadow-none"
            >
              Sign In to Your Account
            </Button>
          </Link>
          
          <Link href="/">
            <Button 
              variant="outline" 
              className="w-full h-11 font-medium border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900 rounded-full shadow-none"
            >
              Go to Homepage
            </Button>
          </Link>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center space-x-4 p-0 mt-10 text-sm text-gray-500">
        <Link href="/terms" className="hover:text-gray-800">Terms</Link>
        <Link href="/privacy" className="hover:text-gray-800">Privacy</Link>
        <Link href="/support" className="hover:text-gray-800">Support</Link>
      </CardFooter>
    </Card>
  );
} 