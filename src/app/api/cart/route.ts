import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/cart - Fetch a user's cart
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionId = req.cookies.get('cartSessionId')?.value;
    
    // Return empty cart by default
    const emptyCart = { 
      items: [], 
      totalItems: 0, 
      totalPrice: 0 
    };
    
    // If neither authenticated nor has sessionId, return empty cart
    if (!session?.user?.email && !sessionId) {
      return NextResponse.json(emptyCart);
    }
    
    let cart;
    
    // Find the user's cart or the session cart
    if (session?.user?.email) {
      // Find the user first
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      
      if (!user) {
        return NextResponse.json(emptyCart);
      }
      
      // Find user's cart
      cart = await prisma.cart.findFirst({
        where: { userId: user.id },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    } else if (sessionId) {
      // Find session-based cart
      cart = await prisma.cart.findFirst({
        where: { sessionId },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    }
    
    // If no cart found, return empty cart
    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json(emptyCart);
    }
    
    // Format cart items for the response
    const formattedItems = cart.items.map(item => ({
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      price: item.price,
      quantity: item.quantity,
      image: item.product.images?.[0] || '/placeholder.png'
    }));
    
    // Calculate totals
    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    return NextResponse.json({
      items: formattedItems,
      totalItems,
      totalPrice
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST /api/cart - Add an item to the cart
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    let sessionId = req.cookies.get('cartSessionId')?.value;
    
    // Get item data from request
    const { id: productId, quantity = 1 } = await req.json();
    
    // Validate product ID
    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    // Get the product to make sure it exists and get current price
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });
    
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    // Determine if this is an authenticated user request
    const isAuthenticated = !!session?.user?.email;
    let userId: string | null = null;
    
    // Get user ID if authenticated
    if (isAuthenticated && session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      
      if (user) {
        userId = user.id;
      }
    }
    
    // Create a new sessionId if needed for guest users
    if (!isAuthenticated && !sessionId) {
      sessionId = crypto.randomUUID();
      
      // Set the cookie with the API response
      const response = NextResponse.json({ 
        success: true, 
        message: 'Item added to cart',
        sessionId 
      });
      
      response.cookies.set('cartSessionId', sessionId, {
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      });
      
      return response;
    }
    
    // Now find or create the cart
    let cart;
    
    if (userId) {
      // Find user's cart
      cart = await prisma.cart.findFirst({
        where: { userId },
        include: { items: true }
      });
      
      if (!cart) {
        // Create user cart
        cart = await prisma.cart.create({
          data: { userId },
          include: { items: true }
        });
      }
    } else if (sessionId) {
      // Find session cart
      cart = await prisma.cart.findFirst({
        where: { sessionId },
        include: { items: true }
      });
      
      if (!cart) {
        // Create session cart
        cart = await prisma.cart.create({
          data: { sessionId },
          include: { items: true }
        });
      }
    } else {
      return NextResponse.json({ error: 'Unable to create cart' }, { status: 500 });
    }
    
    // Now we have a cart, check if the item already exists
    const existingItem = cart.items.find(item => item.productId === productId);
    
    if (existingItem) {
      // Update existing item
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
    } else {
      // Add new item
      await prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
          price: product.price
        }
      });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Item added to cart'
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return NextResponse.json({ error: 'Failed to add item to cart' }, { status: 500 });
  }
}

// DELETE /api/cart - Clear the cart
export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const sessionId = req.cookies.get('cartSessionId')?.value;
    
    // If neither authenticated nor has sessionId, nothing to clear
    if (!session?.user?.email && !sessionId) {
      return NextResponse.json({ success: true, message: 'Cart already empty' });
    }
    
    let cart;
    
    // Find the user's cart or the session cart
    if (session?.user?.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email }
      });
      
      if (!user) {
        return NextResponse.json({ success: true, message: 'User not found' });
      }
      
      cart = await prisma.cart.findFirst({
        where: { userId: user.id }
      });
    } else if (sessionId) {
      cart = await prisma.cart.findFirst({
        where: { sessionId }
      });
    }
    
    if (!cart) {
      return NextResponse.json({ success: true, message: 'Cart already empty' });
    }
    
    // Delete all items in the cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id }
    });
    
    return NextResponse.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
} 