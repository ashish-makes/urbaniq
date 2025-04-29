'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Define the validation schema using Zod
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

// Get the type from the schema
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  // Initialize the form with react-hook-form and zodResolver
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle form submission
  const onSubmit = (values: ForgotPasswordFormValues) => {
    console.log('Reset password for:', values.email);
    setSubmittedEmail(values.email);
    setIsSubmitted(true);
  };

  return (
    <Card className="w-full max-w-md mx-auto border rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6">
      <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-4">
        <ArrowLeft size={18} className="mr-1" />
        Back to home
      </Link>
      {!isSubmitted ? (
        <>
          <h1 className="text-2xl font-bold mb-1">Reset your password</h1>
          <p className="text-gray-600 mb-6 text-sm">
            Enter your email and we'll send you a link to reset your password
          </p>
          
          <CardContent className="p-0 space-y-4">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-900">Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="name@example.com"
                            className="h-11 pl-3 pr-3 w-full rounded-full border border-gray-300 bg-white shadow-none focus-visible:ring-0 focus-visible:border-black"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                
                <div className="flex flex-col gap-3 mt-6">
                  <Button
                    type="submit"
                    className="w-full h-11 font-medium bg-black hover:bg-black/90 text-white rounded-full shadow-none focus:shadow-none"
                  >
                    Send Reset Link
                  </Button>
                  <Link href="/login">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full h-11 font-medium border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900 rounded-full shadow-none"
                    >
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-1">Check your email</h1>
          <p className="text-gray-600 mb-6">
            We've sent a password reset link to <span className="font-medium">{submittedEmail}</span>
          </p>
          
          <CardContent className="p-0 space-y-4">
            <p className="text-sm text-gray-600">
              Click the link in the email to reset your password. If you don't see the email, check your spam folder.
            </p>
            
            <div className="flex flex-col gap-3 mt-6">
              <Button
                type="button"
                onClick={() => setIsSubmitted(false)}
                className="w-full h-11 font-medium bg-black hover:bg-black/90 text-white rounded-full shadow-none focus:shadow-none"
              >
                Resend Email
              </Button>
              <Link href="/login">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full h-11 font-medium border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-900 rounded-full shadow-none"
                >
                  Back to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </>
      )}

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