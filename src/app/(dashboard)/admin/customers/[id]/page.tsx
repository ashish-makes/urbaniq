'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Package, User } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CustomerProfilePage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState<any>(null);
  const [customerOrders, setCustomerOrders] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, you would fetch the customer data from your API
    // For now, we'll just simulate loading state and then set mock data
    const fetchCustomer = async () => {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Mock customer data (replace with real API call)
        setCustomer({
          id: params.id,
          name: 'John Smith',
          email: 'john.smith@example.com',
          createdAt: new Date('2023-07-15'),
          totalSpent: 523.45,
          orderCount: 3
        });

        // Mock orders data (replace with real API call)
        setCustomerOrders([
          {
            id: '1',
            orderNumber: 'ORD-12345',
            date: new Date('2023-12-10'),
            total: 125.99,
            status: 'DELIVERED'
          },
          {
            id: '2',
            orderNumber: 'ORD-23456',
            date: new Date('2023-09-22'),
            total: 239.97,
            status: 'DELIVERED'
          },
          {
            id: '3',
            orderNumber: 'ORD-34567',
            date: new Date('2023-07-15'),
            total: 157.49,
            status: 'CANCELLED'
          }
        ]);
      } catch (error: any) {
        console.error('Error fetching customer data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [params.id]);

  // Helper function to format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };

  // Status badge styles with improved colors and hover effects
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100';
      case 'PROCESSING': return 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100';
      case 'SHIPPED': return 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100';
      case 'DELIVERED': return 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100';
      case 'CANCELLED': return 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100';
      case 'REFUNDED': return 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100';
      default: return 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <div className="px-6 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/customers" passHref>
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Customers
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold">Customer Profile</h1>
      </div>

      {error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded-md">
          {error}
        </div>
      ) : loading ? (
        <div className="animate-pulse space-y-6">
          <div className="h-32 bg-gray-200 rounded-lg"></div>
          <div className="h-64 bg-gray-200 rounded-lg"></div>
        </div>
      ) : customer ? (
        <div className="space-y-6">
          {/* Customer Info Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{customer.name}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <Mail className="h-3.5 w-3.5 mr-1" /> {customer.email}
                  </CardDescription>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => window.location.href = `mailto:${customer.email}`}
                >
                  <Mail className="h-4 w-4 mr-2" /> Contact
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 py-2">
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Customer Since</p>
                  <p className="font-medium">{formatDate(customer.createdAt)}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Total Orders</p>
                  <p className="font-medium">{customer.orderCount}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Total Spent</p>
                  <p className="font-medium">${customer.totalSpent.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Tabs for Orders and Details */}
          <Tabs defaultValue="orders" className="w-full">
            <TabsList>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="details">Customer Details</TabsTrigger>
            </TabsList>
            
            {/* Orders Tab */}
            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Order History</CardTitle>
                </CardHeader>
                <CardContent>
                  {customerOrders.length > 0 ? (
                    <div className="rounded-md border overflow-hidden">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                          <tr className="border-b">
                            <th className="py-3 px-4 text-left font-medium">Order #</th>
                            <th className="py-3 px-4 text-left font-medium">Date</th>
                            <th className="py-3 px-4 text-left font-medium">Status</th>
                            <th className="py-3 px-4 text-right font-medium">Total</th>
                            <th className="py-3 px-4 text-center font-medium w-10">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {customerOrders.map(order => (
                            <tr key={order.id} className="hover:bg-gray-50">
                              <td className="py-3 px-4 font-medium">{order.orderNumber}</td>
                              <td className="py-3 px-4 text-gray-500">{formatDate(order.date)}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(order.status)}`}>
                                  {order.status}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right font-medium">${order.total.toFixed(2)}</td>
                              <td className="py-3 px-4 text-center">
                                <Link href={`/admin/orders/${order.id}`}>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                    <Package className="h-4 w-4" />
                                  </Button>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="h-8 w-8 mx-auto text-gray-300 mb-2" />
                      <p>This customer hasn't placed any orders yet.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Customer Details Tab */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Account Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Contact Information</h3>
                      <div className="space-y-1 text-sm">
                        <p>{customer.name}</p>
                        <p>{customer.email}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Default Shipping Address</h3>
                        <div className="text-sm text-gray-500">
                          <p>Not set</p>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium mb-2">Default Billing Address</h3>
                        <div className="text-sm text-gray-500">
                          <p>Not set</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2">Account Notes</h3>
                      <p className="text-sm text-gray-500">No notes available for this customer.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="bg-gray-50 text-gray-500 p-8 rounded-md text-center">
          <User className="h-12 w-12 mx-auto text-gray-300 mb-2" />
          <p className="text-xl font-medium mb-2">Customer not found</p>
          <p>The customer you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
      )}
    </div>
  );
} 