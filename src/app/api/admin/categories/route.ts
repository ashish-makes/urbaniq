import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import imagekit from "@/lib/imagekit";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

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
    
    // Use findFirst instead of findUnique to be more resilient
    const user = await prisma.user.findFirst({
      where: { email: session.user.email! },
      select: { role: true } // Only select the fields we need
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

// GET - Retrieve all categories or a single category by ID
export async function GET(req: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(req);
    
    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.message }, 
        { status: adminCheck.status }
      );
    }
    
    // Check if there's an ID parameter for fetching a single category
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Fetch a single category
      const category = await prisma.category.findUnique({
        where: { id },
      });
      
      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' }, 
          { status: 404 }
        );
      }
      
      return NextResponse.json(category);
    }
    
    // Fetch all categories
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
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
      { error: 'Failed to fetch categories', details: String(error) }, 
      { status: 500 }
    );
  }
}

// POST - Create a new category
export async function POST(req: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(req);
    
    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.message }, 
        { status: adminCheck.status }
      );
    }
    
    const formData = await req.formData();
    
    // Extract basic text fields
    const name = formData.get('name') as string;
    const description = formData.get('description') as string || '';
    
    // Generate slug from name
    const slug = slugify(name, { lower: true, strict: true });
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' }, 
        { status: 400 }
      );
    }
    
    // Check if a category with this slug already exists
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });
    
    if (existingCategory) {
      return NextResponse.json(
        { error: 'A category with this name already exists' }, 
        { status: 409 }
      );
    }
    
    // Process image upload if provided
    let image: string | null = null;
    const imageFile = formData.get('image') as File | null;
    
    if (imageFile && imageFile.size > 0) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate a unique filename to avoid collisions
        const uniqueId = uuidv4();
        const originalName = imageFile.name;
        const extension = originalName.split('.').pop() || 'jpg';
        const fileName = `category_${uniqueId}.${extension}`;
        
        // Upload file to ImageKit
        const uploadResponse = await imagekit.upload({
          file: buffer,
          fileName: fileName,
          folder: '/categories', // Store in a categories folder
        });
        
        // Save the URL
        image = uploadResponse.url;
      } catch (uploadError) {
        console.error('Error uploading category image:', uploadError);
        // Continue with creation even if image upload fails
      }
    }
    
    // Create category in the database
    const categoryData = {
      name,
      slug,
      description,
      image,
      isActive: true,
    };
    
    const category = await prisma.category.create({
      data: categoryData,
    });
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category', details: String(error) }, 
      { status: 500 }
    );
  }
}

// PUT - Update an existing category
export async function PUT(req: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(req);
    
    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.message }, 
        { status: adminCheck.status }
      );
    }
    
    const formData = await req.formData();
    
    // Extract ID and other fields
    const id = formData.get('id') as string;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' }, 
        { status: 400 }
      );
    }
    
    // Check if the category exists
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });
    
    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' }, 
        { status: 404 }
      );
    }
    
    // Extract basic text fields
    const name = formData.get('name') as string;
    const description = formData.get('description') as string || '';
    const isActiveStr = formData.get('isActive') as string;
    const isActive = isActiveStr === 'true';
    
    // Generate slug from name
    const slug = slugify(name, { lower: true, strict: true });
    
    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' }, 
        { status: 400 }
      );
    }
    
    // Check if another category with this slug already exists (excluding this one)
    const duplicateCategory = await prisma.category.findFirst({
      where: { 
        slug,
        id: { not: id }
      },
    });
    
    if (duplicateCategory) {
      return NextResponse.json(
        { error: 'Another category with this name already exists' }, 
        { status: 409 }
      );
    }
    
    // Process image upload if provided
    const imageFile = formData.get('image') as File | null;
    const keepExistingImage = formData.get('keepExistingImage') === 'true';
    
    let image: string | null | undefined = undefined;
    
    if (imageFile && imageFile.size > 0) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate a unique filename to avoid collisions
        const uniqueId = uuidv4();
        const originalName = imageFile.name;
        const extension = originalName.split('.').pop() || 'jpg';
        const fileName = `category_${uniqueId}.${extension}`;
        
        // Upload file to ImageKit
        const uploadResponse = await imagekit.upload({
          file: buffer,
          fileName: fileName,
          folder: '/categories', // Store in a categories folder
        });
        
        // Save the URL
        image = uploadResponse.url;
      } catch (uploadError) {
        console.error('Error uploading category image:', uploadError);
        // Continue with update even if image upload fails
      }
    } else if (!keepExistingImage) {
      // If no new image and not keeping existing, set to null
      image = null;
    }
    
    // Update category in the database
    const categoryData: any = {
      name,
      slug,
      description,
      isActive,
    };
    
    // Only include image if it's defined (either new or null)
    if (image !== undefined) {
      categoryData.image = image;
    }
    
    const category = await prisma.category.update({
      where: { id },
      data: categoryData,
    });
    
    // Update categoryName in all related products for consistency
    await prisma.product.updateMany({
      where: { categoryId: id },
      data: { categoryName: name }
    });
    
    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category', details: String(error) }, 
      { status: 500 }
    );
  }
}

// DELETE - Remove a category
export async function DELETE(req: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(req);
    
    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.message }, 
        { status: adminCheck.status }
      );
    }
    
    // Get the category ID from the URL query
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' }, 
        { status: 400 }
      );
    }
    
    // Get category to check if it exists
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
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
    
    // Check if the category has associated products
    if (category._count.products > 0) {
      // Update all products to remove this category reference
      await prisma.product.updateMany({
        where: { categoryId: id },
        data: { 
          categoryId: null,
          categoryName: null
        }
      });
    }
    
    // Delete the category image from ImageKit if it exists
    if (category.image) {
      try {
        // Extract the file ID from the ImageKit URL
        const fileId = category.image.split('/').pop();
        if (fileId) {
          await imagekit.deleteFile(fileId);
        }
      } catch (imageError) {
        console.error('Error deleting category image:', imageError);
        // Continue with deletion even if image deletion fails
      }
    }
    
    // Delete the category
    await prisma.category.delete({
      where: { id },
    });
    
    return NextResponse.json({ 
      message: 'Category deleted successfully',
      productsUpdated: category._count.products
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category', details: String(error) }, 
      { status: 500 }
    );
  }
} 