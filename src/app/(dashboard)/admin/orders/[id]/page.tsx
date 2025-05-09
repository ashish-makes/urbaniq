'use client';

import { useState, useEffect, use } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
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
import { Loader2, Download, Mail } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

// Simple separator component
const Separator = ({ className = "" }: { className?: string }) => (
  <div className={`h-[1px] w-full bg-gray-100 my-2 ${className}`} />
);

// Use the same types as in the orders list page
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  description?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  customerEmail: string;
  customerName?: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  createdAt: Date;
  updatedAt: Date;
  items: OrderItem[];
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  billingAddress?: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  paymentMethod: string;
  paymentId?: string;
  notes?: string;
  shippingMethod?: string;
  trackingNumber?: string;
}

// Order Details Skeleton Loader Component
const OrderDetailsSkeleton = () => {
  return (
    <>
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <Skeleton className="h-8 w-[180px]" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-[120px]" />
          <Skeleton className="h-9 w-[120px]" />
        </div>
      </div>
      
      {/* Status and meta info skeleton */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-100">
        <div className="space-y-2 w-full sm:w-auto">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-4 w-[180px]" />
        </div>
        <Skeleton className="h-10 w-[180px]" />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order items skeleton */}
        <div className="col-span-1 lg:col-span-2">
          <div className="mb-6 bg-white border border-gray-100 rounded-lg overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <Skeleton className="h-6 w-[120px]" />
              <Skeleton className="h-4 w-[60px]" />
            </div>
            <div className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="py-3"><Skeleton className="h-4 w-20" /></TableHead>
                      <TableHead className="hidden sm:table-cell py-3"><Skeleton className="h-4 w-20" /></TableHead>
                      <TableHead className="text-right py-3"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                      <TableHead className="text-right py-3"><Skeleton className="h-4 w-10 ml-auto" /></TableHead>
                      <TableHead className="text-right py-3"><Skeleton className="h-4 w-16 ml-auto" /></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...Array(3)].map((_, index) => (
                      <TableRow key={index} className="hover:bg-gray-50/50 border-b border-gray-50">
                        <TableCell className="py-4">
                          <div className="flex items-center gap-4">
                            <Skeleton className="w-12 h-12 rounded-md" />
                            <Skeleton className="h-5 w-[140px]" />
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell py-4">
                          <Skeleton className="h-4 w-[180px]" />
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <Skeleton className="h-4 w-16 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <Skeleton className="h-4 w-8 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <Skeleton className="h-5 w-16 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-3 p-5 border-t border-gray-100">
                <div className="ml-auto space-y-2 w-full max-w-xs">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                  <div className="h-px w-full bg-gray-100 my-2"></div>
                  <div className="flex justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-24" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      
        {/* Right column skeleton */}
        <div className="col-span-1 space-y-6">
          {/* Customer info skeleton */}
          <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <Skeleton className="h-6 w-[100px]" />
            </div>
            <div className="p-4">
              <div className="mb-4">
                <Skeleton className="h-5 w-[150px] mb-1" />
                <Skeleton className="h-4 w-[180px]" />
              </div>
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
          
          {/* Shipping details skeleton */}
          <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <Skeleton className="h-6 w-[140px]" />
            </div>
            <div className="p-4">
              <div className="mb-3">
                <Skeleton className="h-4 w-[120px] mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-[80%] mb-1" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
              
              <div className="mb-3">
                <Skeleton className="h-4 w-[120px] mb-2" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          </div>
          
          {/* Payment details skeleton */}
          <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <Skeleton className="h-6 w-[160px]" />
            </div>
            <div className="p-4">
              <div className="mb-3">
                <Skeleton className="h-4 w-[120px] mb-2" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
              
              <div className="mb-3">
                <Skeleton className="h-4 w-[120px] mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-[80%] mb-1" />
                <Skeleton className="h-4 w-[60%]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function OrderDetailsPage({ params }: { params: Promise<{ id: string }> | { id: string } }) {
  // Unwrap params using React.use
  const unwrappedParams = use(params as Promise<{ id: string }>);
  const orderId = unwrappedParams.id;
  
  const { data: session } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  
  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!session?.user) {
        return;
      }
      
      setLoading(true);
      try {
        // Fetch real order data from the API
        const response = await fetch(`/api/orders/${orderId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch order: ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Parse dates
        data.createdAt = new Date(data.createdAt);
        data.updatedAt = new Date(data.updatedAt);
        
        // Parse JSON strings if needed (shipping/billing addresses)
        if (typeof data.shippingAddress === 'string') {
          data.shippingAddress = JSON.parse(data.shippingAddress);
        }
        
        if (data.billingAddress && typeof data.billingAddress === 'string') {
          data.billingAddress = JSON.parse(data.billingAddress);
        }
        
        setOrder(data);
      } catch (err: any) {
        console.error('Error fetching order:', err);
        setError(err.message || 'Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, session]);
  
  // Update order status
  const updateOrderStatus = async (status: string) => {
    if (!order) return;
    
    setUpdateLoading(true);
    try {
      const response = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Update local state
      setOrder(prev => prev ? { ...prev, status: status as any } : null);
    } catch (err: any) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status: ' + err.message);
    } finally {
      setUpdateLoading(false);
    }
  };
  
  // Status badge color mapping with improved colors and hover effects
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100';
      case 'PROCESSING':
        return 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100';
      case 'SHIPPED':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100';
      case 'DELIVERED':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100';
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100';
      case 'REFUNDED':
        return 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100';
    }
  };
  
  // Format date
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };
  
  return (
    <div className="w-full">
      {error ? (
        <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-lg mb-6">
          {error}
        </div>
      ) : loading ? (
        <OrderDetailsSkeleton />
      ) : order ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold">
                {order?.orderNumber && <span>Order #{order.orderNumber}</span>}
              </h1>
            </div>
            
            <div className="flex gap-2">
              <Link href={`/admin/orders/${orderId}/invoice`} passHref>
                <Button variant="outline" size="sm" className="border border-gray-200 bg-white rounded-md shadow-none">
                  <Download className="h-4 w-4 mr-2" /> Invoice PDF
                </Button>
              </Link>
              {order?.customerEmail && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border border-gray-200 bg-white rounded-md shadow-none"
                  onClick={() => window.location.href = `mailto:${order.customerEmail}?subject=Order ${order.orderNumber}`}
                >
                  <Mail className="h-4 w-4 mr-2" /> Email Customer
                </Button>
              )}
            </div>
          </div>
          
          {/* Status and meta info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-100">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Status:</span>
                <Badge className={`px-2 py-1 text-xs font-normal rounded-full ${getStatusBadgeColor(order.status)}`}>
                  {order.status}
                </Badge>
              </div>
              <div className="text-sm text-gray-500">
                Order placed on {formatDate(order.createdAt)}
              </div>
            </div>
            
            <div>
              <Select 
                value={order.status} 
                onValueChange={updateOrderStatus}
                disabled={updateLoading}
              >
                <SelectTrigger className="w-[180px] border-gray-200 bg-white rounded-lg">
                  {updateLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </div>
                  ) : (
                    <SelectValue placeholder="Update Status" />
                  )}
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="PROCESSING">Processing</SelectItem>
                  <SelectItem value="SHIPPED">Shipped</SelectItem>
                  <SelectItem value="DELIVERED">Delivered</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                  <SelectItem value="REFUNDED">Refunded</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Order items */}
            <div className="col-span-1 lg:col-span-2">
              <div className="mb-6 bg-white border border-gray-100 rounded-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-lg font-medium">Order Items</h2>
                  <span className="text-sm text-gray-500">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="p-0">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 hover:bg-gray-50">
                          <TableHead className="py-3">Product</TableHead>
                          <TableHead className="hidden sm:table-cell py-3">Description</TableHead>
                          <TableHead className="text-right py-3">Price</TableHead>
                          <TableHead className="text-right py-3">Qty</TableHead>
                          <TableHead className="text-right py-3">Total</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.items.map((item) => (
                          <TableRow key={item.id} className="hover:bg-gray-50/50 border-b border-gray-50">
                            <TableCell className="py-4">
                              <div className="flex items-center gap-4">
                                {item.image && (
                                  <div className="w-12 h-12 overflow-hidden rounded-md border border-gray-100">
                                    <img 
                                      src={item.image} 
                                      alt={item.name}
                                      className="w-full h-full object-cover" 
                                    />
                                  </div>
                                )}
                                <div className="font-medium text-gray-900">{item.name}</div>
                              </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell text-sm text-gray-500 py-4">
                              {item.description || '-'}
                            </TableCell>
                            <TableCell className="text-right text-gray-700 py-4">${item.price.toFixed(2)}</TableCell>
                            <TableCell className="text-right text-gray-700 py-4">{item.quantity}</TableCell>
                            <TableCell className="text-right font-medium text-gray-900 py-4">
                              ${(item.price * item.quantity).toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  
                  <div className="mt-3 p-5 border-t border-gray-100">
                    <div className="ml-auto space-y-2 w-full max-w-xs">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Subtotal</span>
                        <span className="text-gray-700">${order.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Tax</span>
                        <span className="text-gray-700">${order.tax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Shipping</span>
                        <span className="text-gray-700">${order.shippingCost.toFixed(2)}</span>
                      </div>
                      <div className="h-px w-full bg-gray-100 my-2"></div>
                      <div className="flex justify-between text-base font-medium pt-1">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          
            {/* Right column - Customer, Shipping & Payment */}
            <div className="col-span-1 space-y-6">
              {/* Customer Info */}
              <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-medium">Customer</h2>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <div className="font-medium">{order.customerName || 'Guest Customer'}</div>
                    <div className="text-sm text-gray-500">{order.customerEmail}</div>
                  </div>
                  {order.userId && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full border-gray-200 bg-white rounded-lg shadow-none"
                      onClick={() => router.push(`/admin/customers/${order.userId}`)}
                    >
                      View Customer Profile
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Shipping Details */}
              <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-medium">Shipping Details</h2>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-900">Shipping Address</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {order.shippingAddress.line1}<br />
                      {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postal_code}<br />
                      {order.shippingAddress.country}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-900">Shipping Method</div>
                    <div className="text-sm text-gray-500 mt-1">
                      {order.shippingMethod || 'Standard Shipping'}
                    </div>
                  </div>
                  
                  {order.trackingNumber && (
                    <div>
                      <div className="text-sm font-medium text-gray-900">Tracking Number</div>
                      <div className="text-sm text-gray-500 mt-1">{order.trackingNumber}</div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Payment Information */}
              <div className="bg-white border border-gray-100 rounded-lg overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h2 className="text-lg font-medium">Payment Information</h2>
                </div>
                <div className="p-4">
                  <div className="mb-3">
                    <div className="text-sm font-medium text-gray-900">Payment Method</div>
                    <div className="text-sm text-gray-500 mt-1 capitalize">
                      {order.paymentMethod}
                    </div>
                  </div>
                  
                  {order.billingAddress && (
                    <div className="mb-3">
                      <div className="text-sm font-medium text-gray-900">Billing Address</div>
                      <div className="text-sm text-gray-500 mt-1">
                        {order.billingAddress.line1}<br />
                        {order.billingAddress.line2 && <>{order.billingAddress.line2}<br /></>}
                        {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.postal_code}<br />
                        {order.billingAddress.country}
                      </div>
                    </div>
                  )}
                  
                  {order.paymentId && (
                    <div>
                      <div className="text-sm font-medium text-gray-900">Payment ID</div>
                      <div className="text-sm text-gray-500 mt-1">{order.paymentId}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-gray-50 border border-gray-100 text-gray-500 p-8 rounded-lg text-center">
          Order not found.
        </div>
      )}
    </div>
  );
} 