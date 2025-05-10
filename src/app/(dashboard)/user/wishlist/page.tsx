'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Heart,
  ShoppingCart,
  MoreHorizontal,
  Eye,
  Trash2,
  Loader2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: string;
  slug: string;
  description?: string;
  date?: string; // For sorting by date added
  productId: string;
}

// Helper function for truncating text
const truncateText = (text: string, limit: number) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '...';
};

// Stock status badge colors
const getStockColor = (stock: string) => {
  switch(stock) {
    case 'In Stock': 
      return 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100';
    case 'Low Stock': 
      return 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100';
    case 'Out of Stock': 
      return 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100';
    default: 
      return 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100';
  }
};

export default function UserWishlistPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<WishlistItem[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState<Record<string, boolean>>({});
  const [isRemovingFromCart, setIsRemovingFromCart] = useState<Record<string, boolean>>({});
  const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({});
  const [itemsInCart, setItemsInCart] = useState<Record<string, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState<string[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    // Redirect if not logged in
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    fetchWishlist();
    
    if (status === 'authenticated') {
      fetchCartItems(); // Check which items are already in cart
    }
  }, [status, router]);

  // Fetch wishlist data with the latest information
  const fetchWishlist = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/wishlist', {
        cache: 'no-store', // Ensure we don't use cached data
        next: { revalidate: 0 } // Prevent Next.js caching
      });
      if (!res.ok) throw new Error('Failed to fetch wishlist');
      
      const data = await res.json();
      // Process wishlist data if needed
      const processedWishlist = Array.isArray(data) ? data.map((item: any) => ({
        id: item.id || '',
        productId: item.productId || item.id || '',
        name: item.name || item.productName || '',
        price: item.price || 0,
        image: item.image || item.imageUrl || '/placeholder.svg',
        category: item.category || 'Uncategorized',
        stock: item.stock || 'In Stock', // Use the stock status from the API directly
        slug: item.slug || '',
        description: item.description || '',
        date: item.createdAt || item.addedAt || new Date().toISOString() 
      })) : [];
      
      // Extract unique categories for the filter
      const uniqueCategories = [...new Set(processedWishlist.map(item => item.category))];
      setCategories(uniqueCategories);
      
      setWishlistItems(processedWishlist);
      setFilteredItems(processedWishlist);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch cart items to check which wishlist items are already in cart
  const fetchCartItems = async () => {
    try {
      const res = await fetch('/api/user/cart');
      if (!res.ok) throw new Error('Failed to fetch cart items');
      
      const cartItems = await res.json();
      const cartItemMap: Record<string, boolean> = {};
      
      // Create a map of product IDs that are in the cart
      if (Array.isArray(cartItems)) {
        cartItems.forEach(item => {
          if (item.productId) {
            cartItemMap[item.productId] = true;
          }
        });
      }
      
      setItemsInCart(cartItemMap);
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };
  
  useEffect(() => {
    // Sort items by date, newest first
    let result = [...wishlistItems].sort((a, b) => {
      return new Date(b.date || '').getTime() - new Date(a.date || '').getTime();
    });
    
    setFilteredItems(result);
  }, [wishlistItems]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  
  const handleRemoveFromWishlist = async (id: string) => {
    // Set loading state for this specific item
    setIsRemoving(prev => ({ ...prev, [id]: true }));
    
    try {
      // Call API to remove item
      const response = await fetch(`/api/user/wishlist?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to remove item');
      
      // Update local state
      const updatedItems = wishlistItems.filter(item => item.id !== id);
      setWishlistItems(updatedItems);
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing wishlist item:', error);
      toast.error('Failed to remove item');
    } finally {
      setIsRemoving(prev => ({ ...prev, [id]: false }));
    }
  };
  
  const handleAddToCart = async (id: string) => {
    // Set loading state for this specific item
    setIsAddingToCart(prev => ({ ...prev, [id]: true }));
    
    try {
      // Find the product ID
      const item = wishlistItems.find(item => item.id === id);
      if (!item) throw new Error('Item not found');
      
      // Make sure we have a valid productId
      if (!item.productId) {
        console.error('Missing productId for item:', item);
        throw new Error('Invalid product ID');
      }
      
      // Call API to add item to cart
      const response = await fetch('/api/user/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId: item.productId, 
          quantity: 1 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        console.error('API error response:', data);
        throw new Error(data.message || 'Failed to add item to cart');
      }
      
      // Update the itemsInCart state to show item is now in cart
      setItemsInCart(prev => ({ ...prev, [item.productId]: true }));
      
      toast.success('Item added to cart successfully', {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add item to cart', {
        icon: <XCircle className="h-4 w-4 text-red-500" />,
      });
    } finally {
      setIsAddingToCart(prev => ({ ...prev, [id]: false }));
    }
  };
  
  const handleRemoveFromCart = async (id: string) => {
    // Set loading state for this specific item
    setIsRemovingFromCart(prev => ({ ...prev, [id]: true }));
    
    try {
      // Find the product ID
      const item = wishlistItems.find(item => item.id === id);
      if (!item) throw new Error('Item not found');
      
      // Find the cart item with this product ID
      const cartRes = await fetch('/api/user/cart');
      if (!cartRes.ok) throw new Error('Failed to fetch cart');
      
      const cartItems = await cartRes.json();
      const cartItem = Array.isArray(cartItems) 
        ? cartItems.find(cartItem => cartItem.productId === item.productId)
        : null;
      
      if (!cartItem) throw new Error('Item not found in cart');
      
      // Call API to remove item from cart
      const response = await fetch(`/api/user/cart/items/${cartItem.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData);
        throw new Error(errorData.error || 'Failed to remove item from cart');
      }
      
      // Update the itemsInCart state
      setItemsInCart(prev => {
        const updated = { ...prev };
        delete updated[item.productId];
        return updated;
      });
      
      toast.success('Item removed from cart', {
        icon: <CheckCircle className="h-4 w-4 text-green-500" />,
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to remove item from cart', {
        icon: <XCircle className="h-4 w-4 text-red-500" />,
      });
    } finally {
      setIsRemovingFromCart(prev => ({ ...prev, [id]: false }));
    }
  };
  
  // Skeleton loader
  const WishlistTableSkeleton = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Category</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
              <th className="px-4 py-3 text-center font-medium">Availability</th>
              <th className="px-4 py-3 text-center font-medium w-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-md mr-3" />
                    <div>
                      <Skeleton className="h-4 w-[180px] mb-1" />
                      <Skeleton className="h-3 w-[120px]" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-[100px]" />
                </td>
                <td className="px-4 py-3 text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Skeleton className="h-6 w-20 rounded-full mx-auto" />
                </td>
                <td className="px-4 py-3 text-center">
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
      <div className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <h1 className="text-2xl font-semibold">Your Wishlist</h1>
        </div>
      </div>
      
      {loading ? (
        <div className="bg-white rounded-lg overflow-hidden">
          <WishlistTableSkeleton />
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
          <p className="text-gray-500 mb-4 max-w-md mx-auto">
            Start saving items you love for later by clicking the heart icon on product pages
          </p>
          <Button 
            onClick={() => router.push('/shop')}
          >
            Browse Products
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50">
              <TableRow className="border-b border-gray-100 hover:bg-gray-50">
                <TableHead className="py-3 px-4 font-medium">
                  <div className="flex items-center">
                    Product
                  </div>
                </TableHead>
                <TableHead className="py-3 px-4 font-medium">
                  <div className="flex items-center">
                    Category
                  </div>
                </TableHead>
                <TableHead className="py-3 px-4 text-right font-medium">
                  <div className="flex items-center justify-end">
                    Price
                  </div>
                </TableHead>
                <TableHead className="py-3 px-4 text-center font-medium">
                  Availability
                </TableHead>
                <TableHead className="py-3 px-4 text-center font-medium w-16">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentItems.map((item) => (
                <TableRow key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-md bg-gray-100 flex-shrink-0 mr-3 overflow-hidden">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-200">
                            <Heart className="h-4 w-4 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div 
                          className="font-medium text-gray-900 hover:text-blue-600 cursor-pointer"
                          onClick={() => router.push(`/products/${item.slug}`)}
                        >
                          {truncateText(item.name, 30)}
                        </div>
                        {item.description && (
                          <div className="text-xs text-gray-500 mt-1">
                            {truncateText(item.description, 40)}
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-gray-500">{item.category}</TableCell>
                  <TableCell className="py-3 px-4 text-right font-medium">{formatCurrency(item.price)}</TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    <Badge className={`px-2 py-1 text-xs font-normal ${getStockColor(item.stock)}`}>
                      {item.stock}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[200px]">
                        <DropdownMenuItem
                          onClick={() => router.push(`/products/${item.slug}`)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4 text-blue-500" />
                          <span>View Product</span>
                        </DropdownMenuItem>
                        
                        {itemsInCart[item.productId] ? (
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleRemoveFromCart(item.id)}
                            disabled={isRemovingFromCart[item.id] || isAddingToCart[item.id]}
                          >
                            {isRemovingFromCart[item.id] ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin text-red-500" />
                                <span>Removing...</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="mr-2 h-4 w-4 text-red-500" />
                                <span>Remove from Cart</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleAddToCart(item.id)}
                            disabled={isAddingToCart[item.id] || item.stock === 'Out of Stock'}
                          >
                            {isAddingToCart[item.id] ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin text-green-500" />
                                <span>Adding...</span>
                              </>
                            ) : (
                              <>
                                <ShoppingCart className="mr-2 h-4 w-4 text-green-500" />
                                <span>{item.stock === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem 
                          className="cursor-pointer text-red-600 focus:text-red-600"
                          onClick={() => handleRemoveFromWishlist(item.id)}
                          disabled={isRemoving[item.id]}
                        >
                          {isRemoving[item.id] ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              <span>Removing...</span>
                            </>
                          ) : (
                            <>
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Remove</span>
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex justify-center p-4">
              <div className="flex items-center justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i + 1 ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 