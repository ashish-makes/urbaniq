'use client';

import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Mail, Package, User, Calendar, Phone, Home, ExternalLink, Download, Eye, DollarSign, ArrowUpRight, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface CustomerOrder {
  id: string;
  orderNumber: string;
  date: Date;
  total: number;
  status: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  totalSpent: number;
  orderCount: number;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  notes?: string;
  image?: string;
}

export default function CustomerProfilePage({ params }: { params: any }) {
  // Unwrap the params object with proper typing
  const unwrappedParams = use(params) as { id: string };
  const customerId = unwrappedParams.id;

  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<CustomerOrder[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        
        // Try to fetch customer details from API
        let customerData;
        let ordersData;
        
        try {
          const customerResponse = await fetch(`/api/admin/customers/${customerId}`);
          
          if (!customerResponse.ok) {
            throw new Error(`API error: ${customerResponse.status}`);
          }
          
          customerData = await customerResponse.json();
          
          // Fetch customer orders
          const ordersResponse = await fetch(`/api/admin/customers/${customerId}/orders`);
          
          if (!ordersResponse.ok) {
            throw new Error(`API error: ${ordersResponse.status}`);
          }
          
          ordersData = await ordersResponse.json();
        } catch (apiError) {
          console.warn('API not available yet, using mock data for development', apiError);
          
          // Use mock data for development when API isn't ready
          customerData = {
            id: customerId,
            name: 'John Smith',
            email: 'john.smith@example.com',
            createdAt: '2023-07-15T00:00:00.000Z',
            phone: '+1 (555) 123-4567',
            address: '123 Main Street',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'United States',
            notes: 'VIP customer. Prefers email communication.',
            totalSpent: 523.45,
            orderCount: 3
          };
          
          ordersData = [
            {
              id: '1',
              orderNumber: 'ORD-12345',
              createdAt: '2023-12-10T00:00:00.000Z',
              total: 125.99,
              status: 'DELIVERED'
            },
            {
              id: '2',
              orderNumber: 'ORD-23456',
              createdAt: '2023-09-22T00:00:00.000Z',
              total: 239.97,
              status: 'DELIVERED'
            },
            {
              id: '3',
              orderNumber: 'ORD-34567',
              createdAt: '2023-07-15T00:00:00.000Z',
              total: 157.49,
              status: 'CANCELLED'
            }
          ];
          
          toast.info('Using mock data - API endpoints not implemented yet');
        }
        
        // Process customer data
        setCustomer({
          id: customerData.id,
          name: customerData.name || 'Unknown',
          email: customerData.email,
          createdAt: new Date(customerData.createdAt),
          totalSpent: customerData.totalSpent || 0,
          orderCount: customerData.orderCount || 0,
          address: customerData.address,
          city: customerData.city,
          state: customerData.state,
          postalCode: customerData.postalCode,
          country: customerData.country,
          phone: customerData.phone,
          notes: customerData.notes,
          image: customerData.image
        });
        
        // Process orders data
        setCustomerOrders(ordersData.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          date: new Date(order.createdAt),
          total: order.total,
          status: order.status
        })));
        
      } catch (error: any) {
        console.error('Error processing customer data:', error);
        setError(error.message || 'Failed to load customer data');
        toast.error('Failed to process customer data');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerData();
  }, [customerId]);

  // Helper function to format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  // Status badge styles with improved colors
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'PROCESSING': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'SHIPPED': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'DELIVERED': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      case 'CANCELLED': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'REFUNDED': return 'bg-slate-50 text-slate-600 border-slate-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  // Function to get user initials for avatar
  const getUserInitials = (name: string) => {
    if (!name) return 'C';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div>
        {/* Header skeleton */}
        <div className="mb-6">
          <Skeleton className="h-7 w-40 mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        
        {/* Stats cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                  <Skeleton className="h-5 w-5 rounded" />
                </div>
                <div>
                  <Skeleton className="h-4 w-24 mb-1" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Content grid skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Orders table skeleton */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
            
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="p-3"><Skeleton className="h-4 w-full" /></th>
                      <th className="p-3"><Skeleton className="h-4 w-full" /></th>
                      <th className="p-3"><Skeleton className="h-4 w-full" /></th>
                      <th className="p-3"><Skeleton className="h-4 w-full" /></th>
                      <th className="p-3 w-10"><Skeleton className="h-4 w-8 mx-auto" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3].map((i) => (
                      <tr key={i} className="border-b border-gray-50">
                        <td className="p-3"><Skeleton className="h-5 w-24" /></td>
                        <td className="p-3"><Skeleton className="h-5 w-20" /></td>
                        <td className="p-3 text-center">
                          <Skeleton className="h-6 w-16 mx-auto rounded-full" />
                        </td>
                        <td className="p-3 text-right">
                          <Skeleton className="h-5 w-16 ml-auto" />
                        </td>
                        <td className="p-3 text-center">
                          <Skeleton className="h-8 w-8 rounded mx-auto" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          {/* Customer info skeleton */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg overflow-hidden mb-6">
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <Skeleton className="h-14 w-14 rounded-full" />
                  <div>
                    <Skeleton className="h-6 w-32 mb-1" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
                
                <Skeleton className="h-5 w-40 mb-4" />
                
                <div className="space-y-4">
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-4 mr-2 rounded" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <div className="flex items-center">
                      <Skeleton className="h-4 w-4 mr-2 rounded" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <Skeleton className="h-3 w-12" />
                    <div className="flex">
                      <Skeleton className="h-4 w-4 mr-2 rounded mt-0.5 flex-shrink-0" />
                      <div>
                        <Skeleton className="h-4 w-full mb-1" />
                        <Skeleton className="h-4 w-36 mb-1" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-6 pb-6">
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-24 w-full rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="px-6 py-8">
        <div className="bg-red-50 border border-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  // Customer not found
  if (!customer) {
    return (
      <div className="px-6 py-8">
        <div className="bg-gray-50 border border-gray-100 p-8 rounded-md text-center">
          <User className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p className="text-xl font-medium mb-2">Customer not found</p>
          <p className="text-gray-500">The customer you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
      </div>
    );
  }

  // Render customer profile
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-medium">Customer Profile</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
          <Mail className="h-3.5 w-3.5" /> 
          {customer.email}
        </div>
      </div>
      
      {/* Customer stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center mr-3">
              <Calendar className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Customer Since</p>
              <p className="text-lg font-medium">{formatDate(customer.createdAt)}</p>
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
              <p className="text-lg font-medium">${customer.totalSpent.toFixed(2)}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-amber-50 flex items-center justify-center mr-3">
              <Package className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <p className="text-lg font-medium">{customer.orderCount}</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Customer info and actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Order history - now on the left */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-medium">Order History</h2>
            <Link href="/admin/orders" className="text-xs text-blue-500 hover:text-blue-700 flex items-center">
              View all <ArrowUpRight className="h-3 w-3 ml-1" />
            </Link>
          </div>
          
          {customerOrders.length > 0 ? (
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="text-left font-medium text-gray-500 p-3">Order ID</th>
                      <th className="text-left font-medium text-gray-500 p-3">Date</th>
                      <th className="text-left font-medium text-gray-500 p-3">Status</th>
                      <th className="text-right font-medium text-gray-500 p-3">Amount</th>
                      <th className="text-center font-medium text-gray-500 p-3 w-10">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {customerOrders.map(order => (
                      <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="p-3 font-medium">{order.orderNumber}</td>
                        <td className="p-3 text-gray-500">{formatDate(order.date)}</td>
                        <td className="p-3 text-center">
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadgeColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="p-3 text-right font-medium">${order.total.toFixed(2)}</td>
                        <td className="p-3 text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[200px]">
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                asChild
                              >
                                <Link href={`/admin/orders/${order.id}`}>
                                  <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                  <span>View Details</span>
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer"
                                asChild
                              >
                                <Link href={`/admin/orders/${order.id}/invoice`}>
                                  <Download className="mr-2 h-4 w-4 text-purple-500" />
                                  <span>Download Invoice</span>
                                </Link>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-lg">
              <Package className="h-10 w-10 mx-auto text-gray-200 mb-2" />
              <p className="text-gray-500 text-sm">No orders found</p>
            </div>
          )}
        </div>
        
        {/* Contact information - now on the right */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-14 w-14">
                  <AvatarImage src={customer.image || ''} alt={customer.name} />
                  <AvatarFallback className="text-lg bg-blue-50 text-blue-600 border-0">{getUserInitials(customer.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-medium">{customer.name}</h2>
                  <p className="text-sm text-gray-500">Customer</p>
                </div>
              </div>

              <h3 className="text-sm font-medium mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <p>{customer.email}</p>
                  </div>
                </div>
                
                {customer.phone && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Phone</p>
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      <p>{customer.phone}</p>
                    </div>
                  </div>
                )}
                
                {(customer.address || customer.city || customer.state) && (
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider">Address</p>
                    <div className="flex">
                      <Home className="h-4 w-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <div>
                        {customer.address && <p>{customer.address}</p>}
                        {(customer.city || customer.state || customer.postalCode) && (
                          <p>
                            {[
                              customer.city, 
                              customer.state, 
                              customer.postalCode
                            ].filter(Boolean).join(', ')}
                          </p>
                        )}
                        {customer.country && <p>{customer.country}</p>}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 pb-6">
              {customer.notes && (
                <div className="mb-6">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 border border-gray-100 rounded">{customer.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 