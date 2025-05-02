'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  LineChart,
  BarChart,
  ShoppingCart,
  Package,
  CreditCard,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function UserDashboard() {
  const { data: session } = useSession();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {session?.user?.name?.split(' ')[0] || 'User'}</h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your account today.</p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-bold mt-1">12</h3>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +5% from last month
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-black/5 flex items-center justify-center">
                <Package className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Total Spent</p>
                <h3 className="text-2xl font-bold mt-1">$1,248</h3>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +12% from last month
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-black/5 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Cart Items</p>
                <h3 className="text-2xl font-bold mt-1">3</h3>
                <p className="text-xs text-red-500 flex items-center mt-1">
                  <ArrowDownRight className="mr-1 h-3 w-3" />
                  -2 from yesterday
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-black/5 flex items-center justify-center">
                <ShoppingCart className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Savings</p>
                <h3 className="text-2xl font-bold mt-1">$145</h3>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  +8% from last month
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-black/5 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Your recent orders and their status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((order) => (
                <div key={order} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-md bg-gray-100 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">Order #{1000 + order}</p>
                      <p className="text-xs text-gray-500">12 May, 2023</p>
                    </div>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                      Delivered
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending</CardTitle>
            <CardDescription>Your spending pattern over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[240px] flex items-end space-x-2">
              {[30, 45, 25, 60, 75, 50].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-black/10 rounded-t"
                    style={{ height: `${height * 2}px` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">{['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 