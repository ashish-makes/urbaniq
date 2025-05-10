'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ShoppingCart,
  Package,
  DollarSign,
  ArrowUpRight,
  Gift,
  Heart,
  Settings,
  Grid3X3,
  Eye,
  Trash2,
  MoreHorizontal,
  Star,
  PlusCircle,
  Download,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  product: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'delivered' | 'cancelled';
}

interface WishlistItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: string;
  slug: string;
}

// Helper function for truncating text
const truncateText = (text: string, limit: number) => {
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '...';
};

// Helper function for status badge colors
const getStatusColor = (status: string) => {
  switch(status) {
    case 'delivered':
    case 'completed': return 'bg-green-50 text-green-600';
    case 'processing': return 'bg-blue-50 text-blue-600';
    case 'pending': return 'bg-amber-50 text-amber-600';
    case 'cancelled': return 'bg-red-50 text-red-600';
    default: return 'bg-gray-50 text-gray-600';
  }
};

// Stock status badge colors
const getStockColor = (stock: string) => {
  switch(stock) {
    case 'In Stock': return 'bg-green-50 text-green-600';
    case 'Low Stock': return 'bg-amber-50 text-amber-600';
    case 'Out of Stock': return 'bg-red-50 text-red-600';
    default: return 'bg-gray-50 text-gray-600';
  }
};

