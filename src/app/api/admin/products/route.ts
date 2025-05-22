import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "../../../../lib/prisma";
import imagekit from "../../../../lib/imagekit";
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

// GET - Retrieve all products or a single product by ID
export async function GET(req: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(req);
    
    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.message }, 
        { status: adminCheck.status }
      );
    }
    
    // Check if there's an ID parameter for fetching a single product
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (id) {
      // Fetch a single product
      const product = await prisma.product.findUnique({
        where: { id },
      });
      
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' }, 
          { status: 404 }
        );
      }
      
      return NextResponse.json(product);
    }
    
    // Fetch all products
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products', details: String(error) }, 
      { status: 500 }
    );
  }
}

// POST - Create a new product
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
    const description = formData.get('description') as string;
    const longDescription = formData.get('longDescription') as string || '';
    const categoryId = formData.get('categoryId') as string;
    const priceStr = formData.get('price') as string;
    const originalPriceStr = formData.get('originalPrice') as string;
    const stockStr = formData.get('stock') as string;
    
    const price = priceStr ? parseFloat(priceStr) : 0;
    const originalPrice = originalPriceStr ? parseFloat(originalPriceStr) : null;
    const stock = stockStr ? parseInt(stockStr, 10) : 0;
    
    // Generate slug from name
    const slug = slugify(name, { lower: true, strict: true });
    
    // Extract array and object fields
    let features: string[] = [];
    let colors: string[] = [];
    let tags: string[] = [];
    let specs: any = {};
    
    try {
      const featuresString = formData.get('features') as string;
      features = featuresString ? JSON.parse(featuresString) : [];
    } catch (e) {
      console.error('Error parsing features:', e);
    }
    
    try {
      const colorsString = formData.get('colors') as string;
      colors = colorsString ? JSON.parse(colorsString) : [];
    } catch (e) {
      console.error('Error parsing colors:', e);
    }
    
    try {
      const tagsString = formData.get('tags') as string;
      tags = tagsString ? JSON.parse(tagsString) : [];
    } catch (e) {
      console.error('Error parsing tags:', e);
    }
    
    try {
      const specsString = formData.get('specs') as string;
      specs = specsString ? JSON.parse(specsString) : {};
    } catch (e) {
      console.error('Error parsing specs:', e);
    }
    
    // Extract boolean fields
    const isBestseller = formData.get('isBestseller') === 'true';
    const inStock = formData.get('inStock') === 'true';
    const freeShipping = formData.get('freeShipping') === 'true';
    const featured = formData.get('featured') === 'true';
    
    // Validate required fields
    if (!name || !description || isNaN(price) || isNaN(stock)) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Process image uploads
    const imageFiles = formData.getAll('images') as File[];
    
    if (!imageFiles || imageFiles.length === 0) {
      return NextResponse.json(
        { error: 'At least one product image is required' }, 
        { status: 400 }
      );
    }
    
    const images: string[] = [];
    
    // Upload images to ImageKit
    for (const imageFile of imageFiles) {
      try {
        const bytes = await imageFile.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate a unique filename to avoid collisions
        const uniqueId = uuidv4();
        const originalName = imageFile.name;
        const extension = originalName.split('.').pop() || 'jpg';
        const fileName = `product_${uniqueId}.${extension}`;
        
        // Upload file to ImageKit
        const uploadResponse = await imagekit.upload({
          file: buffer,
          fileName: fileName,
          folder: '/products', // Optional: store in a folder
        });
        
        // Save the URL to the database
        images.push(uploadResponse.url);
      } catch (uploadError) {
        console.error('Error uploading image to ImageKit:', uploadError);
        // Continue with other images
      }
    }
    
    if (images.length === 0) {
      return NextResponse.json(
        { error: 'Failed to upload any images' }, 
        { status: 500 }
      );
    }
    
    // Create product in the database
    const productData: any = {
      name,
      slug,
      description,
      longDescription,
      price,
      originalPrice,
      stock,
      images,
      isBestseller,
      inStock,
      freeShipping,
      featured,
      features,
      colors,
      tags,
      specs,
      rating: 0,
      reviewCount: 0,
    };
    
    // Set category data if a category ID is provided
    if (categoryId) {
      try {
        // Find the category to get its name
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
          select: { name: true }
        });
        
        if (category) {
          productData.categoryId = categoryId;
          productData.categoryName = category.name;
        }
      } catch (err) {
        console.error('Error fetching category:', err);
      }
    }
    
    console.log('Creating product with data:', JSON.stringify(productData, null, 2));
    
    const product = await prisma.product.create({
      data: productData,
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create product',
        details: String(error),
        stack: (error as Error).stack
      }, 
      { status: 500 }
    );
  }
}

// DELETE - Remove a product
export async function DELETE(req: NextRequest) {
  try {
    const adminCheck = await verifyAdmin(req);
    
    if (adminCheck.error) {
      return NextResponse.json(
        { error: adminCheck.message }, 
        { status: adminCheck.status }
      );
    }
    
    // Get the product ID from the URL query
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' }, 
        { status: 400 }
      );
    }
    
    // Get product to retrieve its images
    const product = await prisma.product.findUnique({
      where: { id },
    });
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' }, 
        { status: 404 }
      );
    }
    
    // We'll collect image URLs to display in the response
    const imageUrls = product.images || [];
    
    // Just delete the product from the database
    await prisma.product.delete({
      where: { id },
    });
    
    return NextResponse.json({ 
      message: 'Product deleted successfully',
      note: 'Product images must be deleted manually from the ImageKit Media Library.',
      imageUrls: imageUrls
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product', details: String(error) }, 
      { status: 500 }
    );
  }
}

