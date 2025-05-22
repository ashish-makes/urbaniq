'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(3, { message: "Subject is required" }),
  inquiryType: z.string().min(1, { message: "Please select an inquiry type" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState<'idle' | 'error'>('idle');

  // Initialize the form with react-hook-form and zodResolver
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      inquiryType: '',
      message: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: ContactFormValues) => {
    setIsLoading(true);
    setFormStatus('idle');
    
    try {
      // Send form data to the API endpoint
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }
      
      toast.success("Your message has been sent! We'll get back to you shortly.");
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error instanceof Error ? error.message : "There was an error sending your message. Please try again.");
      setFormStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {formStatus === 'error' && (
          <div className="bg-red-50 border border-red-100 p-3 text-sm text-red-600">
            There was a problem sending your message. Please try again or contact us directly at support@urbaniq.com
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    className="border-gray-200"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="border-gray-200"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="inquiryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">
                  Inquiry Type
                </FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="border-gray-200">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="general">General Question</SelectItem>
                    <SelectItem value="product">Product Information</SelectItem>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="returns">Returns & Refunds</SelectItem>
                    <SelectItem value="partnerships">Business Partnerships</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="subject"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm text-gray-700">
                  Subject
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Message subject"
                    className="border-gray-200"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-xs" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-700">
                Message
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please provide details about your inquiry..."
                  className="min-h-[120px] border-gray-200"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-xs" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-black hover:bg-gray-800 text-white"
        >
          {isLoading ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </Form>
  );
} 