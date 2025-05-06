import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "../../../../lib/prisma";

// Helper function to verify admin access
async function verifyAdmin(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return { 
        error: true, 
        message: 'You must be logged in to access this resource.', 
        status: 401 
      };
    }
    
    const user = await prisma.user.findFirst({
      where: { email: session.user.email! },
      select: { role: true }
    });
    
    if (!user || user.role !== "ADMIN") {
      return { 
        error: true, 
        message: 'You do not have permission to access this resource.', 
        status: 403 
      };
    }
    
    return { error: false, user };
  } catch (error) {
    console.error('Error verifying admin:', error);
    return {
      error: true,
      message: 'Authentication error occurred.',
      status: 500
    };
  }
}

// POST - Fix null categoryName values
export async function POST(req: NextRequest) {
  try {
    // Ensure only admins can run this migration
    const adminCheck = await verifyAdmin(req);
    
    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.message }, 
        { status: adminCheck.status }
      );
    }
    
    // Find all products with null categoryName
    const products = await prisma.product.findMany({
      where: {
        categoryName: {
          equals: null as any
        }
      },
      select: {
        id: true,
        categoryId: true
      }
    });
    
    console.log(`Found ${products.length} products with null categoryName`);
    
    // Update products with appropriate category names
    const updates = [];
    for (const product of products) {
      let categoryName = "Uncategorized";
      
      if (product.categoryId) {
        try {
          const category = await prisma.category.findUnique({
            where: { id: product.categoryId },
            select: { name: true }
          });
          
          if (category && category.name) {
            categoryName = category.name;
          }
        } catch (err) {
          console.error(`Error finding category for product ${product.id}:`, err);
        }
      }
      
      // Update the product
      updates.push(
        prisma.product.update({
          where: { id: product.id },
          data: { categoryName }
        })
      );
    }
    
    // Execute all updates
    const results = await Promise.all(updates);
    
    return NextResponse.json({ 
      success: true, 
      message: `Fixed ${results.length} products with null categoryName values` 
    });
  } catch (error) {
    console.error('Error fixing null categoryName values:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fix null categoryName values',
        details: String(error)
      }, 
      { status: 500 }
    );
  }
} 