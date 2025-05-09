import { PrismaClient } from '@/generated/prisma';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

// Define the OrderStatus enum to match the Prisma schema
enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED'
}

export type Order = {
  id: string;
  orderNumber: string;
  userId?: string | null;
  customerEmail: string;
  customerName?: string | null;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  currency: string;
  paymentMethod: string;
  paymentId?: string | null;
  status: string;
  shippingAddress: any;
  billingAddress?: any | null;
  notes?: string | null;
  shippingMethod?: string | null;
  trackingNumber?: string | null;
  createdAt: Date;
  updatedAt: Date;
  items: {
    id: string;
    orderId: string;
    productId: string;
    name: string;
    description?: string | null;
    price: number;
    quantity: number;
    image?: string | null;
  }[];
};

export interface CreateOrderData {
  customerEmail: string;
  customerName?: string;
  userId?: string;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    description?: string;
  }[];
  shipping: {
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    name?: string;
    carrier?: string;
    tracking_number?: string;
  };
  billing?: {
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
    name?: string;
  };
  payment: {
    method: string;
    id?: string;
  };
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  currency: string;
  notes?: string;
}

export const orderService = {
  /**
   * Create a new order
   */
  async createOrder(data: CreateOrderData): Promise<Order> {
    try {
      // Validate required data
      if (!data.customerEmail) {
        throw new Error('Customer email is required');
      }

      if (!Array.isArray(data.items) || data.items.length === 0) {
        throw new Error('Order must contain at least one item');
      }

      if (!data.shipping || !data.shipping.address || !data.shipping.address.line1) {
        throw new Error('Shipping address is required');
      }

      // Generate a unique order number (e.g., ORD-123456)
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}${randomUUID().slice(0, 4)}`;
      
      console.log('Creating order in database:', {
        orderNumber,
        customerEmail: data.customerEmail,
        items: data.items.length
      });
      
      // Create the order with items
      const order = await prisma.order.create({
        data: {
          orderNumber,
          customerEmail: data.customerEmail,
          customerName: data.customerName,
          userId: data.userId,
          subtotal: data.subtotal,
          tax: data.tax,
          shippingCost: data.shippingCost,
          total: data.total,
          currency: data.currency,
          paymentMethod: data.payment.method,
          paymentId: data.payment.id,
          shippingAddress: JSON.stringify(data.shipping.address),
          billingAddress: data.billing?.address ? JSON.stringify(data.billing.address) : null,
          notes: data.notes,
          shippingMethod: data.shipping.carrier,
          trackingNumber: data.shipping.tracking_number,
          status: OrderStatus.PENDING,
          items: {
            create: data.items.map(item => ({
              productId: item.productId,
              name: item.name,
              description: item.description,
              price: item.price,
              quantity: item.quantity,
              image: item.image
            }))
          }
        },
        include: {
          items: true
        }
      });
      
      console.log(`Order created successfully: ${order.orderNumber}`);
      return order as unknown as Order;
    } catch (error: any) {
      console.error('Failed to create order:', error);
      // Check for known Prisma errors
      if (error.code === 'P2002') {
        throw new Error('Order number already exists. Please try again.');
      }
      throw error;
    }
  },
  
  /**
   * Get order by ID
   */
  async getOrderById(id: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true
      }
    });
    
    return order as unknown as Order | null;
  },
  
  /**
   * Get order by order number
   */
  async getOrderByNumber(orderNumber: string): Promise<Order | null> {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true
      }
    });
    
    return order as unknown as Order | null;
  },
  
  /**
   * Get orders for a user
   */
  async getUserOrders(userId: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        items: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return orders as unknown as Order[];
  },
  
  /**
   * Get all orders with pagination
   */
  async getAllOrders(
    page = 1, 
    limit = 10, 
    status?: string,
    sortField = 'createdAt',
    sortDirection: 'asc' | 'desc' = 'desc'
  ): Promise<{ orders: Order[], total: number }> {
    const skip = (page - 1) * limit;
    
    // Build where clause for filtering
    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }
    
    // Build orderBy for sorting
    const orderBy: any = {};
    orderBy[sortField] = sortDirection;
    
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        skip,
        take: limit,
        where: whereClause,
        include: {
          items: true
        },
        orderBy
      }),
      prisma.order.count({
        where: whereClause
      })
    ]);
    
    return {
      orders: orders as unknown as Order[],
      total
    };
  },
  
  /**
   * Update order status
   */
  async updateOrderStatus(id: string, status: string): Promise<Order> {
    const order = await prisma.order.update({
      where: { id },
      data: { 
        status: status as any 
      },
      include: {
        items: true
      }
    });
    
    return order as unknown as Order;
  },
  
  /**
   * Delete an order
   */
  async deleteOrder(id: string): Promise<void> {
    try {
      // First delete related order items (if cascade delete is not set up)
      await prisma.orderItem.deleteMany({
        where: { orderId: id }
      });
      
      // Then delete the order
      await prisma.order.delete({
        where: { id }
      });
    } catch (error: any) {
      console.error('Failed to delete order:', error);
      // Check for known Prisma errors
      if (error.code === 'P2025') {
        throw new Error('Order not found');
      }
      throw error;
    }
  }
}; 