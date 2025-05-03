'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LineChart,
  BarChart,
  ShoppingCart,
  Package,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Gift,
  Heart,
  Truck,
  Clock,
  Settings,
  ChevronRight,
  Grid3X3,
  Eye,
  PlusCircle,
  Trash2,
  MoreHorizontal,
} from 'lucide-react';
import Link from 'next/link';

// Mock data for user dashboard
const recentOrders = [
  { id: 'ORD-1234', date: '12 May, 2023', product: 'Modern Desk Lamp', price: 89, status: 'delivered' },
  { id: 'ORD-1235', date: '20 May, 2023', product: 'Ergonomic Chair', price: 249, status: 'processing' },
  { id: 'ORD-1236', date: '28 May, 2023', product: 'Wireless Charger', price: 35, status: 'delivered' },
];

const wishlistItems = [
  { id: 'PRD-567', name: 'Minimal Floor Lamp', price: 129, image: '/placeholder.svg', category: 'Lighting', stock: 'In Stock' },
  { id: 'PRD-568', name: 'Smart Home Hub', price: 199, image: '/placeholder.svg', category: 'Electronics', stock: 'In Stock' },
  { id: 'PRD-569', name: 'Premium Bluetooth Headphones', price: 159, image: '/placeholder.svg', category: 'Audio', stock: 'Low Stock' },
];

// Helper function for status badge colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'delivered':
      return 'bg-green-50 text-green-700';
    case 'processing':
      return 'bg-blue-50 text-blue-700';
    case 'cancelled':
      return 'bg-red-50 text-red-700';
    case 'shipped':
      return 'bg-purple-50 text-purple-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
};

// Stock status badge colors
const getStockColor = (stock: string) => {
  switch (stock) {
    case 'In Stock':
      return 'bg-green-50 text-green-700';
    case 'Low Stock':
      return 'bg-amber-50 text-amber-700';
    case 'Out of Stock':
      return 'bg-red-50 text-red-700';
    default:
      return 'bg-gray-50 text-gray-700';
  }
};

// Format currency
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export default function UserDashboard() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
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
        <Link href="/user/orders">
          <div className="flex flex-col items-center justify-center h-24 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors group">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Package className="h-5 w-5 text-amber-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">My Orders</span>
          </div>
        </Link>
        
        <Link href="/user/wishlist">
          <div className="flex flex-col items-center justify-center h-24 bg-red-50 rounded-lg hover:bg-red-100 transition-colors group">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Heart className="h-5 w-5 text-red-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">Wishlist</span>
          </div>
        </Link>
        
        <Link href="/shop">
          <div className="flex flex-col items-center justify-center h-24 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Grid3X3 className="h-5 w-5 text-purple-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">Shop Now</span>
          </div>
        </Link>
        
        <Link href="/user/settings">
          <div className="flex flex-col items-center justify-center h-24 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Settings className="h-5 w-5 text-gray-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">Settings</span>
          </div>
        </Link>
      </div>
      
      {/* Stats Overview */}
      <div className="mb-8">
        <h2 className="text-base font-medium mb-4">Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center mr-3">
                <Package className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-medium">12</p>
                )}
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
                {isLoading ? (
                  <Skeleton className="h-7 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-medium">{formatCurrency(1248)}</p>
                )}
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
                {isLoading ? (
                  <Skeleton className="h-7 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-medium">3</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                <Gift className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Savings</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-medium">{formatCurrency(145)}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Orders */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">Recent Orders</h2>
          <Link href="/user/orders" className="text-xs text-blue-500 hover:text-blue-700 flex items-center">
            View all <ArrowUpRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
        <div className="bg-white rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left font-medium text-gray-500 p-3">Order ID</th>
                    <th className="text-left font-medium text-gray-500 p-3">Product</th>
                    <th className="text-left font-medium text-gray-500 p-3">Date</th>
                    <th className="text-right font-medium text-gray-500 p-3">Amount</th>
                    <th className="text-center font-medium text-gray-500 p-3">Status</th>
                    <th className="text-center font-medium text-gray-500 p-3 w-10">View</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">{order.id}</td>
                      <td className="p-3">{order.product}</td>
                      <td className="p-3 text-gray-500">{order.date}</td>
                      <td className="p-3 text-right">{formatCurrency(order.price)}</td>
                      <td className="p-3">
                        <div className="flex justify-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center">
                          <Link href={`/user/orders/${order.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Wishlist Preview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">Your Wishlist</h2>
          <Link href="/user/wishlist" className="text-xs text-blue-500 hover:text-blue-700 flex items-center">
            View all <ArrowUpRight className="h-3 w-3 ml-1" />
          </Link>
        </div>
        
        <div className="bg-white rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="p-4">
              <Skeleton className="h-8 w-full mb-4" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full mb-2" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left font-medium text-gray-500 p-3">Product</th>
                    <th className="text-left font-medium text-gray-500 p-3">Category</th>
                    <th className="text-right font-medium text-gray-500 p-3">Price</th>
                    <th className="text-center font-medium text-gray-500 p-3">Availability</th>
                    <th className="text-center font-medium text-gray-500 p-3 w-24">Actions</th>
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
                          <div className="font-medium">{item.name}</div>
                        </div>
                      </td>
                      <td className="p-3 text-gray-500">{item.category}</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(item.price)}</td>
                      <td className="p-3">
                        <div className="flex justify-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStockColor(item.stock)}`}>
                            {item.stock}
                          </span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="flex items-center cursor-pointer">
                                <ShoppingCart className="mr-2 h-4 w-4" />
                                <span>Add to Cart</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center text-red-500 cursor-pointer">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Remove</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 