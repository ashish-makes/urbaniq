"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { 
  Bookmark,
  TextQuote,
  Loader2
} from "lucide-react";

// Create form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters." }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Define type based on schema
type FormData = z.infer<typeof formSchema>;

export default function NewCategoryPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  // Form submission handler
  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("name", data.name);
      
      if (data.description) {
        formData.append("description", data.description);
      }
      
      formData.append("isActive", String(data.isActive));

      // Send request to API
      const response = await fetch("/api/admin/categories", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create category");
      }

      // Success
      toast.success("Category created successfully");
      router.push("/admin/categories");
    } catch (error) {
      console.error("Error creating category:", error);
      toast.error(error instanceof Error ? error.message : "Failed to create category");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-full">
      <div className="mb-6">
        <h1 className="text-xl font-bold">Add New Category</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="mb-8 w-full">
          {/* Basic Information Card */}
          <div className="border bg-white p-4 rounded-lg mb-4">
            <h2 className="text-md font-medium mb-3">Basic Information</h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Category Name <span className="text-red-500">*</span></FormLabel>
                      <div className="relative">
                        <Bookmark className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            placeholder="Enter category name" 
                            {...field} 
                            className="pl-10"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-1">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">Description</FormLabel>
                      <div className="relative">
                        <TextQuote className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Textarea 
                            placeholder="Enter a brief category description" 
                            {...field} 
                            rows={3}
                            className="resize-none pl-10 rounded-lg"
                          />
                        </FormControl>
                      </div>
                      <FormDescription className="text-xs p-2">
                        This description will help customers understand what products are in this category.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/categories')}
              disabled={isLoading}
              className="h-9 rounded-full px-8"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="h-9 rounded-full px-8"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Category'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 