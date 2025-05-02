'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from 'sonner';
import OtpInput from '@/components/OtpInput';

// Define the validation schema using Zod
const verifySchema = z.object({
  otp: z.string().length(6, { message: "Verification code must be 6 digits" }),
});

// Get the type from the schema
type VerifyFormValues = z.infer<typeof verifySchema>;

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(600); // 10 minutes in seconds
  const [resendDisabled, setResendDisabled] = useState(true);

  // Initialize the form with react-hook-form and zodResolver
  const form = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      otp: '',
    },
  });

  // Redirect if email is not provided
  useEffect(() => {
    if (!email) {
      router.push('/signup');
    }
  }, [email, router]);

  // Countdown timer for OTP expiration
  useEffect(() => {
    if (countdown <= 0) {
      setResendDisabled(false);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Format countdown time as mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle form submission
  const onSubmit = async (values: VerifyFormValues) => {
    if (!email) {
      toast.error("Email not found. Please go back to signup.");
      return;
    }

    try {
      setIsLoading(true);
      console.log('Verifying OTP:', values.otp, 'for email:', email);
      
      // Call API to verify OTP
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: values.otp,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify email');
      }

      toast.success('Email verified successfully! Redirecting to login...');
      
      // Redirect to login page after successful verification
      setTimeout(() => {
        router.push('/login');
      }, 2000);
      
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to verify email');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend OTP
  const handleResendOTP = async () => {
    if (!email) return;
    
    try {
      setIsLoading(true);
      
      // Call API to resend OTP
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          resend: true,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend verification code');
      }

      toast.success('Verification code resent to your email');
      setCountdown(600); // Reset countdown
      setResendDisabled(true);
      
    } catch (error) {
      console.error('Resend OTP error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to resend verification code');
    } finally {
      setIsLoading(false);
    }
  };

  // If no email, show loading state (will redirect to signup)
  if (!email) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <Card className="w-full max-w-md mx-auto border rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6">
        <Link href="/signup" className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-4">
          <ArrowLeft size={18} className="mr-1" />
          Back to signup
        </Link>
        <h1 className="text-2xl font-bold mb-1">Verify your email</h1>
        <p className="text-gray-600 mb-6 text-sm">
          We've sent a verification code to <span className="font-medium text-black">{email}</span>
        </p>
        
        <CardContent className="p-0 space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="otp"
                render={({ field }) => (
                  <FormItem className="space-y-4">
                    <FormLabel className="text-sm font-medium text-gray-900">Enter verification code</FormLabel>
                    <FormControl>
                      <OtpInput
                        value={field.value}
                        valueLength={6}
                        onChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-xs text-red-500" />
                  </FormItem>
                )}
              />
              
              <div className="text-center text-sm text-gray-600 mt-4">
                <p>Code expires in <span className="font-medium">{formatTime(countdown)}</span></p>
              </div>
              
              <Button
                type="submit"
                className="w-full h-11 font-medium bg-black hover:bg-black/90 text-white rounded-full shadow-none focus:shadow-none"
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Verify Email"}
              </Button>
            </form>
          </Form>
          
          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-600 mb-3">Didn't receive the code?</p>
            <Button
              variant="outline" 
              onClick={handleResendOTP}
              disabled={isLoading || resendDisabled}
              className="h-10 px-4 rounded-full border-gray-300 text-gray-700 hover:text-black hover:border-black"
            >
              {resendDisabled ? `Resend code in ${formatTime(countdown)}` : "Resend Code"}
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center space-x-4 p-0 mt-10 text-sm text-gray-500">
          <Link href="/terms" className="hover:text-gray-800">Terms</Link>
          <Link href="/privacy" className="hover:text-gray-800">Privacy</Link>
          <Link href="/support" className="hover:text-gray-800">Support</Link>
        </CardFooter>
      </Card>
    </div>
  );
} 