'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Define the validation schema using Zod
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
      message: "Password must include uppercase, lowercase, number and special character",
    }),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Get the type from the schema
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Initialize the form with react-hook-form and zodResolver
  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  // Handle form submission
  const onSubmit = (values: ResetPasswordFormValues) => {
    console.log(values);
    // In a real app, you would make an API call to update the password
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
            Please create a new secure password for your account
          </p>
          
          <CardContent className="p-0 space-y-4">
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
                        Must be at least 8 characters long and include a mix of uppercase, lowercase, numbers and symbols.
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
                            placeholder="Confirm your password"
                            className="h-11 pl-3 pr-10 w-full rounded-full border border-gray-300 bg-white shadow-none focus-visible:ring-0 focus-visible:border-black"
                            {...field}
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
                
                <div className="flex flex-col gap-3 mt-6">
                  <Button
                    type="submit"
                    className="w-full h-11 font-medium bg-black hover:bg-black/90 text-white rounded-full shadow-none focus:shadow-none"
                  >
                    Reset Password
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
          <div className="flex flex-col items-center justify-center text-center mb-6">
            <div className="bg-green-50 rounded-full p-3 mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Password Reset Successfully</h1>
            <p className="text-gray-600 max-w-sm">
              Your password has been updated. You can now log in with your new password.
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
            </div>
          </CardContent>
        </>
      )}

      <CardFooter className="flex justify-center space-x-4 p-0 mt-10 text-sm text-gray-500">
        <Link href="/terms" className="hover:text-gray-800">Terms</Link>
        <Link href="/privacy" className="hover:text-gray-800">Privacy</Link>
        <Link href="/support" className="hover:text-gray-800">Support</Link>
      </CardFooter>
    </Card>
  );
} 