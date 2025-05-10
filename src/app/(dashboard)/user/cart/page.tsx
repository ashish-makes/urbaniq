'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ShoppingCart,
  Trash2,
  Loader2,
  Heart,
  MoreHorizontal,
  Eye,
  X
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
  slug: string;
  maxQuantity?: number;
}

// Helper function for truncating text
const truncateText = (text: string, limit: number) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '...';
};

export default function UserCartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isRemoving, setIsRemoving] = useState<Record<string, boolean>>({});
  const [isMovingToWishlist, setIsMovingToWishlist] = useState<Record<string, boolean>>({});
  const [isRemovingFromWishlist, setIsRemovingFromWishlist] = useState<Record<string, boolean>>({});
  const [itemsInWishlist, setItemsInWishlist] = useState<Record<string, boolean>>({});
  
  useEffect(() => {
    // Redirect if not logged in
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/user/cart');
        if (!res.ok) throw new Error('Failed to fetch cart');
        
        const data = await res.json();
        // Process cart data if needed
        const processedCart = Array.isArray(data) ? data.map((item: any) => ({
          id: item.id || '',
          productId: item.productId || '',
          name: item.name || item.productName || '',
          price: item.price || 0,
          image: item.image || item.imageUrl || '/placeholder.svg',
          quantity: item.quantity || 1,
          stock: item.stock || 0,
          maxQuantity: item.maxQuantity || item.stock || 10,
          slug: item.slug || ''
        })) : [];
        
        setCartItems(processedCart);
      } catch (error) {
        console.error('Error fetching cart:', error);
        toast.error('Failed to load cart');
      } finally {
        setLoading(false);
      }
    };
    
    if (status === 'authenticated') {
      fetchCart();
      fetchWishlistItems(); // Check which items are already in wishlist
    }
  }, [status, router]);
  
  // Fetch wishlist items to check which cart items are already in wishlist
  const fetchWishlistItems = async () => {
    try {
      const res = await fetch('/api/user/wishlist');
      if (!res.ok) throw new Error('Failed to fetch wishlist items');
      
      const wishlistItems = await res.json();
      const wishlistItemMap: Record<string, boolean> = {};
      
      // Create a map of product IDs that are in the wishlist
      if (Array.isArray(wishlistItems)) {
        wishlistItems.forEach(item => {
          if (item.productId) {
            wishlistItemMap[item.productId] = true;
          }
        });
      }
      
      setItemsInWishlist(wishlistItemMap);
    } catch (error) {
      console.error('Error fetching wishlist items:', error);
    }
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  const handleRemoveItem = async (id: string) => {
    // Set loading state for this specific item
    setIsRemoving(prev => ({ ...prev, [id]: true }));
    
    try {
      // Call API to remove item
      const response = await fetch(`/api/user/cart?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to remove item');
      
      // Update local state
      const updatedItems = cartItems.filter(item => item.id !== id);
      setCartItems(updatedItems);
      
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing cart item:', error);
      toast.error('Failed to remove item');
    } finally {
      setIsRemoving(prev => ({ ...prev, [id]: false }));
    }
  };
  
  const handleAddToWishlist = async (productId: string, itemId: string) => {
    setIsMovingToWishlist(prev => ({ ...prev, [itemId]: true }));
    
    try {
      // Call API to add item to wishlist
      const response = await fetch('/api/user/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productId }),
      });
      
      if (!response.ok) throw new Error('Failed to add item to wishlist');
      
      // Update the itemsInWishlist state
      setItemsInWishlist(prev => ({ ...prev, [productId]: true }));
      
      // Remove from cart after adding to wishlist
      await handleRemoveItem(itemId);
      
      toast.success('Item moved to wishlist', {
        icon: <Heart className="h-4 w-4 text-red-500" />,
      });
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to move item to wishlist');
    } finally {
      setIsMovingToWishlist(prev => ({ ...prev, [itemId]: false }));
    }
  };
  
  const handleRemoveFromWishlist = async (productId: string, itemId: string) => {
    setIsRemovingFromWishlist(prev => ({ ...prev, [itemId]: true }));
    
    try {
      // Find the wishlist item with this product ID
      const wishlistRes = await fetch('/api/user/wishlist');
      if (!wishlistRes.ok) throw new Error('Failed to fetch wishlist');
      
      const wishlistItems = await wishlistRes.json();
      const wishlistItem = Array.isArray(wishlistItems) 
        ? wishlistItems.find(item => item.productId === productId)
        : null;
      
      if (!wishlistItem) throw new Error('Item not found in wishlist');
      
      // Call API to remove item from wishlist
      const response = await fetch(`/api/user/wishlist?id=${wishlistItem.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to remove from wishlist');
      
      // Update the itemsInWishlist state
      setItemsInWishlist(prev => {
        const updated = { ...prev };
        delete updated[productId];
        return updated;
      });
      
      toast.success('Item removed from wishlist', {
        icon: <X className="h-4 w-4 text-gray-500" />,
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    } finally {
      setIsRemovingFromWishlist(prev => ({ ...prev, [itemId]: false }));
    }
  };
  
  // Skeleton loader
  const CartTableSkeleton = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="border-b border-gray-100">
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">Price</th>
              <th className="px-4 py-3 text-center font-medium">Quantity</th>
              <th className="px-4 py-3 text-right font-medium">Total</th>
              <th className="px-4 py-3 text-center font-medium w-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[...Array(3)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50/50">
                <td className="px-4 py-3">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-md mr-3" />
                    <div>
                      <Skeleton className="h-4 w-[180px] mb-1" />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Skeleton className="h-4 w-[80px]" />
                </td>
                <td className="px-4 py-3 text-center">
                  <Skeleton className="h-4 w-[40px] mx-auto" />
                </td>
                <td className="px-4 py-3 text-right">
                  <Skeleton className="h-4 w-[80px] ml-auto" />
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
          <h1 className="text-2xl font-semibold">Your Shopping Cart</h1>
          <p className="text-sm text-gray-500">
            {cartItems.length > 0 
              ? `You have ${cartItems.length} item${cartItems.length !== 1 ? 's' : ''} in your cart`
              : 'Your cart is currently empty'}
          </p>
        </div>
      </div>
      
      {loading ? (
        <div className="bg-white rounded-lg overflow-hidden">
          <CartTableSkeleton />
        </div>
      ) : cartItems.length > 0 ? (
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
                    Price
                  </div>
                </TableHead>
                <TableHead className="py-3 px-4 text-center font-medium">
                  Quantity
                </TableHead>
                <TableHead className="py-3 px-4 text-right font-medium">
                  <div className="flex items-center justify-end">
                    Total
                  </div>
                </TableHead>
                <TableHead className="py-3 px-4 text-center font-medium w-16">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                  <TableCell className="py-3 px-4">
                    <div className="flex items-center">
                      <div 
                        className="w-10 h-10 rounded-md bg-gray-100 flex-shrink-0 mr-3 overflow-hidden"
                        onClick={() => router.push(`/products/${item.slug}`)}
                        style={{ cursor: 'pointer' }}
                      >
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-gray-200">
                            <ShoppingCart className="h-4 w-4 text-gray-400" />
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
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="py-3 px-4">{formatCurrency(item.price)}</TableCell>
                  <TableCell className="py-3 px-4 text-center">{item.quantity}</TableCell>
                  <TableCell className="py-3 px-4 text-right font-medium">{formatCurrency(item.price * item.quantity)}</TableCell>
                  <TableCell className="py-3 px-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal size={16} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[240px]">
                        <DropdownMenuItem
                          onClick={() => router.push(`/products/${item.slug}`)}
                          className="cursor-pointer"
                        >
                          <Eye className="mr-2 h-4 w-4 text-blue-500" />
                          <span>View Product</span>
                        </DropdownMenuItem>
                        
                        {itemsInWishlist[item.productId] ? (
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleRemoveFromWishlist(item.productId, item.id)}
                            disabled={isRemovingFromWishlist[item.id]}
                          >
                            {isRemovingFromWishlist[item.id] ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin text-gray-500" />
                                <span>Removing...</span>
                              </>
                            ) : (
                              <>
                                <X className="mr-2 h-4 w-4 text-gray-500" />
                                <span>Remove from Wishlist</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => handleAddToWishlist(item.productId, item.id)}
                            disabled={isMovingToWishlist[item.id]}
                          >
                            {isMovingToWishlist[item.id] ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin text-red-500" />
                                <span>Moving...</span>
                              </>
                            ) : (
                              <>
                                <Heart className="mr-2 h-4 w-4 text-red-500" />
                                <span>Move to Wishlist</span>
                              </>
                            )}
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem 
                          className="cursor-pointer text-red-600 focus:text-red-600"
                          onClick={() => handleRemoveItem(item.id)}
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
              <TableRow>
                <TableCell colSpan={3} className="text-right py-4 px-4 font-medium">
                  Cart Total:
                </TableCell>
                <TableCell className="text-right py-4 px-4 font-medium">
                  {formatCurrency(cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0))}
                </TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 text-center border border-gray-100 shadow-sm">
          <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <ShoppingCart className="h-8 w-8 text-gray-300" />
          </div>
          <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
          <p className="text-gray-500 mb-4 max-w-md mx-auto">
            Looks like you haven't added any products to your cart yet
          </p>
          <Button onClick={() => router.push('/shop')}>
            Start Shopping
          </Button>
        </div>
      )}
    </div>
  );
} 