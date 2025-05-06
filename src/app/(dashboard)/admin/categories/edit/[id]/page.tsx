"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
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
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { 
  Bookmark,
  TextQuote,
  Loader2 
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import Head from "next/head";

// Create form schema
const formSchema = z.object({
  name: z.string().min(2, { message: "Category name must be at least 2 characters." }),
  description: z.string().optional(),
  isActive: z.boolean().default(true),
});

// Define category type
interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function EditCategoryPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<Category | null>(null);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      isActive: true,
    },
  });

  // Fetch category data
  useEffect(() => {
    async function fetchCategory() {
      setIsFetching(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/categories?id=${id}`);
        
        if (!response.ok) {
          throw new Error(`Error fetching category: ${response.status}`);
        }
        
        const data = await response.json();
        setCategory(data);
        
        // Set form values
        form.reset({
          name: data.name,
          description: data.description || "",
          isActive: data.isActive,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch category';
        setError(message);
        toast.error(message);
      } finally {
        setIsFetching(false);
      }
    }

    fetchCategory();
  }, [id, form]);

  // Form submission handler
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    try {
      // Create form data
      const formData = new FormData();
      formData.append("id", id);
      formData.append("name", data.name);
      
      if (data.description) {
        formData.append("description", data.description);
      }
      
      formData.append("isActive", String(data.isActive));
      formData.append("keepExistingImage", "true");

      // Send request to API
      const response = await fetch("/api/admin/categories", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update category");
      }

      // Success
      toast.success("Category updated successfully");
      router.push("/admin/categories");
    } catch (error) {
      console.error("Error updating category:", error);
      toast.error(error instanceof Error ? error.message : "Failed to update category");
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative min-h-full">
        <div className="mb-6">
          <h1 className="text-xl font-bold">Edit {category?.name}</h1>
        </div>

        <div className="bg-red-50 text-red-800 rounded-md p-4 mb-4">
          <p>{error}</p>
          <Button 
            variant="outline"
            className="mt-4" 
            onClick={() => router.push("/admin/categories")}
          >
            Back to Categories
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-full">
      {category && (
        <Head>
          <title>Edit {category.name} | UrbanIQ</title>
        </Head>
      )}
      <div className="mb-6">
        <h1 className="text-xl font-bold">Edit {category?.name}</h1>
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

          {/* Category Status Section */}
          <div className="border bg-white p-4 rounded-lg mb-4">
            <h2 className="text-md font-medium mb-3">Category Status</h2>
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between py-2">
                  <div>
                    <FormLabel className="text-sm">Active</FormLabel>
                    <FormDescription className="text-xs">
                      Enable or disable this category on the storefront.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
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
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
} 