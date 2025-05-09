import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { orderService } from '@/lib/services/orderService';

// Get an order by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is admin if not accessing their own order
    const isAdmin = session.user.role === 'ADMIN';
    
    // Await params before accessing properties
    const params = await context.params;
    const id = params.id;
    
    // Retrieve the order
    const order = await orderService.getOrderById(id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Check if the order belongs to the user or if the user is an admin
    if (!isAdmin && order.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    return NextResponse.json(order);
  } catch (error: any) {
    console.error('Error retrieving order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve order' },
      { status: 500 }
    );
  }
}

// Delete an order by ID (Admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated and is an admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    // Await params before accessing properties
    const params = await context.params;
    const id = params.id;
    
    // Check if order exists
    const order = await orderService.getOrderById(id);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Delete the order
    await orderService.deleteOrder(id);
    
    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error: any) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete order' },
      { status: 500 }
    );
  }
} 