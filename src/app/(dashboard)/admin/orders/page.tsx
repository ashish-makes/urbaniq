'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  ArrowUpDown, 
  Loader2, 
  MoreHorizontal, 
  PackageCheck,
  File,
  Mail,
  Trash2
} from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

// Order type definition
interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName?: string;
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'REFUNDED';
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
}

export default function OrdersPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [sortField, setSortField] = useState<string>('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  const ordersPerPage = 10;
  
  // Fetch orders from the API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/orders?page=${currentPage}&limit=${ordersPerPage}&status=${statusFilter || ''}&sort=${sortField}&direction=${sortDirection}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        
        const data = await response.json();
        setOrders(data.orders);
        setTotalOrders(data.total);
      } catch (err: any) {
        console.error('Error fetching orders:', err);
        setError(err.message);
        toast.error('Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentPage, statusFilter, sortField, sortDirection]);
  
  // Handle status filter change
  const handleStatusChange = (value: string) => {
    // Update filter value, handling "ALL" as undefined to clear the filter
    setStatusFilter(value === 'ALL' ? undefined : value);
    // Reset to first page when filtering
    setCurrentPage(1);
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
    setCurrentPage(1);
  };

  // Handle delete order (you would need to implement this API endpoint)
  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      setIsDeleting(id);
      const response = await fetch(`/api/orders/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete order');
      }

      setOrders(orders.filter((order) => order.id !== id));
      toast.success('Order deleted successfully');
    } catch (error: any) {
      console.error('Error deleting order:', error);
      toast.error('Failed to delete order');
    } finally {
      setIsDeleting(null);
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
  
  // Calculate pagination
  const totalPages = Math.ceil(totalOrders / ordersPerPage);
  
  // Simple pagination component
  const Pagination = ({ 
    currentPage, 
    totalPages, 
    onPageChange 
  }: { 
    currentPage: number; 
    totalPages: number; 
    onPageChange: (page: number) => void 
  }) => {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    return (
      <div className="flex items-center justify-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        
        {pages.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    );
  };

  // Skeleton loader for orders
  const OrdersTableSkeleton = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="border-b border-gray-100">
              <th className="px-3 py-2 text-left font-medium">Order #</th>
              <th className="px-3 py-2 text-left font-medium">Customer</th>
              <th className="px-3 py-2 text-left font-medium">Status</th>
              <th className="px-3 py-2 text-right font-medium">Total</th>
              <th className="px-3 py-2 text-left font-medium">Date</th>
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
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[180px]" />
                  </div>
                </td>
                <td className="px-3 py-2.5">
                  <Skeleton className="h-6 w-20 rounded-full" />
                </td>
                <td className="px-3 py-2.5 text-right">
                  <Skeleton className="h-4 w-16 ml-auto" />
                </td>
                <td className="px-3 py-2.5">
                  <Skeleton className="h-4 w-[120px]" />
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
          <h1 className="text-2xl font-semibold">Orders</h1>
          <div className="flex flex-wrap gap-2">
            <Select value={statusFilter || 'ALL'} onValueChange={handleStatusChange}>
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
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[calc(50%-4px)] sm:w-[130px] text-sm border-gray-200">
                <SelectValue placeholder="Sort orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest first</SelectItem>
                <SelectItem value="createdAt-asc">Oldest first</SelectItem>
                <SelectItem value="total-desc">Highest amount</SelectItem>
                <SelectItem value="total-asc">Lowest amount</SelectItem>
                <SelectItem value="status-asc">Status (A-Z)</SelectItem>
                <SelectItem value="status-desc">Status (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      
      {error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      ) : loading ? (
        <div className="bg-white rounded-lg overflow-hidden">
          <OrdersTableSkeleton />
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <PackageCheck className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No orders found</p>
          {statusFilter && (
            <Button className='rounded-full' onClick={() => setStatusFilter(undefined)}>View All Orders</Button>
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
                    onClick={() => handleSortChange('customerEmail')}
                  >
                    <div className="flex items-center">
                      Customer 
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
                  <th 
                    className="px-3 py-2 text-left font-medium cursor-pointer" 
                    onClick={() => handleSortChange('createdAt')}
                  >
                    <div className="flex items-center">
                      Date 
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-3 py-2 text-center font-medium w-10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50">
                    <td className="px-3 py-2.5 font-medium text-gray-900">
                      {order.orderNumber}
                    </td>
                    <td className="px-3 py-2.5">
                      <div>
                        {order.customerName && <div className="font-medium">{order.customerName}</div>}
                        <div className="text-xs text-gray-500">{order.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge className={`inline-flex px-2 py-1 text-xs font-normal ${getStatusBadgeColor(order.status)}`}>
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 text-gray-500">
                      {formatDate(order.createdAt)}
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
                            onClick={() => router.push(`/admin/orders/${order.id}`)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/orders/${order.id}/invoice`)}
                            className="cursor-pointer"
                          >
                            <File className="mr-2 h-4 w-4" />
                            <span>Generate Invoice</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => window.location.href = `mailto:${order.customerEmail}?subject=Order ${order.orderNumber}`}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            <span>Email Customer</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteOrder(order.id)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                            disabled={isDeleting === order.id}
                          >
                            {isDeleting === order.id ? (
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
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
} 