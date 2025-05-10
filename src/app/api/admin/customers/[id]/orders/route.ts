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

    // Fetch the customer's orders
    const orders = await prisma.order.findMany({
      where: { 
        userId: userId 
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                name: true,
                price: true,
                images: true
              }
            }
          }
        }
      }
    });

    if (!orders.length) {
      // Return empty array rather than 404 since having no orders is valid
      return NextResponse.json([]);
    }

    // Format the orders for the response
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      total: order.total,
      status: order.status,
      items: order.items.map(item => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        product: item.product ? {
          name: item.product.name,
          price: item.product.price,
          image: item.product.images?.[0] || null
        } : null
      }))
    }));

    return NextResponse.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching customer orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customer orders' },
      { status: 500 }
    );
  }
} 