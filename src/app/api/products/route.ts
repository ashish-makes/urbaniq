import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const categorySlug = searchParams.get('category');
    const featured = searchParams.get('featured');
    
    // Build the base query
    let whereClause: any = {};
    
    // Handle category filtering
    if (categorySlug) {
      // First find the category by slug
      const category = await prisma.category.findUnique({
        where: { slug: categorySlug },
        select: { id: true }
      });
      
      if (category) {
        // Then filter products by categoryId
        whereClause.categoryId = category.id;
      } else {
        // If category not found, return empty results
        return NextResponse.json([]);
      }
    }
    
    // Handle featured products filtering
    if (featured === 'true') {
      whereClause.featured = true;
    }
    
    // Fetch products
    const products = await prisma.product.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });
    
    // Transform products to include category information in a flattened structure
    const formattedProducts = products.map(product => ({
      ...product,
      categoryName: product.category?.name || null,
      categorySlug: product.category?.slug || null,
      category: product.category?.slug || product.category || null, // For backward compatibility
      // Remove the nested category object
      ...(!product.category ? {} : {})
    }));
    
    return NextResponse.json(formattedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
} 