'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  MoreHorizontal,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface Product {
  id: string;
  name: string;
  description: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  stock: number;
  category: string;
  images: string[];
  inStock: boolean;
  featured?: boolean;
  isBestseller?: boolean;
  freeShipping?: boolean;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/admin/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      setIsDeleting(id);
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter((product) => product.id !== id));
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(null);
    }
  };

  // Calculate discount percentage
  const calculateDiscount = (originalPrice: number | null, price: number) => {
    if (!originalPrice || originalPrice <= price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  // Get product status
  const getProductStatus = (product: Product) => {
    if (!product.inStock) return { label: 'Out of Stock', variant: 'destructive' };
    if (product.featured) return { label: 'Featured', variant: 'default' };
    if (product.isBestseller) return { label: 'Bestseller', variant: 'secondary' };
    return { label: 'Active', variant: 'outline' };
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button size="sm" className="flex items-center gap-1.5 h-9 rounded-full">
            <Plus size={14} />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No products found</p>
            <Link href="/admin/products/new">
              <Button>Add Your First Product</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2 text-left font-medium">Product</th>
                  <th className="px-3 py-2 text-left font-medium">Category</th>
                  <th className="px-3 py-2 text-left font-medium">Price</th>
                  <th className="px-3 py-2 text-center font-medium">Stock</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-center font-medium w-10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map((product) => {
                  const discount = calculateDiscount(product.originalPrice, product.price);
                  const status = getProductStatus(product);
                  
                  return (
                    <tr key={product.id} className="hover:bg-gray-50/50">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded overflow-hidden flex-shrink-0 border border-gray-100">
                            {product.images && product.images.length > 0 ? (
                              <Image
                                src={product.images[0]}
                                alt={product.name}
                                className="object-cover"
                                fill
                                sizes="40px"
                              />
                            ) : (
                              <div className="h-full w-full bg-gray-50 flex items-center justify-center text-gray-400">
                                <ShoppingBag size={14} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-[180px]">{product.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[180px]">{product.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-1 bg-gray-50 text-gray-600 rounded-full text-xs">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <div className="flex flex-col">
                          <span className="font-medium">${product.price.toFixed(2)}</span>
                          {discount > 0 && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-400 line-through">${product.originalPrice?.toFixed(2)}</span>
                              <span className="text-xs text-red-500">-{discount}%</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`text-xs font-medium ${
                          product.stock > 50 
                            ? 'text-green-600' 
                            : product.stock > 10 
                              ? 'text-amber-600' 
                              : 'text-red-500'
                        }`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge 
                          variant={status.variant as any} 
                          className="text-xs font-normal"
                        >
                          {status.label}
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
                              onClick={() => router.push(`/products/${product.slug}`)}
                              className="cursor-pointer"
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteProduct(product.id)}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              disabled={isDeleting === product.id}
                            >
                              {isDeleting === product.id ? (
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
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 
 