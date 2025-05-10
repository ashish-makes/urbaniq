import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// DELETE /api/user/cart/items/[id] - Remove an item from the user's cart
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    
    if (!id) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
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

    // Find the user's cart
    const cart = await prisma.cart.findFirst({
      where: {
        userId: user.id,
      },
    });

    if (!cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Find the cart item
    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id: id,
      },
    });

    if (!cartItem) {
      return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
    }

    // Verify this item belongs to the user's cart
    if (cartItem.cartId !== cart.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Delete the cart item
    await prisma.cartItem.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Item removed from cart successfully" 
    });
  } catch (error) {
    console.error("Error removing item from cart:", error);
    return NextResponse.json(
      { error: "Failed to remove item from cart" },
      { status: 500 }
    );
  }
} 