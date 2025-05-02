'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from 'sonner';

// Define the validation schema using Zod
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Get the type from the schema
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const email = searchParams.get('email');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Initialize the form with react-hook-form and zodResolver
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Verify the token when the page loads
  useEffect(() => {
    async function verifyToken() {
      if (!token || !email) {
        setIsVerifying(false);
        return;
      }

      try {
        const response = await fetch('/api/auth/verify-reset-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token, email }),
        });

        const data = await response.json();

        if (response.ok && data.valid) {
          setIsValidToken(true);
        } else {
          toast.error('This password reset link is invalid or has expired');
        }
      } catch (error) {
        console.error('Error verifying token:', error);
        toast.error('Failed to verify reset link');
      } finally {
        setIsVerifying(false);
      }
    }

    verifyToken();
  }, [token, email]);

  // Handle form submission
  const onSubmit = async (values: ResetPasswordFormValues) => {
    if (!token || !email) {
      toast.error('Missing required information');
      return;
    }

    try {
      setIsLoading(true);
      
      // Call API to reset password
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to reset password');
      }

      setIsSuccess(true);
      toast.success('Password has been reset successfully');
      
      // Redirect to login page after 3 seconds
      setTimeout(() => {
        router.push('/login');
      }, 3000);
      
    } catch (error) {
      console.error('Reset password error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while verifying token
  if (isVerifying) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <Card className="w-full max-w-md mx-auto border rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6">
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-t-2 border-black rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-700">Verifying reset link...</span>
          </div>
        </Card>
      </div>
    );
  }

  // Show invalid token message
  if (!isValidToken) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4 py-12">
        <Card className="w-full max-w-md mx-auto border rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Invalid or Expired Link</h1>
          <p className="text-gray-600 mb-6 text-center">
            This password reset link is invalid or has expired. Please request a new password reset link.
          </p>
          <div className="flex justify-center">
            <Link href="/forgot-password">
              <Button className="bg-black hover:bg-black/90 text-white rounded-full">
                Request New Link
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12">
      <Card className="w-full max-w-md mx-auto border rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6">
        <Link href="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-4">
          <ArrowLeft size={18} className="mr-1" />
          Back to login
        </Link>
        <h1 className="text-2xl font-bold mb-1">Create new password</h1>
        <p className="text-gray-600 mb-6 text-sm">
          Your new password must be different from previously used passwords.
        </p>
        
        <CardContent className="p-0 space-y-4">
          {isSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-green-800 mb-2">Password reset successful</h3>
              <p className="text-green-700 text-sm">
                Your password has been reset successfully. Redirecting you to the login page...
              </p>
            </div>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-900">New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a strong password"
                            className="h-11 pl-3 pr-10 w-full rounded-full border border-gray-300 bg-white shadow-none focus-visible:ring-0 focus-visible:border-black"
                            {...field}
                            disabled={isLoading}
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                          </button>
                        </div>
                      </FormControl>
                      <p className="text-xs text-gray-500">
                        Must be at least 8 characters with uppercase, lowercase, and numbers.
                      </p>
                      <FormMessage className="text-xs text-red-500" />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="text-sm font-medium text-gray-900">Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your new password"
                            className="h-11 pl-3 pr-10 w-full rounded-full border border-gray-300 bg-white shadow-none focus-visible:ring-0 focus-visible:border-black"
                            {...field}
                            disabled={isLoading}
                          />
                          <button 
                            type="button"
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                          </button>
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
                  {isLoading ? "Resetting Password..." : "Reset Password"}
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