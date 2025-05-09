import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { PrismaClient } from '@/generated/prisma';

const prisma = new PrismaClient();

// Get customers with pagination (admin access only)
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
    const search = url.searchParams.get('search') || '';
    const sort = url.searchParams.get('sort') || 'name';
    const direction = url.searchParams.get('direction') || 'asc';
    
    // Validate sort field to prevent injection
    const allowedSortFields = ['name', 'email', 'createdAt'];
    const validatedSortField = allowedSortFields.includes(sort) ? sort : 'name';
    
    // Validate sort direction
    const validatedDirection = direction === 'asc' ? 'asc' : 'desc';
    
    // Build where clause for filtering and search
    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    // First fetch users
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          image: true,
          orders: {
            select: {
              id: true,
              orderNumber: true,
              total: true,
              createdAt: true
            }
          },
          _count: {
            select: {
              orders: true
            }
          }
        },
        orderBy: {
          [validatedSortField]: validatedDirection
        }
      }),
      prisma.user.count({
        where: whereClause
      })
    ]);
    
    // Transform users to include order count and spending
    const customers = users.map(user => {
      const totalSpent = user.orders.reduce((sum, order) => sum + order.total, 0);
      const lastOrder = user.orders.length > 0 
        ? user.orders.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0]
        : null;
      
      return {
        id: user.id,
        name: user.name || 'Unnamed Customer',
        email: user.email,
        orderCount: user._count.orders,
        totalSpent,
        lastOrderDate: lastOrder ? lastOrder.createdAt : null,
        createdAt: user.createdAt,
        image: user.image
      };
    });
    
    return NextResponse.json({
      customers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error: any) {
    console.error('Error fetching customers:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch customers' },
      { status: 500 }
    );
  }
} 