// PUT - Update an existing product
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
        { error: 'Product ID is required' }, 
        { status: 400 }
      );
    }
    
    // Extract basic text fields
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const longDescription = formData.get('longDescription') as string || '';
    const categoryId = formData.get('categoryId') as string;
    const priceStr = formData.get('price') as string;
    const originalPriceStr = formData.get('originalPrice') as string;
    const stockStr = formData.get('stock') as string;
    
    const price = priceStr ? parseFloat(priceStr) : 0;
    const originalPrice = originalPriceStr ? parseFloat(originalPriceStr) : null;
    const stock = stockStr ? parseInt(stockStr, 10) : 0;
    
    // Generate slug from name
    const slug = slugify(name, { lower: true, strict: true });
    
    // Extract array and object fields
    let features: string[] = [];
    let colors: string[] = [];
    let tags: string[] = [];
    let specs: any = {};
    let existingImages: string[] = [];
    
    try {
      const featuresString = formData.get('features') as string;
      features = featuresString ? JSON.parse(featuresString) : [];
    } catch (e) {
      console.error('Error parsing features:', e);
    }
    
    try {
      const colorsString = formData.get('colors') as string;
      colors = colorsString ? JSON.parse(colorsString) : [];
    } catch (e) {
      console.error('Error parsing colors:', e);
    }
    
    try {
      const tagsString = formData.get('tags') as string;
      tags = tagsString ? JSON.parse(tagsString) : [];
    } catch (e) {
      console.error('Error parsing tags:', e);
    }
    
    try {
      const specsString = formData.get('specs') as string;
      specs = specsString ? JSON.parse(specsString) : {};
    } catch (e) {
      console.error('Error parsing specs:', e);
    }
    
    try {
      const existingImagesString = formData.get('existingImages') as string;
      existingImages = existingImagesString ? JSON.parse(existingImagesString) : [];
    } catch (e) {
      console.error('Error parsing existing images:', e);
    }
    
    // Extract boolean fields
    const isBestseller = formData.get('isBestseller') === 'true';
    const inStock = formData.get('inStock') === 'true';
    const freeShipping = formData.get('freeShipping') === 'true';
    const featured = formData.get('featured') === 'true';
    
    // Validate required fields
    if (!name || !description || isNaN(price) || isNaN(stock)) {
      return NextResponse.json(
        { error: 'Missing required fields' }, 
        { status: 400 }
      );
    }
    
    // Process new image uploads if any
    const imageFiles = formData.getAll('images') as File[];
    let newImages: string[] = [];
    
    if (imageFiles && imageFiles.length > 0) {
      for (const imageFile of imageFiles) {
        try {
          const bytes = await imageFile.arrayBuffer();
          const buffer = Buffer.from(bytes);
          
          // Generate a unique filename to avoid collisions
          const uniqueId = uuidv4();
          const originalName = imageFile.name;
          const extension = originalName.split('.').pop() || 'jpg';
          const fileName = `product_${uniqueId}.${extension}`;
          
          // Upload file to ImageKit
          const uploadResponse = await imagekit.upload({
            file: buffer,
            fileName: fileName,
            folder: '/products', // Optional: store in a folder
          });
          
          // Save the URL to the array
          newImages.push(uploadResponse.url);
        } catch (uploadError) {
          console.error('Error uploading image to ImageKit:', uploadError);
          // Continue with other images
        }
      }
    }
    
    // Combine existing and new images
    const images = [...existingImages, ...newImages];
    
    if (images.length === 0 && formData.has('images')) {
      return NextResponse.json(
        { error: 'At least one product image is required' }, 
        { status: 400 }
      );
    }
    
    // Set category data if a category ID is provided
    const productData: any = {
      name,
      slug,
      description,
      longDescription,
      price,
      originalPrice,
      stock,
      isBestseller,
      inStock,
      freeShipping,
      featured,
      features,
      colors,
      tags,
      specs,
    };
    
    if (categoryId) {
      try {
        // Find the category to get its name
        const category = await prisma.category.findUnique({
          where: { id: categoryId },
          select: { name: true }
        });
        
        if (category) {
          productData.categoryId = categoryId;
          productData.categoryName = category.name;
        } else {
          // If removing category, set both to null
          productData.categoryId = null;
          productData.categoryName = null;
        }
      } catch (err) {
        console.error('Error fetching category:', err);
      }
    } else {
      // If no category ID is provided, clear category data
      productData.categoryId = null;
      productData.categoryName = null;
    }
    
    // Only include images if we have any
    if (images.length > 0) {
      productData.images = images;
    }
    
    const product = await prisma.product.update({
      where: { id },
      data: productData,
    });
    
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update product',
        details: String(error),
        stack: (error as Error).stack
      }, 
      { status: 500 }
    );
  }
} 
 