export default function UserDashboard() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState<Record<string, boolean>>({});
  const [stats, setStats] = useState({
    ordersCount: 0,
    totalSpent: 0,
    cartItems: 0,
    savedItems: 0
  });
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch orders from API
        const fetchOrders = async () => {
          try {
            const res = await fetch('/api/user/orders');
            if (!res.ok) throw new Error('Failed to fetch orders');
            const data = await res.json();
            return data || [];
          } catch (error) {
            console.error('Error fetching orders:', error);
            return [];
          }
        };

        // Fetch wishlist from API
        const fetchWishlist = async () => {
          try {
            const res = await fetch('/api/user/wishlist');
            if (!res.ok) throw new Error('Failed to fetch wishlist');
            const data = await res.json();
            return data || [];
          } catch (error) {
            console.error('Error fetching wishlist:', error);
            return [];
          }
        };

        // Fetch cart from API
        const fetchCartItems = async () => {
          try {
            const res = await fetch('/api/user/cart');
            if (!res.ok) throw new Error('Failed to fetch cart');
            const data = await res.json();
            return data?.length || 0;
          } catch (error) {
            console.error('Error fetching cart:', error);
            return 0;
          }
        };

        // Fetch all data in parallel
        const [orders, wishlist, cartItemsCount] = await Promise.all([
          fetchOrders(),
          fetchWishlist(),
          fetchCartItems()
        ]);
        
        // Process orders data if needed
        const processedOrders = Array.isArray(orders) ? orders.map((order: any) => ({
          id: order.id || '',
          orderNumber: order.orderNumber || '',
          date: order.date || new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }),
          product: order.product || order.productName || order.items?.[0]?.name || 'Product',
          total: order.total || 0,
          status: (order.status || 'pending').toLowerCase() as 'pending' | 'processing' | 'completed' | 'delivered' | 'cancelled'
        })).slice(0, 5) : []; // Only show 5 most recent orders

        // Process wishlist data if needed
        const processedWishlist = Array.isArray(wishlist) ? wishlist.map((item: any) => ({
          id: item.id || '',
          name: item.name || item.productName || '',
          price: item.price || 0,
          image: item.image || item.imageUrl || '/placeholder.svg',
          category: item.category || 'Uncategorized',
          stock: item.stock || 'In Stock',
          slug: item.slug || ''
        })).slice(0, 5) : []; // Only show 5 most recent wishlist items

        // Set the data
        setRecentOrders(processedOrders);
        setWishlistItems(processedWishlist);
        
        // Calculate stats
        const totalSpent = processedOrders.reduce((acc: number, order: Order) => acc + order.total, 0);
        
        setStats({
          ordersCount: Array.isArray(orders) ? orders.length : 0,
          totalSpent: totalSpent,
          cartItems: cartItemsCount,
          savedItems: Array.isArray(wishlist) ? wishlist.length : 0
        });

        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast.error('Failed to load dashboard data');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleRemoveWishlistItem = async (id: string) => {
    try {
      // Call API to remove item
      const response = await fetch(`/api/user/wishlist?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to remove item');
      
      // Update local state
      setWishlistItems(wishlistItems.filter(item => item.id !== id));
      setStats({
        ...stats,
        savedItems: stats.savedItems - 1
      });
      
      toast.success('Item removed from wishlist');
    } catch (error) {
      console.error('Error removing wishlist item:', error);
      toast.error('Failed to remove item');
    }
  };

  const handleAddToCart = async (id: string) => {
    // Set loading state for this specific item
    setIsAddingToCart(prev => ({ ...prev, [id]: true }));
    
    try {
      // Find the item
      const item = wishlistItems.find(item => item.id === id);
      if (!item) throw new Error('Item not found');
      
      // Call API to add item to cart
      const response = await fetch('/api/user/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          productId: item.id,
          quantity: 1 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item to cart');
      }
      
      // Update cart count
      setStats(prev => ({
        ...prev,
        cartItems: prev.cartItems + 1
      }));
      
      toast.success('Item added to cart successfully');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add item to cart');
    } finally {
      setIsAddingToCart(prev => ({ ...prev, [id]: false }));
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-medium">Your Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="flex flex-col items-center justify-center h-24 bg-gray-100 rounded-lg">
                  <div className="h-10 w-10 rounded-full bg-gray-200 mb-2" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
        <Link href="/user/orders" className="block">
          <div className="flex flex-col items-center justify-center h-24 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors group">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Package className="h-5 w-5 text-amber-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">My Orders</span>
          </div>
        </Link>
        
        <Link href="/user/wishlist" className="block">
          <div className="flex flex-col items-center justify-center h-24 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">Wishlist</span>
          </div>
        </Link>
        
        <Link href="/shop" className="block">
          <div className="flex flex-col items-center justify-center h-24 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Grid3X3 className="h-5 w-5 text-purple-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">Shop Now</span>
          </div>
        </Link>
        
        <Link href="/user/settings" className="block">
          <div className="flex flex-col items-center justify-center h-24 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Settings className="h-5 w-5 text-gray-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">Settings</span>
          </div>
        </Link>
          </>
        )}
      </div>
      
      {/* Stats Overview */}
      <div className="mb-6">
        <h2 className="text-base font-medium mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 rounded-full mr-3" />
                    <div>
                      <Skeleton className="h-4 w-20 mb-1" />
                      <Skeleton className="h-7 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <>
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center mr-3">
                <Package className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                  <p className="text-lg font-medium">{stats.ordersCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-green-50 flex items-center justify-center mr-3">
                <DollarSign className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                  <p className="text-lg font-medium">{formatCurrency(stats.totalSpent)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                <ShoppingCart className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cart Items</p>
                  <p className="text-lg font-medium">{stats.cartItems}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center mr-3">
                <Heart className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Saved Items</p>
                  <p className="text-lg font-medium">{stats.savedItems}</p>
              </div>
            </div>
          </div>
            </>
          )}
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">Recent Orders</h2>
          <Link href="/user/orders" className="text-xs text-blue-500 hover:text-blue-700 flex items-center">
            View all <ArrowUpRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
        <div className="bg-white rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="bg-gray-50 border-b border-gray-100 p-3">
                <div className="grid grid-cols-6 gap-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
              </div>
              
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-gray-50 p-3">
                  <div className="grid grid-cols-6 gap-4">
                    <Skeleton className="h-5 w-4/5" />
                    <div className="flex items-center">
                      <Skeleton className="h-5 w-full" />
                    </div>
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-1/2 ml-auto" />
                    <div className="flex justify-center">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="flex justify-center">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left font-medium text-gray-500 p-3">Order ID</th>
                    <th className="text-left font-medium text-gray-500 p-3">Product</th>
                    <th className="text-left font-medium text-gray-500 p-3">Date</th>
                    <th className="text-right font-medium text-gray-500 p-3">Amount</th>
                    <th className="text-center font-medium text-gray-500 p-3">Status</th>
                    <th className="text-center font-medium text-gray-500 p-3 w-16">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">{order.orderNumber}</td>
                      <td className="p-3 max-w-[180px]">
                        <div className="truncate" title={order.product}>
                          {truncateText(order.product, 25)}
                        </div>
                      </td>
                      <td className="p-3 text-gray-500">{order.date}</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(order.total)}</td>
                      <td className="p-3 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                      </td>
                      <td className="p-3 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              asChild
                            >
                              <Link href={`/user/orders/${order.id}`}>
                                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                <span>View Details</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              asChild
                            >
                              <Link href={`/user/reviews/add?orderId=${order.id}`}>
                                <Star className="mr-2 h-4 w-4 text-amber-500" />
                                <span>Leave Review</span>
                          </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Download className="mr-2 h-4 w-4 text-purple-500" />
                              <span>Download Invoice</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Package className="h-10 w-10 mx-auto text-gray-200 mb-2" />
              <p className="text-gray-500 text-sm">You haven't placed any orders yet</p>
              <Link href="/shop">
                <Button variant="outline" className="mt-3">Shop Now</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      
      {/* Wishlist */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">Your Wishlist</h2>
          <Link href="/user/wishlist" className="text-xs text-blue-500 hover:text-blue-700 flex items-center">
            View all <ArrowUpRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
        <div className="bg-white rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="bg-gray-50 border-b border-gray-100 p-3">
                <div className="grid grid-cols-5 gap-4">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2 mx-auto" />
                </div>
              </div>
              
              {[1, 2, 3].map((i) => (
                <div key={i} className="border-b border-gray-50 p-3">
                  <div className="grid grid-cols-5 gap-4">
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 mr-3 rounded" />
                      <Skeleton className="h-5 w-28" />
                    </div>
                    <Skeleton className="h-5 w-3/4 my-auto" />
                    <Skeleton className="h-5 w-1/2 ml-auto my-auto" />
                    <div className="flex justify-center my-auto">
                      <Skeleton className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="flex justify-center my-auto">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : wishlistItems.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left font-medium text-gray-500 p-3">Product</th>
                    <th className="text-left font-medium text-gray-500 p-3">Category</th>
                    <th className="text-right font-medium text-gray-500 p-3">Price</th>
                    <th className="text-center font-medium text-gray-500 p-3">Availability</th>
                    <th className="text-center font-medium text-gray-500 p-3 w-16">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wishlistItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0 mr-3 overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="font-medium truncate max-w-[150px]" title={item.name}>
                            {truncateText(item.name, 20)}
                          </div>
                        </div>
                      </td>
                      <td className="p-3 text-gray-500">{item.category}</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(item.price)}</td>
                      <td className="p-3 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStockColor(item.stock)}`}>
                            {item.stock}
                          </span>
                      </td>
                      <td className="p-3 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              asChild
                            >
                              <Link href={`/products/${item.slug}`}>
                                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                <span>View Product</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              disabled={item.stock === 'Out of Stock' || isAddingToCart[item.id]}
                              onClick={() => handleAddToCart(item.id)}
                            >
                              {isAddingToCart[item.id] ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-green-500" />
                                  <span>Adding...</span>
                                </>
                              ) : (
                                <>
                                  <PlusCircle className="mr-2 h-4 w-4 text-green-500" />
                                  <span>{item.stock === 'Out of Stock' ? 'Out of Stock' : 'Add to Cart'}</span>
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              onClick={() => handleRemoveWishlistItem(item.id)}
                            >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Remove</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center">
              <Heart className="h-10 w-10 mx-auto text-gray-200 mb-2" />
              <p className="text-gray-500 text-sm">Your wishlist is empty</p>
              <Link href="/shop">
                <Button variant="outline" className="mt-3">Discover Products</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 