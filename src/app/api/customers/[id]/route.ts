import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// Get a customer by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Await params before accessing properties
    const params = await context.params;
    const id = params.id;
    
    // Get the customer with order information
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: {
            createdAt: 'desc'
          },
          include: {
            items: true
          }
        },
        _count: {
          select: {
            orders: true
          }
        }
      }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    // Calculate some stats
    const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);
    
    // Format the customer data
    const customer = {
      id: user.id,
      name: user.name || 'Unnamed Customer',
      email: user.email,
      image: user.image,
      createdAt: user.createdAt,
      orderCount: user._count.orders,
      totalSpent,
      orders: user.orders.map(order => ({
        id: order.id,
        orderNumber: order.orderNumber,
        date: order.createdAt,
        total: order.total,
        status: order.status,
        items: order.items
      }))
    };
    
    return NextResponse.json(customer);
  } catch (error: any) {
    console.error('Error retrieving customer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve customer' },
      { status: 500 }
    );
  }
}

// Delete a customer
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Await params before accessing properties
    const params = await context.params;
    const id = params.id;
    
    // Check if the customer exists
    const existingUser = await prisma.user.findUnique({
      where: { id }
    });
    
    if (!existingUser) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }
    
    // Delete related data
    await prisma.$transaction([
      prisma.cart.deleteMany({
        where: { userId: id }
      }),
      prisma.session.deleteMany({
        where: { userId: id }
      }),
      prisma.account.deleteMany({
        where: { userId: id }
      }),
      // We don't delete orders as they are important for business records
      // but we can anonymize them
      prisma.order.updateMany({
        where: { userId: id },
        data: {
          userId: null
        }
      }),
      // Finally delete the user
      prisma.user.delete({
        where: { id }
      })
    ]);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete customer' },
      { status: 500 }
    );
  }
} 