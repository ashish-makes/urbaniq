import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  context: { params: { slug: string } }
) {
  try {
    // Log the request for debugging
    console.log(`Fetching product with slug: ${context.params.slug}`);
    
    // Properly await params before accessing its properties
    const params = await context.params;
    const slug = params.slug;

    if (!slug) {
      return NextResponse.json(
        { error: "Product slug is required" },
        { status: 400 }
      );
    }

    // Add timestamp query parameter to force fresh data
    const timestamp = req.nextUrl.searchParams.get('t');
    console.log(`Request timestamp: ${timestamp || 'none'}`);

    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
      include: {
        reviews: {
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            user: {
              select: {
                id: true,
                image: true,
                name: true,
              },
            },
            images: true,
          },
        }
      }
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Log the number of reviews found
    console.log(`Found product ${product.name} with ${product.reviews.length} reviews`);

    // Set cache control headers to prevent caching
    return new NextResponse(JSON.stringify(product), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, max-age=0, must-revalidate'
      }
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
} 