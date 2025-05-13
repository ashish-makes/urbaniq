'use client';

import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(3, { message: "Subject is required" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type ContactFormValues = z.infer<typeof formSchema>;

export default function ContactForm() {
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form with react-hook-form and zodResolver
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  // Handle form submission
  const onSubmit = async (values: ContactFormValues) => {
    setIsLoading(true);
    
    try {
      // Simulate API request with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real application, you would send the form data to your API here
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   body: JSON.stringify(values),
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      // });
      
      toast.success("Your message has been sent! We'll get back to you shortly.");
      form.reset();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("There was an error sending your message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="contact-name" className="font-medium mb-1 block">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    id="contact-name"
                    placeholder="Your name"
                    className="rounded-lg border-gray-300 focus:border-black focus:ring-black"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-1" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="contact-email" className="font-medium mb-1 block">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="rounded-lg border-gray-300 focus:border-black focus:ring-black"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-sm text-red-500 mt-1" />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="contact-subject" className="font-medium mb-1 block">
                Subject
              </FormLabel>
              <FormControl>
                <Input
                  id="contact-subject"
                  placeholder="How can we help you?"
                  className="rounded-lg border-gray-300 focus:border-black focus:ring-black"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="contact-message" className="font-medium mb-1 block">
                Message
              </FormLabel>
              <FormControl>
                <Textarea
                  id="contact-message"
                  placeholder="Your message here..."
                  className="min-h-32 rounded-lg border-gray-300 focus:border-black focus:ring-black"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-sm text-red-500 mt-1" />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2.5 rounded-full transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <span className="animate-spin mr-2 inline-block h-4 w-4 border-t-2 border-b-2 border-white rounded-full"></span>
              Sending...
            </>
          ) : (
            <>
              <Send className="mr-2 h-4 w-4" />
              Send Message
            </>
          )}
        </Button>
      </form>
    </Form>
  );
} 