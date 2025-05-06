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
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  Plus,
  Grid3X3,
  Settings,
  User,
  ArrowUpRight,
  MoreHorizontal,
  Edit,
  Eye,
  Trash2,
  Download,
  Loader2,
  Folder
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Stats {
  users: number;
  products: number;
  revenue: number;
  orders: number;
}

interface RecentOrder {
  id: string;
  date: string;
  customer: string;
  total: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
}

interface Product {
  id: string;
  name: string;
  price: number;
  createdAt: string;
  category: string;
  stock: number;
  slug: string;
}

interface RecentProduct {
  id: string;
  name: string;
  price: number;
  date: string;
  slug: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
}

interface NewUser {
  id: string;
  name: string;
  email: string;
  joinDate: string;
  role: string;
}

// Add this utility function for truncating text
const truncateText = (text: string, limit: number) => {
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '...';
};

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const [newUsers, setNewUsers] = useState<NewUser[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Fetch users from the API
        const fetchUsers = async () => {
          const res = await fetch('/api/admin/users');
          const data = await res.json();
          return data;
        };

        // Fetch products from the API
        const fetchProducts = async () => {
          const res = await fetch('/api/admin/products');
          const data = await res.json();
          return data;
        };

        // Fetch orders - For now we'll use placeholder data as there's no order API yet
        const fetchOrders = async () => {
          // In a real app, you would fetch from an API endpoint like:
          // const res = await fetch('/api/admin/orders');
          // return await res.json();
          
          // Placeholder data for orders
          return [
            { id: 'ORD-5872', date: '2023-09-15', customer: 'Alex Johnson', total: 249, status: 'completed' as const },
            { id: 'ORD-5871', date: '2023-09-14', customer: 'Maria Garcia', total: 129, status: 'processing' as const },
            { id: 'ORD-5870', date: '2023-09-13', customer: 'John Smith', total: 89, status: 'pending' as const },
            { id: 'ORD-5869', date: '2023-09-12', customer: 'Emma Wilson', total: 159, status: 'completed' as const },
            { id: 'ORD-5868', date: '2023-09-11', customer: 'David Lopez', total: 199, status: 'cancelled' as const },
          ];
        };

        // Fetch all data in parallel
        const [usersData, productsData, ordersData] = await Promise.all([
          fetchUsers(),
          fetchProducts(),
          fetchOrders()
        ]);

        // Process users data
        const processedUsers = usersData.map((user: User) => ({
          id: user.id,
          name: user.name || 'Unnamed User',
          email: user.email,
          joinDate: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          role: user.role
        })).slice(0, 5);

        // Process products data
        const processedProducts = productsData.map((product: Product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          date: new Date(product.createdAt).toISOString().split('T')[0],
          slug: product.slug
        })).slice(0, 5);

        // Set stats based on the fetched data
        setStats({
          users: usersData.length,
          products: productsData.length,
          revenue: productsData.reduce((acc: number, product: Product) => acc + product.price, 0),
          orders: ordersData.length
        });

        setNewUsers(processedUsers);
        setRecentProducts(processedProducts);
        setRecentOrders(ordersData);
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
  
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-50 text-green-600';
      case 'processing': return 'bg-blue-50 text-blue-600';
      case 'pending': return 'bg-amber-50 text-amber-600';
      case 'cancelled': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };
  
  // Add getRoleBadgeColor function
  const getRoleBadgeColor = (role: string) => {
    switch(role.toUpperCase()) {
      case 'ADMIN': return 'bg-red-50 text-red-600';
      case 'MANAGER': return 'bg-purple-50 text-purple-600';
      case 'USER': return 'bg-blue-50 text-blue-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  // Add function to handle product deletion
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) {
      return;
    }
    
    try {
      setIsDeleting(`product-${id}`);
      const response = await fetch(`/api/admin/products?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      
      setRecentProducts(recentProducts.filter(product => product.id !== id));
      // Update stats count if needed
      if (stats) {
        setStats({
          ...stats,
          products: stats.products - 1
        });
      }
      toast.success('Product deleted successfully');
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Failed to delete product');
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Add function to handle user deletion
  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      setIsDeleting(`user-${id}`);
      const response = await fetch(`/api/admin/users?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete user');
      }
      
      setNewUsers(newUsers.filter(user => user.id !== id));
      // Update stats count if needed
      if (stats) {
        setStats({
          ...stats,
          users: stats.users - 1
        });
      }
      toast.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-medium">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome back, {session?.user?.name || 'Admin'}</p>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <Link href="/admin/products/new">
          <div className="flex flex-col items-center justify-center h-24 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors group">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Plus className="h-5 w-5 text-purple-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">Add Product</span>
          </div>
        </Link>
        
        <Link href="/admin/products">
          <div className="flex flex-col items-center justify-center h-24 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors group">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Grid3X3 className="h-5 w-5 text-indigo-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">Products</span>
          </div>
        </Link>
        
        <Link href="/admin/categories">
          <div className="flex flex-col items-center justify-center h-24 bg-green-50 rounded-lg hover:bg-green-100 transition-colors group">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Folder className="h-5 w-5 text-green-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">Categories</span>
          </div>
        </Link>
        
        <Link href="/admin/users">
          <div className="flex flex-col items-center justify-center h-24 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group">
            <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <span className="text-sm font-medium text-gray-700">Users</span>
          </div>
        </Link>
        
        <Link href="/admin/settings">
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
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
                <Users className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-medium">{stats?.users.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-purple-50 flex items-center justify-center mr-3">
                <Package className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Products</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-medium">{stats?.products.toLocaleString()}</p>
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
                <p className="text-sm text-gray-500">Revenue</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-medium">{formatCurrency(stats?.revenue || 0)}</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center mr-3">
                <ShoppingCart className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Orders</p>
                {isLoading ? (
                  <Skeleton className="h-7 w-16 mt-1" />
                ) : (
                  <p className="text-lg font-medium">{stats?.orders.toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent Orders Table */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-blue-500 hover:text-blue-700 flex items-center">
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
          ) : recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left font-medium text-gray-500 p-3">Order ID</th>
                    <th className="text-left font-medium text-gray-500 p-3">Customer</th>
                    <th className="text-left font-medium text-gray-500 p-3">Date</th>
                    <th className="text-right font-medium text-gray-500 p-3">Amount</th>
                    <th className="text-center font-medium text-gray-500 p-3">Status</th>
                    <th className="text-center font-medium text-gray-500 p-3 w-10">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">{order.id.substring(0, 8)}</td>
                      <td className="p-3 max-w-[180px]">
                        <div className="truncate" title={order.customer}>
                          {truncateText(order.customer, 20)}
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
                              <Link href={`/admin/orders/view/${order.id}`}>
                                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                <span>View Details</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              asChild
                            >
                              <Link href={`/admin/orders/edit/${order.id}`}>
                                <Edit className="mr-2 h-4 w-4 text-green-500" />
                                <span>Update Status</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                              <Download className="mr-2 h-4 w-4 text-purple-500" />
                              <span>Invoice</span>
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
              <ShoppingCart className="h-10 w-10 mx-auto text-gray-200 mb-2" />
              <p className="text-gray-500 text-sm">No recent orders</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Products Table */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">Recent Products</h2>
          <Link href="/admin/products" className="text-xs text-blue-500 hover:text-blue-700 flex items-center">
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
          ) : recentProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left font-medium text-gray-500 p-3">Product ID</th>
                    <th className="text-left font-medium text-gray-500 p-3">Name</th>
                    <th className="text-left font-medium text-gray-500 p-3">Added Date</th>
                    <th className="text-right font-medium text-gray-500 p-3">Price</th>
                    <th className="text-center font-medium text-gray-500 p-3 w-10">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentProducts.map((product) => (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">{product.id.substring(0, 8)}</td>
                      <td className="p-3 max-w-[200px]">
                        <div className="truncate" title={product.name}>
                          {truncateText(product.name, 25)}
                        </div>
                      </td>
                      <td className="p-3 text-gray-500">{product.date}</td>
                      <td className="p-3 text-right font-medium">{formatCurrency(product.price)}</td>
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
                              <Link href={`/products/${product.slug}`}>
                                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                <span>View Details</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              asChild
                            >
                              <Link href={`/admin/products/edit/${product.id}`}>
                                <Edit className="mr-2 h-4 w-4 text-green-500" />
                                <span>Edit Product</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteProduct(product.id)}
                              disabled={isDeleting === `product-${product.id}`}
                            >
                              {isDeleting === `product-${product.id}` ? (
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
          ) : (
            <div className="p-8 text-center">
              <Package className="h-10 w-10 mx-auto text-gray-200 mb-2" />
              <p className="text-gray-500 text-sm">No recent products</p>
            </div>
          )}
        </div>
      </div>
      
      {/* New Users Table */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-medium">New Users</h2>
          <Link href="/admin/users" className="text-xs text-blue-500 hover:text-blue-700 flex items-center">
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
          ) : newUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left font-medium text-gray-500 p-3">User ID</th>
                    <th className="text-left font-medium text-gray-500 p-3">Name</th>
                    <th className="text-left font-medium text-gray-500 p-3">Email</th>
                    <th className="text-left font-medium text-gray-500 p-3">Role</th>
                    <th className="text-right font-medium text-gray-500 p-3">Join Date</th>
                    <th className="text-center font-medium text-gray-500 p-3 w-10">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {newUsers.map((user) => (
                    <tr key={user.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="p-3 font-medium">{user.id.substring(0, 8)}</td>
                      <td className="p-3">{truncateText(user.name, 20)}</td>
                      <td className="p-3 text-gray-500 max-w-[200px]">
                        <div className="truncate" title={user.email}>
                          {user.email}
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`text-xs px-2 py-1 rounded-full ${getRoleBadgeColor(user.role)}`}>
                          {user.role || 'User'}
                        </span>
                      </td>
                      <td className="p-3 text-right">{user.joinDate}</td>
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
                              <Link href={`/admin/users/view/${user.id}`}>
                                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                <span>View Profile</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer"
                              asChild
                            >
                              <Link href={`/admin/users/edit/${user.id}`}>
                                <Edit className="mr-2 h-4 w-4 text-green-500" />
                                <span>Edit User</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={isDeleting === `user-${user.id}`}
                            >
                              {isDeleting === `user-${user.id}` ? (
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
          ) : (
            <div className="p-8 text-center">
              <Users className="h-10 w-10 mx-auto text-gray-200 mb-2" />
              <p className="text-gray-500 text-sm">No new users</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 