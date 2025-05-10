import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    // Check if user is authenticated and has admin role
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Await the params object before accessing its properties
    const params = await context.params;
    const userId = params.id;

    // Fetch customer from database
    const customer = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        image: true,
        role: true,
        orders: {
          select: {
            id: true,
          },
          take: 1,
        },
      },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Add a count of orders to the customer data
    const orderCount = await prisma.order.count({
      where: {
        userId: userId
      }
    });

    // Calculate the total spent by this customer
    const totalSpentResult = await prisma.order.aggregate({
      where: {
        userId: userId,
        status: {
          in: ['DELIVERED', 'SHIPPED', 'PROCESSING']
        }
      },
      _sum: {
        total: true
      }
    });

    const customerWithExtras = {
      ...customer,
      orderCount,
      totalSpent: totalSpentResult._sum.total || 0
    };

    return NextResponse.json(customerWithExtras);
  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer' },
      { status: 500 }
    );
  }
} 