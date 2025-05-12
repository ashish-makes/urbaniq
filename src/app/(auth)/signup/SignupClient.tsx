'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

// Define the validation schema using Zod
const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
      message: "Password must include uppercase, lowercase, number and special character",
    }),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Get the type from the schema
type SignupFormValues = z.infer<typeof signupSchema>;

export function SignupClient() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  // Initialize the form with react-hook-form and zodResolver
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
  });

  // Handle form submission
  const onSubmit = async (values: SignupFormValues) => {
    try {
      setIsLoading(true);
      
      // Call API to register user
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create account');
      }

      // If successful, show toast message
      toast.success('Verification code sent to your email.');
      
      // Redirect to the verification page
      router.push(`/verify?email=${encodeURIComponent(values.email)}`);
      
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Google Sign Up
  const handleGoogleSignUp = async () => {
    try {
      setIsGoogleLoading(true);
      await signIn("google", { 
        callbackUrl: "/user/dashboard",
        redirect: true
      });
    } catch (error) {
      console.error("Google sign-up error:", error);
      toast.error("Failed to sign up with Google. Please try again.");
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto border rounded-xl shadow-[0_4px_24px_rgba(0,0,0,0.03)] p-6">
      <Link href="/" className="inline-flex items-center text-sm text-gray-600 hover:text-black mb-4">
        <ArrowLeft size={18} className="mr-1" />
        Back to home
      </Link>
      <h1 className="text-2xl font-bold mb-1">Create an account</h1>
      <p className="text-gray-600 mb-6 text-sm">
        Already have an account? <Link href="/login" className="text-black font-medium hover:underline">Sign in</Link>
      </p>
      
      <CardContent className="p-0 space-y-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="signup-name" className="text-sm font-medium text-gray-900">Full Name</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="signup-name"
                        placeholder="John Doe"
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

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="signup-email" className="text-sm font-medium text-gray-900">Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="signup-email"
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
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel htmlFor="signup-password" className="text-sm font-medium text-gray-900">Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="signup-password"
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
                        aria-label={showPassword ? "Hide password" : "Show password"}
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
                  <FormLabel htmlFor="signup-confirm-password" className="text-sm font-medium text-gray-900">Confirm Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id="signup-confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        className="h-11 pl-3 pr-10 w-full rounded-full border border-gray-300 bg-white shadow-none focus-visible:ring-0 focus-visible:border-black"
                        {...field}
                        disabled={isLoading}
                      />
                      <button 
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                      >
                        {showConfirmPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="agreeTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox 
                      id="signup-agree-terms"
                      checked={field.value} 
                      onCheckedChange={field.onChange}
                      className="rounded border-gray-300 text-black mt-1 shadow-none"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel htmlFor="signup-agree-terms" className="text-sm text-gray-700">
                      I agree to the <Link href="/terms" className="text-black font-medium hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-black font-medium hover:underline">Privacy Policy</Link>
                    </FormLabel>
                    <FormMessage className="text-xs text-red-500" />
                  </div>
                </FormItem>
              )}
            />
            
            <Button
              type="submit"
              className="w-full h-11 font-medium bg-black hover:bg-black/90 text-white rounded-full shadow-none focus:shadow-none"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </Form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">OR CONTINUE WITH</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          type="button" 
          className="w-full h-11 border border-gray-300 bg-white text-gray-700 rounded-full font-medium shadow-none hover:bg-gray-50 transition-colors"
          onClick={handleGoogleSignUp}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-t-2 border-b-2 border-gray-600 rounded-full animate-spin mr-2"></div>
              <span>Connecting...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Sign up with Google</span>
            </div>
          )}
        </Button>

        <CardFooter className="flex justify-center space-x-4 p-0 mt-10 text-sm text-gray-500">
          <Link href="/terms" className="hover:text-gray-800">Terms</Link>
          <Link href="/privacy" className="hover:text-gray-800">Privacy</Link>
          <Link href="/support" className="hover:text-gray-800">Support</Link>
        </CardFooter>
      </CardContent>
    </Card>
  );
} 