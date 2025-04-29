'use client';

import Link from 'next/link';
import { ArrowLeft, Lock, Mail } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

export default function AccountLockedPage() {
  return (
    <Card className="w-full max-w-md mx-auto border rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6">
      <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-4">
        <ArrowLeft size={18} className="mr-1" />
        Back to home
      </Link>
      
      <div className="flex flex-col items-center justify-center text-center mb-6">
        <div className="bg-amber-50 rounded-full p-3 mb-4">
          <Lock className="h-12 w-12 text-amber-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Account Temporarily Locked</h1>
        <p className="text-gray-600 max-w-sm">
          For your security, we've temporarily locked your account due to multiple failed login attempts or suspicious activity.
        </p>
      </div>
      
      <CardContent className="p-0 space-y-4">
        <div className="flex flex-col gap-3">
          <Link href="/reset-password">
            <Button 
              className="w-full h-11 font-medium bg-black hover:bg-black/90 text-white rounded-full shadow-none focus:shadow-none"
            >
              Reset Your Password
            </Button>
          </Link>
          
          <Link href="/contact">
            <Button 
              variant="outline" 
              className="w-full h-11 font-medium border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900 rounded-full shadow-none"
            >
              Contact Support
            </Button>
          </Link>
        </div>
        
        <div className="mt-6 bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start">
            <Mail className="text-blue-500 mt-0.5 mr-3 h-5 w-5 flex-shrink-0" />
            <div className="text-sm text-blue-700">
              <p className="font-medium mb-1">Unlock Instructions Sent</p>
              <p>
                We've sent an email with instructions to unlock your account. 
                Please check your inbox and follow the steps provided.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 text-sm text-gray-600">
          <p className="mb-2">Why was your account locked?</p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Multiple failed login attempts</li>
            <li>Suspicious activity detected</li>
            <li>Sign-in from an unrecognized device or location</li>
            <li>Security policy enforcement</li>
          </ul>
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