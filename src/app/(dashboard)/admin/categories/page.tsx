"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { 
  Plus, 
  MoreHorizontal, 
  Eye,
  Pencil, 
  Trash2, 
  FolderIcon,
  Loader2
} from "lucide-react";

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
  _count: {
    products: number;
  };
}

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Fetch all categories from API
    const fetchCategories = async () => {
      setIsLoading(true);
    setError(null);

      try {
        const response = await fetch('/api/admin/categories');
      
        if (!response.ok) {
        throw new Error(`Error fetching categories: ${response.status}`);
        }
      
        const data = await response.json();
        setCategories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        toast.error('Failed to load categories');
      } finally {
        setIsLoading(false);
      }
    };

  // Handle delete confirmation
  const confirmDelete = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  // Handle category deletion
  const handleDelete = async () => {
    if (!categoryToDelete) return;

    setIsDeleting(categoryToDelete.id);

    try {
      const response = await fetch(`/api/admin/categories?id=${categoryToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete category');
      }

      // Remove from state
      setCategories(prev => prev.filter(c => c.id !== categoryToDelete.id));
      toast.success('Category deleted successfully');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to delete category');
    } finally {
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
      setIsDeleting(null);
    }
  };

  // Category table skeleton loading state
  const CategoryTableSkeleton = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="border-b border-gray-100">
              <th className="px-3 py-2 text-left font-medium">Category</th>
              <th className="px-3 py-2 text-center font-medium">Products</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-center font-medium w-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50/50">
                <td className="px-3 py-2.5">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded" />
                    <div className="min-w-0 space-y-1">
                      <Skeleton className="h-4 w-[140px]" />
                      <Skeleton className="h-3 w-[180px]" />
                    </div>
                  </div>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <Skeleton className="h-4 w-8 mx-auto" />
                </td>
                <td className="px-3 py-2.5">
                  <Skeleton className="h-6 w-16 rounded-full" />
                </td>
                <td className="px-3 py-2.5 text-center">
                  <Skeleton className="h-8 w-8 rounded-md mx-auto" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Categories</h1>
        <Link href="/admin/categories/new">
          <Button size="sm" className="flex items-center gap-1.5 h-9 rounded-full">
            <Plus size={14} />
            Add Category
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg overflow-hidden border">
      {isLoading ? (
          <CategoryTableSkeleton />
        ) : error ? (
          <div className="bg-red-50 text-red-800 p-4 m-4 rounded-md">
            <p>{error}</p>
              <Button 
                variant="outline" 
              className="mt-2" 
              onClick={fetchCategories}
              >
              Try Again
              </Button>
          </div>
        ) : categories.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No categories found</p>
              <Link href="/admin/categories/new">
              <Button>Add Your First Category</Button>
              </Link>
        </div>
      ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2 text-left font-medium">Category</th>
                  <th className="px-3 py-2 text-center font-medium">Products</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-center font-medium w-10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {categories.map((category) => (
                  <tr key={category.id} className="hover:bg-gray-50/50">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded overflow-hidden flex-shrink-0 border border-gray-100">
                          {category.image ? (
                            <Image 
                              src={category.image} 
                              alt={category.name} 
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          ) : (
                            <div className="h-full w-full bg-gray-50 flex items-center justify-center text-gray-400">
                              <FolderIcon size={14} />
                  </div>
                    )}
                  </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate max-w-[180px]">{category.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[180px]">{category.slug}</p>
                    </div>
                  </div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <span className="text-xs font-medium text-gray-700">
                        {category._count.products}
                      </span>
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge 
                        variant={category.isActive ? "default" : "secondary"} 
                        className="text-xs font-normal"
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal size={16} />
                      </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/categories/edit/${category.id}`)}
                            className="cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => confirmDelete(category)}
                            className="cursor-pointer text-gray-700 focus:text-gray-700 hover:text-red-600 focus:hover:text-red-600"
                            disabled={isDeleting === category.id}
                          >
                            {isDeleting === category.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {categoryToDelete?._count.products ? (
                <>
                  <p>
                    This category has <strong>{categoryToDelete._count.products} products</strong> associated with it.
                  </p>
                  <p className="mt-2">
                    If you delete this category, these products will no longer be categorized.
                  </p>
                </>
              ) : (
                <p>This action cannot be undone.</p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-gray-900 hover:bg-gray-800"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
} 