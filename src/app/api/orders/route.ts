import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { orderService } from '@/lib/services/orderService';

// Create a new order
export async function POST(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    const body = await request.json();
    
    console.log('Creating order with data:', body);

    if (!body || !body.items || !body.shipping) {
      return NextResponse.json({ error: 'Invalid request data. Missing items or shipping information.' }, { status: 400 });
    }
    
    // Add user information if authenticated
    if (session?.user) {
      body.userId = session.user.id;
      body.customerEmail = body.customerEmail || session.user.email;
      body.customerName = body.customerName || session.user.name;
    }
    
    // Ensure required fields exist
    if (!body.customerEmail) {
      return NextResponse.json({ error: 'Customer email is required' }, { status: 400 });
    }
    
    // Make sure we have valid shipping address
    if (!body.shipping.address || !body.shipping.address.line1) {
      console.error('Missing shipping address:', body.shipping);
      return NextResponse.json({ error: 'Valid shipping address is required' }, { status: 400 });
    }

    // Set default values for missing fields
    if (!body.payment) {
      body.payment = { method: 'stripe' };
    }
    
    try {
      const order = await orderService.createOrder(body);
      console.log('Order created successfully:', order.orderNumber);
      return NextResponse.json({ success: true, order }, { status: 201 });
    } catch (orderError: any) {
      console.error('Error in orderService.createOrder:', orderError);
      return NextResponse.json(
        { error: `Error creating order in database: ${orderError.message}` },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Unexpected error in orders API:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    );
  }
}

// Get orders with pagination (admin access only)
export async function GET(request: NextRequest) {
  try {
    // Get the current user session
    const session = await getServerSession(authOptions);
    
    // Check if user is admin
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const status = url.searchParams.get('status') || undefined;
    const sort = url.searchParams.get('sort') || 'createdAt';
    const direction = url.searchParams.get('direction') || 'desc';
    
    // Validate sort field to prevent injection
    const allowedSortFields = ['createdAt', 'orderNumber', 'total', 'status', 'customerEmail'];
    const validatedSortField = allowedSortFields.includes(sort) ? sort : 'createdAt';
    
    // Validate sort direction
    const validatedDirection = direction === 'asc' ? 'asc' : 'desc';
    
    console.log(`Fetching orders with filters - page: ${page}, limit: ${limit}, status: ${status}, sort: ${validatedSortField}, direction: ${validatedDirection}`);
    
    const result = await orderService.getAllOrders(page, limit, status, validatedSortField, validatedDirection);
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch orders' },
      { status: 500 }
    );
  }
} 