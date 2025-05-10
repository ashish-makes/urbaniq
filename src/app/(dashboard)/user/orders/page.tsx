'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
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
  Package,
  MoreHorizontal,
  Eye,
  Download,
  Star,
  Info,
  ArrowUpDown,
  ShoppingBag
} from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
}

// Helper function for truncating text
const truncateText = (text: string, limit: number) => {
  if (!text) return '';
  if (text.length <= limit) return text;
  return text.substring(0, limit) + '...';
};

// Helper function for status badge colors
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

// Format status text for display
const formatStatus = (status: string) => {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};

export default function OrdersPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const ordersPerPage = 10;

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/user/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        
        const data = await res.json();
        
        // Format orders data
        const formattedOrders = data.map((order: any) => ({
          id: order.id,
          orderNumber: order.orderNumber,
          date: order.date || new Date(order.createdAt).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          }),
          total: order.total,
          status: order.status.toLowerCase(),
          items: order.items || []
        }));
        
        setOrders(formattedOrders);
        setFilteredOrders(formattedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  useEffect(() => {
    // Filter orders when status filter changes
    let result = orders;
    
    // Filter by status
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Sort orders
    result = [...result].sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        comparison = dateA - dateB;
      } else if (sortField === 'total') {
        comparison = a.total - b.total;
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      } else if (sortField === 'orderNumber') {
        comparison = a.orderNumber.localeCompare(b.orderNumber);
      }
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
    
    setFilteredOrders(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [statusFilter, orders, sortField, sortDirection]);
  
  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setStatusFilter(value === 'ALL' ? 'all' : value.toLowerCase());
  };
  
  // Handle sort change
  const handleSortChange = (field: string) => {
    if (field === sortField) {
      // Toggle sort direction if clicking the same field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc'); // Default to descending for new field
    }
  };
  
  // Calculate pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format date
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  
  // Skeleton loader for orders
  const OrdersTableSkeleton = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="border-b border-gray-100">
              <th className="px-3 py-2 text-left font-medium">Order #</th>
              <th className="px-3 py-2 text-left font-medium">Date</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-right font-medium">Total</th>
              <th className="px-3 py-2 text-center font-medium w-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50/50">
                <td className="px-3 py-2.5">
                  <Skeleton className="h-4 w-[100px]" />
                </td>
                <td className="px-3 py-2.5">
                  <Skeleton className="h-4 w-[120px]" />
                </td>
                <td className="px-3 py-2.5">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-3 py-2.5 text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </td>
                <td className="px-3 py-2.5 text-center">
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
          <h1 className="text-2xl font-semibold">Your Orders</h1>
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter.toUpperCase()} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[calc(50%-4px)] sm:w-[130px] text-sm border-gray-200">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
            <Select 
              value={`${sortField}-${sortDirection}`}
              onValueChange={(value) => {
                const [field, direction] = value.split('-');
                setSortField(field);
                setSortDirection(direction as 'asc' | 'desc');
              }}
            >
              <SelectTrigger className="w-[calc(50%-4px)] sm:w-[130px] text-sm border-gray-200">
                <SelectValue placeholder="Sort orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date-desc">Newest first</SelectItem>
                <SelectItem value="date-asc">Oldest first</SelectItem>
                <SelectItem value="total-desc">Highest amount</SelectItem>
                <SelectItem value="total-asc">Lowest amount</SelectItem>
                <SelectItem value="status-asc">Status (A-Z)</SelectItem>
                <SelectItem value="status-desc">Status (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="bg-white rounded-lg overflow-hidden">
          <OrdersTableSkeleton />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No orders found</p>
          {statusFilter !== 'all' && (
            <Button className='rounded-full' onClick={() => setStatusFilter('all')}>View All Orders</Button>
          )}
          {statusFilter === 'all' && (
            <Link href="/shop">
              <Button variant="outline" className="mt-3">Shop Now</Button>
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr className="border-b border-gray-100">
                  <th 
                    className="px-3 py-2 text-left font-medium cursor-pointer" 
                    onClick={() => handleSortChange('orderNumber')}
                  >
                    <div className="flex items-center">
                      Order # 
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-3 py-2 text-left font-medium cursor-pointer" 
                    onClick={() => handleSortChange('date')}
                  >
                    <div className="flex items-center">
                      Date 
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-3 py-2 text-left font-medium cursor-pointer" 
                    onClick={() => handleSortChange('status')}
                  >
                    <div className="flex items-center">
                      Status 
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th 
                    className="px-3 py-2 text-right font-medium cursor-pointer" 
                    onClick={() => handleSortChange('total')}
                  >
                    <div className="flex items-center justify-end">
                      Total 
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-3 py-2 text-center font-medium w-10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-3 py-2.5 text-gray-500">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge className={`inline-flex px-2 py-1 text-xs font-normal ${getStatusBadgeColor(order.status)}`}>
                        {formatStatus(order.status)}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium">
                      {formatCurrency(order.total)}
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal size={16} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                          <DropdownMenuItem
                            onClick={() => router.push(`/user/orders/${order.id}`)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => router.push(`/user/reviews/add?orderId=${order.id}`)}
                          >
                            <Star className="mr-2 h-4 w-4" />
                            <span>Leave Review</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => router.push(`/user/orders/${order.id}/invoice`)}
                          >
                            <Download className="mr-2 h-4 w-4" />
                            <span>Download Invoice</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer"
                            onClick={() => router.push(`/user/orders/${order.id}/track`)}
                          >
                            <Info className="mr-2 h-4 w-4" />
                            <span>Track Order</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
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