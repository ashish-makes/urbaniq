import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch the order with all related data
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Check if order exists
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Check if order belongs to user
    if (order.userId !== user.id) {
      return NextResponse.json(
        { error: "You do not have permission to view this order" },
        { status: 403 }
      );
    }

    // Transform the order data to the expected format
    const formattedOrder = {
      id: order.id,
      orderNumber: order.orderNumber,
      status: order.status.toLowerCase(),
      date: new Date(order.createdAt).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        description: item.description,
        price: item.price,
        quantity: item.quantity,
        image: item.image || item.product?.images?.[0],
      })),
      subtotal: order.subtotal,
      tax: order.tax,
      shippingCost: order.shippingCost,
      total: order.total,
      shippingAddress: order.shippingAddress as any,
      billingAddress: order.billingAddress as any,
      paymentMethod: order.paymentMethod,
      trackingNumber: order.trackingNumber,
      shippingMethod: order.shippingMethod,
      notes: order.notes,
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 