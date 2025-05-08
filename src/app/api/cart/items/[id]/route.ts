import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// PATCH /api/cart/items/[id] - Update cart item quantity
export async function PATCH(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const sessionId = req.cookies.get('cartSessionId')?.value;
    
    // If neither authenticated nor has sessionId, return error
    if (!session?.user?.email && !sessionId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Properly await params before accessing its properties
    const params = await context.params;
    const id = params.id;
    const { quantity } = await req.json();
    
    // Validate quantity
    if (!quantity || quantity < 1) {
      return NextResponse.json({ error: 'Quantity must be at least 1' }, { status: 400 });
    }
    
    let cartItem = null;
    
    // First try to find the item directly by its ID
    cartItem = await prisma.cartItem.findUnique({
      where: { id }
    });
    
    // If not found, try to find by product ID in a valid cart
    if (!cartItem) {
      // Find cart based on user session or cookie
      let cart;
      
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email }
        });
        
        if (user) {
          cart = await prisma.cart.findFirst({
            where: { userId: user.id },
            include: { items: true }
          });
        }
      } else if (sessionId) {
        cart = await prisma.cart.findFirst({
          where: { sessionId },
          include: { items: true }
        });
      }
      
      if (cart && cart.items) {
        // Find the item by product ID
        const item = cart.items.find(item => item.productId === id);
        
        if (item) {
          cartItem = item;
        }
      }
    }
    
    // If still not found, return error
    if (!cartItem) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }
    
    // Verify authorization - make sure the cart item belongs to the user/session
    let isAuthorized = false;
    
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      
      if (user) {
        const cart = await prisma.cart.findFirst({
          where: { 
            userId: user.id,
            id: cartItem.cartId
          }
        });
        
        isAuthorized = !!cart;
      }
    } else if (sessionId) {
      const cart = await prisma.cart.findFirst({
        where: { 
          sessionId,
          id: cartItem.cartId
        }
      });
      
      isAuthorized = !!cart;
    }
    
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized access to cart item' }, { status: 403 });
    }
    
    // Update the item quantity
    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity }
    });
    
    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error('Error updating cart item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}

// DELETE /api/cart/items/[id] - Remove an item from the cart
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const sessionId = req.cookies.get('cartSessionId')?.value;
    
    // If neither authenticated nor has sessionId, return error
    if (!session?.user?.email && !sessionId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    // Properly await params before accessing its properties
    const params = await context.params;
    const id = params.id;
    
    let cartItem = null;
    
    // First try to find the item directly by its ID
    cartItem = await prisma.cartItem.findUnique({
      where: { id }
    });
    
    // If not found, try to find by product ID in a valid cart
    if (!cartItem) {
      // Find cart based on user session or cookie
      let cart;
      
      if (session?.user?.email) {
        const user = await prisma.user.findUnique({
          where: { email: session.user.email }
        });
        
        if (user) {
          cart = await prisma.cart.findFirst({
            where: { userId: user.id },
            include: { items: true }
          });
        }
      } else if (sessionId) {
        cart = await prisma.cart.findFirst({
          where: { sessionId },
          include: { items: true }
        });
      }
      
      if (cart && cart.items) {
        // Find the item by product ID
        const item = cart.items.find(item => item.productId === id);
        
        if (item) {
          cartItem = item;
        }
      }
    }
    
    // If still not found, return error
    if (!cartItem) {
      return NextResponse.json({ error: 'Item not found in cart' }, { status: 404 });
    }
    
    // Verify authorization - make sure the cart item belongs to the user/session
    let isAuthorized = false;
    
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      
      if (user) {
        const cart = await prisma.cart.findFirst({
          where: { 
            userId: user.id,
            id: cartItem.cartId
          }
        });
        
        isAuthorized = !!cart;
      }
    } else if (sessionId) {
      const cart = await prisma.cart.findFirst({
        where: { 
          sessionId,
          id: cartItem.cartId
        }
      });
      
      isAuthorized = !!cart;
    }
    
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized access to cart item' }, { status: 403 });
    }
    
    // Delete the item
    await prisma.cartItem.delete({
      where: { id: cartItem.id }
    });
    
    return NextResponse.json({ success: true, message: 'Item removed from cart' });
  } catch (error) {
    console.error('Error removing cart item:', error);
    return NextResponse.json({ error: 'Failed to remove item' }, { status: 500 });
  }
} 