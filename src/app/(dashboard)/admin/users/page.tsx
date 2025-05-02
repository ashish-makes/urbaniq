'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  MoreHorizontal,
  Shield,
  UserIcon,
  ChevronUp,
  ChevronDown,
  Loader2
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type User = {
  id: string;
  name: string | null;
  email: string;
  role: 'USER' | 'ADMIN';
  image: string | null;
};

export default function UsersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/admin/users');
        
        if (!response.ok) {
          // If not authorized, redirect to dashboard
          if (response.status === 401 || response.status === 403) {
            router.push('/user/dashboard');
            return;
          }
          throw new Error('Failed to fetch users');
        }
        
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchUsers();
    }
  }, [status, router]);

  const handleUpdateRole = async (userId: string, newRole: 'USER' | 'ADMIN') => {
    try {
      setIsUpdating(userId);
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          role: newRole,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user role');
      }

      const updatedUser = await response.json();
      
      // Update the users list
      setUsers(users.map(user => 
        user.id === updatedUser.id ? updatedUser : user
      ));

      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update user role');
    } finally {
      setIsUpdating(null);
    }
  };

  // Get user status badge
  const getUserStatus = (role: string) => {
    if (role === 'ADMIN') {
      return { label: 'Admin', variant: 'default' };
    }
    return { label: 'User', variant: 'outline' };
  };

  if (status === 'loading') {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-gray-400" />
          <p>Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Users</h1>
      </div>

      <div className="bg-white rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500 mb-4">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600">
                <tr className="border-b border-gray-100">
                  <th className="px-3 py-2 text-left font-medium">User</th>
                  <th className="px-3 py-2 text-left font-medium">Email</th>
                  <th className="px-3 py-2 text-left font-medium">Status</th>
                  <th className="px-3 py-2 text-center font-medium w-10">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((user) => {
                  const status = getUserStatus(user.role);
                  
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50">
                      <td className="px-3 py-2.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border border-gray-100">
                            <AvatarImage src={user.image || ''} alt={user.name || ''} />
                            <AvatarFallback>
                              {user.name?.charAt(0) || user.email.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-900 truncate max-w-[180px]">
                              {user.name || 'Unnamed User'}
                            </p>
                            <div className="flex items-center text-xs text-gray-500">
                              {user.role === 'ADMIN' ? (
                                <Shield className="mr-1 h-3 w-3 text-primary" />
                              ) : (
                                <UserIcon className="mr-1 h-3 w-3 text-gray-400" />
                              )}
                              <span>{user.role === 'ADMIN' ? 'Admin account' : 'Regular account'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-gray-700">
                        <span className="truncate max-w-[180px] block">{user.email}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <Badge 
                          variant={status.variant as any} 
                          className="text-xs font-normal"
                        >
                          {status.label}
                        </Badge>
                      </td>
                      <td className="px-3 py-2.5 text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-[160px]">
                            {user.id !== session?.user?.id && (
                              <>
                                {user.role === 'USER' ? (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateRole(user.id, 'ADMIN')}
                                    disabled={isUpdating === user.id}
                                    className="cursor-pointer"
                                  >
                                    <ChevronUp className="mr-2 h-4 w-4" />
                                    <span>Promote to Admin</span>
                                    {isUpdating === user.id && (
                                      <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                                    )}
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={() => handleUpdateRole(user.id, 'USER')}
                                    disabled={isUpdating === user.id}
                                    className="cursor-pointer"
                                  >
                                    <ChevronDown className="mr-2 h-4 w-4" />
                                    <span>Demote to User</span>
                                    {isUpdating === user.id && (
                                      <Loader2 className="ml-auto h-4 w-4 animate-spin" />
                                    )}
                                  </DropdownMenuItem>
                                )}
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 