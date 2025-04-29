'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function VerificationPendingPage() {
  const [email] = useState('user@example.com'); // In a real app, this would come from the session or URL param
  const [isResending, setIsResending] = useState(false);
  const [isResent, setIsResent] = useState(false);

  const handleResendEmail = async () => {
    setIsResending(true);
    // In a real app, you would make an API call to resend the verification email
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setIsResending(false);
    setIsResent(true);
    
    // Reset "resent" message after 5 seconds
    setTimeout(() => {
      setIsResent(false);
    }, 5000);
  };

  return (
    <Card className="w-full max-w-md mx-auto border rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6">
      <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-4">
        <ArrowLeft size={18} className="mr-1" />
        Back to home
      </Link>
      
      <div className="flex flex-col items-center justify-center text-center mb-6">
        <div className="bg-blue-50 rounded-full p-3 mb-4">
          <Mail className="h-12 w-12 text-blue-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
        <p className="text-gray-600 max-w-sm">
          We've sent a verification link to <span className="font-medium">{email}</span>. 
          Please check your inbox and click the link to verify your email address.
        </p>
      </div>
      
      <CardContent className="p-0 space-y-4">
        {isResent && (
          <div className="bg-green-50 text-green-700 p-3 rounded-md text-sm text-center mb-4">
            Verification email resent successfully!
          </div>
        )}
        
        <div className="flex flex-col gap-3">
          <Button 
            className="w-full h-11 font-medium bg-black hover:bg-black/90 text-white rounded-full shadow-none focus:shadow-none"
            onClick={handleResendEmail}
            disabled={isResending}
          >
            {isResending ? 'Sending...' : 'Resend Verification Email'}
          </Button>
          
          <Link href="/login">
            <Button 
              variant="outline" 
              className="w-full h-11 font-medium border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900 rounded-full shadow-none"
            >
              Back to Login
            </Button>
          </Link>
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p className="mb-2">Didn't receive the email? Please:</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Check your spam or junk folder</li>
            <li>Make sure the email address is correct</li>
            <li>Try resending the verification email</li>
          </ul>
        </div>
      </CardContent>

      <CardFooter className="flex justify-center space-x-4 p-0 mt-10 text-sm text-gray-500">
        <Link href="/terms" className="hover:text-gray-800">Terms</Link>
        <Link href="/privacy" className="hover:text-gray-800">Privacy</Link>
        <Link href="/support" className="hover:text-gray-800">Support</Link>
      </CardFooter>
      
      <p className="text-center text-sm text-gray-500 mt-4">
        Need help? <Link href="/contact" className="font-medium text-gray-700 hover:text-black">Contact Support</Link>
      </p>
    </Card>
  );
} 