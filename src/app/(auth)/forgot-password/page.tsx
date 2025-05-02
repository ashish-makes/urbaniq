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
import { toast } from 'sonner';

// Define the validation schema using Zod
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

// Get the type from the schema
type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Initialize the form with react-hook-form and zodResolver
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: ForgotPasswordFormValues) => {
    try {
      setIsLoading(true);
      
      // Call API to request password reset
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reset link');
      }

      setIsSuccess(true);
      toast.success('Password reset instructions sent to your email');
      
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <Card className="w-full max-w-md mx-auto border rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6">
        <Link href="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-4">
          <ArrowLeft size={18} className="mr-1" />
          Back to login
        </Link>
        <h1 className="text-2xl font-bold mb-1">Reset your password</h1>
        <p className="text-gray-600 mb-6 text-sm">
          Enter your email address and we'll send you instructions to reset your password.
        </p>
        
        <CardContent className="p-0 space-y-4">
          {isSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-800 mb-2">Check your email</h3>
              <p className="text-green-700 text-sm">
                We've sent password reset instructions to your email address. Please check your inbox and spam folder.
              </p>
              <Button
                className="mt-4 w-full h-11 font-medium bg-black hover:bg-black/90 text-white rounded-full"
                onClick={() => form.reset()}
              >
                Send again
              </Button>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-900">Email address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="you@example.com"
                            className="h-11 pl-3 pr-3 w-full rounded-full border border-gray-300 bg-white shadow-none focus-visible:ring-0 focus-visible:border-black"
                            {...field}
                            disabled={isLoading}
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="submit"
                  className="w-full h-11 font-medium bg-black hover:bg-black/90 text-white rounded-full shadow-none focus:shadow-none"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send reset link"}
                </Button>
              </form>
            </Form>
          )}
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