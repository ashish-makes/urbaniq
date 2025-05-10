import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
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

    // Get user's wishlist items
    const wishlistItems = await prisma.wishlistItem.findMany({
      where: {
        userId: user.id,
      },
      include: {
        product: {
          include: {
            category: true,
          }
        },
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    // Transform wishlist items to the expected format
    const formattedWishlist = wishlistItems.map((item) => ({
      id: item.id,
      name: item.product.name,
      price: item.product.price,
      image: item.product.images[0] || '/placeholder.svg',
      category: item.product.category?.name || 'Uncategorized',
      stock: !item.product.inStock || item.product.stock === 0 
        ? 'Out of Stock' 
        : (item.product.stock < 5 ? 'Low Stock' : 'In Stock'),
      slug: item.product.slug,
      productId: item.productId
    }));

    return NextResponse.json(formattedWishlist);
  } catch (error) {
    console.error("Error fetching user wishlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    const body = await request.json();
    const { productId } = body;
    
    if (!productId) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
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
    
    // Check if product exists
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });
    
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    
    // Check if already in wishlist
    const existingItem = await prisma.wishlistItem.findFirst({
      where: {
        userId: user.id,
        productId,
      },
    });
    
    if (existingItem) {
      return NextResponse.json({ 
        message: "Product already in wishlist",
        isWishlisted: true,
        id: existingItem.id
      });
    }
    
    // Add to wishlist
    const wishlistItem = await prisma.wishlistItem.create({
      data: {
        userId: user.id,
        productId,
      },
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Added to wishlist",
      isWishlisted: true,
      id: wishlistItem.id
    });
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    // Get the item ID from URL params
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const productId = searchParams.get('productId');
    
    if (!id && !productId) {
      return NextResponse.json({ error: "Item ID or Product ID is required" }, { status: 400 });
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
    
    if (id) {
      // Delete by wishlist item ID
      await prisma.wishlistItem.delete({
        where: {
          id,
        },
      });
    } else if (productId) {
      // Delete by product ID
      await prisma.wishlistItem.deleteMany({
        where: {
          userId: user.id,
          productId,
        },
      });
    }
    
    return NextResponse.json({ 
      success: true,
      message: "Removed from wishlist",
      isWishlisted: false
    });
  } catch (error) {
    console.error("Error removing from wishlist:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 