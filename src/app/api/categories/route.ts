import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Retrieve all active categories or a single category by slug
export async function GET(req: NextRequest) {
  try {
    // Check if there's a slug parameter for fetching a single category
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    
    if (slug) {
      // Fetch a single category by slug
      const category = await prisma.category.findUnique({
        where: { slug },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          _count: {
            select: {
              products: true
            }
          }
        }
      });
      
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' }, 
          { status: 404 }
        );
      }
      
      return NextResponse.json(category);
    }
    
    // Fetch only active categories
    const categories = await prisma.category.findMany({
      where: {
        isActive: true
      },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    });
    
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' }, 
      { status: 500 }
    );
  }
} 