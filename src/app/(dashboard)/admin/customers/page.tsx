'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, User, MoreHorizontal, Loader2, Mail, Package, Trash2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from 'sonner';

// This would come from your database
interface Customer {
  id: string;
  name: string;
  email: string;
  orderCount: number;
  totalSpent: number;
  lastOrderDate: Date | null;
  image?: string | null;
}

export default function CustomersPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  
  const customersPerPage = 10;
  
  // Fetch customers
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // Construct the API URL with search and pagination parameters
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: customersPerPage.toString(),
        });
        
        if (searchTerm) {
          params.append('search', searchTerm);
        }
        
        const response = await fetch(`/api/customers?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        
        setCustomers(data.customers);
        setTotalCustomers(data.total);
        setTotalPages(data.totalPages);
      } catch (err: any) {
        console.error('Error fetching customers:', err);
        setError(err.message);
        toast.error('Failed to load customers');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCustomers();
  }, [searchTerm, currentPage, customersPerPage]);

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
  };
  
  // Handle customer deletion
  const handleDeleteCustomer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer? Their order history will be anonymized.')) {
      return;
    }

    try {
      setIsDeleting(id);
      // Real API call
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      setCustomers(customers.filter(customer => customer.id !== id));
      toast.success('Customer deleted successfully');
    } catch (error: any) {
      console.error('Error deleting customer:', error);
      toast.error('Failed to delete customer');
    } finally {
      setIsDeleting(null);
    }
  };
  
  // Format date
  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date));
  };
  
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
    // Show a max of 5 page buttons at a time
    let pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      pages = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Always include first and last page
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      if (endPage - startPage + 1 < maxPagesToShow) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
    }
    
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

  // Skeleton loader for customers table
  const CustomersTableSkeleton = () => {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr className="border-b border-gray-100">
              <th className="px-3 py-2 text-left font-medium">Customer</th>
              <th className="px-3 py-2 text-center font-medium">Orders</th>
              <th className="px-3 py-2 text-right font-medium">Total Spent</th>
              <th className="px-3 py-2 text-left font-medium">Last Order</th>
              <th className="px-3 py-2 text-center font-medium w-10">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="hover:bg-gray-50/50">
                <td className="px-3 py-2.5">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-[120px]" />
                    <Skeleton className="h-3 w-[180px]" />
                  </div>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <Skeleton className="h-4 w-8 mx-auto" />
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-semibold">Customers</h1>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search customers..."
            className="pl-8 w-[250px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>
      
      {error ? (
        <div className="bg-red-100 text-red-800 p-4 rounded-md mb-4">
          {error}
        </div>
      ) : loading ? (
        <div className="bg-white rounded-lg overflow-hidden">
          <CustomersTableSkeleton />
        </div>
      ) : customers.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center">
          <User className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <p className="text-gray-500 mb-4">No customers found</p>
          <Button onClick={() => setSearchTerm('')}>Clear Search</Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2 text-left font-medium">Customer</th>
                  <th className="px-3 py-2 text-center font-medium">Orders</th>
                  <th className="px-3 py-2 text-right font-medium">Total Spent</th>
                  <th className="px-3 py-2 text-left font-medium">Last Order</th>
                  <th className="px-3 py-2 text-center font-medium w-10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-gray-50/50">
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        {customer.image ? (
                          <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                            <img 
                              src={customer.image} 
                              alt={customer.name} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                            <User className="h-4 w-4 text-gray-500" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{customer.name}</div>
                          <div className="text-xs text-gray-500">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-2.5 text-center">
                      {customer.orderCount}
                    </td>
                    <td className="px-3 py-2.5 text-right font-medium">
                      ${customer.totalSpent.toFixed(2)}
                    </td>
                    <td className="px-3 py-2.5 text-gray-500">
                      {formatDate(customer.lastOrderDate)}
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
                            onClick={() => router.push(`/admin/customers/${customer.id}`)}
                            className="cursor-pointer"
                          >
                            <User className="mr-2 h-4 w-4" />
                            <span>View Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => window.location.href = `mailto:${customer.email}`}
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            <span>Email Customer</span>
                          </DropdownMenuItem>
                          {customer.orderCount > 0 && (
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/customers/${customer.id}?tab=orders`)}
                              className="cursor-pointer"
                            >
                              <Package className="mr-2 h-4 w-4" />
                              <span>View Orders</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            onClick={() => handleDeleteCustomer(customer.id)}
                            className="cursor-pointer text-red-600 focus:text-red-600"
                            disabled={isDeleting === customer.id}
                          >
                            {isDeleting === customer.id ? (
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
      
      {!loading && totalPages > 1 && (
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