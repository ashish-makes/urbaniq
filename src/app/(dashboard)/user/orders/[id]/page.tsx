'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  Package,
  Truck,
  Clock,
  CheckCircle,
  AlertCircle,
  Download,
  FileText,
  ExternalLink,
  ShoppingBag,
  MapPin,
  CreditCard,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Add print-specific styles
const printStyles = `
  @media print {
    body {
      background-color: white !important;
      color: black !important;
    }
    
    .no-print {
      display: none !important;
    }
    
    .print-container {
      width: 100% !important;
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }
    
    .print-break-inside-avoid {
      break-inside: avoid !important;
    }
    
    button, a[role="button"] {
      display: none !important;
    }
    
    * {
      -webkit-print-color-adjust: exact !important;
      color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
  }
`;

interface OrderItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  image?: string;
}

interface ShippingAddress {
  // The API stores shippingAddress as a JSON object that could have any structure
  [key: string]: any;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  date: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddress: ShippingAddress;
  billingAddress?: ShippingAddress;
  paymentMethod: string;
  trackingNumber?: string;
  shippingMethod?: string;
  notes?: string;
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

export default function OrderDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/user/orders/${id}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            setError('Order not found');
          } else if (res.status === 403) {
            setError('You do not have permission to view this order');
          } else {
            setError('Failed to load order details');
          }
          return;
        }
        
        const data = await res.json();
        console.log('Order data from API:', data);
        console.log('Shipping address format:', typeof data.shippingAddress, data.shippingAddress);
        setOrder(data);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details');
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  };
  
  // Handle print functionality
  const handlePrint = () => {
    setIsPrinting(true);
    // Small timeout to allow the UI to update before print dialog opens
    setTimeout(() => {
      window.print();
      setIsPrinting(false);
    }, 100);
  };
  
  // Handle invoice download
  const handleDownloadInvoice = () => {
    if (!order) return;
    
    // Navigate to the invoice page instead of using the API directly
    router.push(`/user/orders/${id}/invoice`);
  };
  
  // Status colors for badges and progress indicators
  const getStatusBadgeColor = (status: string) => {
    switch(status) {
      case 'delivered':
        return 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100';
      case 'shipped':
        return 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100';
      case 'processing':
        return 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100';
      case 'cancelled':
        return 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100';
      case 'refunded':
        return 'bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100';
    }
  };
  
  // Format status text
  const formatStatus = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  };
  
  if (isLoading) {
    return <OrderDetailsSkeleton />;
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-800 p-4 rounded-lg mb-6">
        {error}
      </div>
    );
  }
  
  if (!order) return null;
  
  // Inside the component before the return statement, add code to parse shippingAddress if it's a string
  if (order && typeof order.shippingAddress === 'string') {
    try {
      // Try to parse the JSON string if it hasn't been parsed yet
      order.shippingAddress = JSON.parse(order.shippingAddress);
      console.log('Parsed shipping address:', order.shippingAddress);
    } catch (e) {
      console.error('Error parsing shipping address:', e);
    }
  }

  if (order && order.billingAddress && typeof order.billingAddress === 'string') {
    try {
      // Try to parse the JSON string if it hasn't been parsed yet
      order.billingAddress = JSON.parse(order.billingAddress);
    } catch (e) {
      console.error('Error parsing billing address:', e);
    }
  }
  
  return (
    <div className="w-full print-container">
      {/* Add style tag for print styles */}
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />
      
      {/* Header with order number and actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold">
            Order #{order.orderNumber}
          </h1>
        </div>
        
        <div className="flex gap-2 no-print">
          <Button 
            variant="outline" 
            size="sm" 
            className="border border-gray-200 bg-white rounded-md shadow-none"
            onClick={handleDownloadInvoice}
            disabled={isDownloading || isPrinting}
          >
            {isDownloading ? (
              <>
                <span className="animate-spin mr-2">○</span> Downloading...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" /> View Invoice
              </>
            )}
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="border border-gray-200 bg-white rounded-md shadow-none"
            onClick={handlePrint}
            disabled={isPrinting || isDownloading}
          >
            {isPrinting ? (
              <>
                <span className="animate-spin mr-2">○</span> Printing...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" /> Print
              </>
            )}
          </Button>
        </div>
      </div>
      
      {/* Status and meta info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 bg-white p-4 rounded-lg border border-gray-100">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">Status:</span>
            <Badge className={`px-2 py-1 text-xs font-normal rounded-full ${getStatusBadgeColor(order.status)}`}>
              {formatStatus(order.status)}
            </Badge>
          </div>
          <div className="text-sm text-gray-500">
            Order placed on {order.date}
          </div>
        </div>
        
        {order.trackingNumber && (
          <div className="text-sm">
            <span className="font-medium">Tracking: </span>
            <span className="text-blue-600">{order.trackingNumber}</span>
            <Button variant="link" size="sm" className="p-0 h-auto text-blue-600">
              <ExternalLink className="h-3 w-3 ml-1" />
              Track
            </Button>
          </div>
        )}
      </div>
      
      {/* Progress Tracker (only show for non-cancelled/refunded orders) */}
      {!['cancelled', 'refunded'].includes(order.status) && (
        <div className="mb-6 bg-white p-4 rounded-lg border border-gray-100 print-break-inside-avoid">
          <h2 className="text-sm font-medium text-gray-500 mb-4">ORDER PROGRESS</h2>
          
          <div className="relative">
            <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-100 z-0" />
            
            <div className="grid grid-cols-4 relative z-10">
              {[
                { id: 'pending', icon: <Clock className="h-5 w-5" /> },
                { id: 'processing', icon: <Package className="h-5 w-5" /> },
                { id: 'shipped', icon: <Truck className="h-5 w-5" /> },
                { id: 'delivered', icon: <ShoppingBag className="h-5 w-5" /> }
              ].map((step, index) => {
                const steps = ['pending', 'processing', 'shipped', 'delivered'];
                const currentIndex = steps.indexOf(order.status);
                const stepIndex = index;
                
                let status = 'inactive';
                if (currentIndex > stepIndex) status = 'completed';
                if (currentIndex === stepIndex) status = 'active';
                
                return (
                  <div key={step.id} className="flex flex-col items-center">
                    <div 
                      className={`h-10 w-10 rounded-full flex items-center justify-center mb-2 border ${
                        status === 'completed' ? 'bg-green-50 border-green-200 text-green-600' :
                        status === 'active' ? 'bg-blue-50 border-blue-200 text-blue-600' :
                        'bg-gray-50 border-gray-200 text-gray-400'
                      }`}
                    >
                      {status === 'completed' ? <CheckCircle className="h-5 w-5" /> : step.icon}
                    </div>
                    <span className="text-xs font-medium text-gray-700">
                      {formatStatus(step.id)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column - Order items */}
        <div className="col-span-1 lg:col-span-2">
          <div className="mb-6 bg-white border border-gray-100 rounded-lg overflow-hidden print-break-inside-avoid">
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
                            <div className="w-12 h-12 overflow-hidden rounded-md border border-gray-100 flex items-center justify-center">
                              {item.image ? (
                                <Image 
                                  src={item.image} 
                                  alt={item.name}
                                  width={48}
                                  height={48}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                            <div className="font-medium text-gray-900">{item.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm text-gray-500 py-4">
                          {item.description || '-'}
                        </TableCell>
                        <TableCell className="text-right text-gray-700 py-4">{formatCurrency(item.price)}</TableCell>
                        <TableCell className="text-right text-gray-700 py-4">{item.quantity}</TableCell>
                        <TableCell className="text-right font-medium text-gray-900 py-4">
                          {formatCurrency(item.price * item.quantity)}
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
                    <span className="text-gray-700">{formatCurrency(order.subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Tax</span>
                    <span className="text-gray-700">{formatCurrency(order.tax)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Shipping</span>
                    <span className="text-gray-700">{formatCurrency(order.shippingCost)}</span>
                  </div>
                  <div className="h-px w-full bg-gray-100 my-2"></div>
                  <div className="flex justify-between text-base font-medium pt-1">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{formatCurrency(order.total)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Order actions for delivered orders */}
          {order.status === 'delivered' && (
            <div className="mb-6 bg-white border border-gray-100 rounded-lg overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <h2 className="text-lg font-medium">Review Items</h2>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-3">
                  Your order has been delivered. We'd love to hear your feedback!
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-gray-200 bg-white rounded-lg shadow-none"
                  onClick={() => router.push(`/user/reviews/add?orderId=${order.id}`)}
                >
                  Leave a Review
                </Button>
              </div>
            </div>
          )}
        </div>
      
        {/* Right column - Shipping & Payment */}
        <div className="col-span-1 space-y-6">
          {/* Shipping Details */}
          <div className="bg-white border border-gray-100 rounded-lg overflow-hidden print-break-inside-avoid">
            <div className="px-4 py-3 border-b border-gray-100">
              <h2 className="text-lg font-medium">Shipping Details</h2>
            </div>
            <div className="p-4">
              {/* Shipping address section */}
              <div className="mb-3">
                <div className="text-sm font-medium text-gray-900">Shipping Address</div>
                <div className="text-sm text-gray-500 mt-1">
                  {order.shippingAddress && typeof order.shippingAddress === 'object' ? (
                    <>
                      {order.shippingAddress.name || order.shippingAddress.line1 || ''}
                      {(order.shippingAddress.street || order.shippingAddress.line2) && (
                        <>
                          <br />
                          {order.shippingAddress.street || order.shippingAddress.line2}
                        </>
                      )}
                      <br />
                      {order.shippingAddress.city || ''}{order.shippingAddress.city && order.shippingAddress.state ? ', ' : ''}{order.shippingAddress.state || ''} {order.shippingAddress.zip || order.shippingAddress.postal_code || ''}
                      <br />
                      {order.shippingAddress.country || ''}
                    </>
                  ) : (
                    <span>No shipping address available</span>
                  )}
                </div>
              </div>
              
              {order.shippingMethod && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-900">Shipping Method</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {order.shippingMethod}
                  </div>
                </div>
              )}
              
              {order.trackingNumber && (
                <div>
                  <div className="text-sm font-medium text-gray-900">Tracking Number</div>
                  <div className="text-sm text-gray-500 mt-1">{order.trackingNumber}</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Payment Information */}
          <div className="bg-white border border-gray-100 rounded-lg overflow-hidden print-break-inside-avoid">
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
              
              {/* Similar fix for billing address */}
              {order.billingAddress && (
                <div className="mb-3">
                  <div className="text-sm font-medium text-gray-900">Billing Address</div>
                  <div className="text-sm text-gray-500 mt-1">
                    {typeof order.billingAddress === 'object' ? (
                      <>
                        {order.billingAddress.name || order.billingAddress.line1 || ''}
                        {(order.billingAddress.street || order.billingAddress.line2) && (
                          <>
                            <br />
                            {order.billingAddress.street || order.billingAddress.line2}
                          </>
                        )}
                        <br />
                        {order.billingAddress.city || ''}{order.billingAddress.city && order.billingAddress.state ? ', ' : ''}{order.billingAddress.state || ''} {order.billingAddress.zip || order.billingAddress.postal_code || ''}
                        <br />
                        {order.billingAddress.country || ''}
                      </>
                    ) : (
                      <span>No billing address available</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Need help box */}
          <div className="p-4 bg-white rounded-lg text-sm border border-gray-100 no-print">
            <p className="mb-3">Need help with your order?</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full bg-white border-gray-200 rounded-lg shadow-none"
              onClick={() => router.push('/contact')}
            >
              Contact Support
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 