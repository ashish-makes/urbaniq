import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import ImageKit from 'imagekit';

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

// Log the ImageKit configuration (without sensitive keys)
console.log('ImageKit initialized with:', {
  publicKeyProvided: !!process.env.IMAGEKIT_PUBLIC_KEY,
  privateKeyProvided: !!process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// GET endpoint to get authentication tokens for ImageKit
export async function GET() {
  try {
    const token = imagekit.getAuthenticationParameters();
    console.log('ImageKit auth tokens generated:', {
      token: token.token ? 'present' : 'missing',
      signature: token.signature ? 'present' : 'missing',
      expire: token.expire
    });
    
    // Add publicKey to the response
    const response = {
      ...token,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating ImageKit auth tokens:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication tokens' },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new review
export async function POST(request: NextRequest) {
  console.log('========== REVIEW SUBMISSION START ==========');
  
  try {
    // Get session
    const session = await getServerSession(authOptions);
    console.log('Session:', session ? {
      userId: session.user?.id,
      email: session.user?.email,
      name: session.user?.name
    } : 'No session');
    
    if (!session || !session.user) {
      console.error('Unauthorized: No session or user');
      return NextResponse.json({ error: 'You must be logged in to submit a review' }, { status: 401 });
    }
    
    // Get request data
    const data = await request.json();
    console.log('Review data received:', {
      productId: data.productId,
      rating: data.rating,
      title: data.title?.substring(0, 20) + '...',
      commentLength: data.comment?.length,
      imagesCount: data.images?.length || 0
    });
    
    const { productId, rating, title, comment, images } = data;
    
    // Validate data
    if (!productId) {
      console.error('Missing productId');
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }
    
    if (!rating || rating < 1 || rating > 5) {
      console.error('Invalid rating:', rating);
      return NextResponse.json({ error: 'Valid rating (1-5) is required' }, { status: 400 });
    }
    
    if (!title || !title.trim()) {
      console.error('Missing title');
      return NextResponse.json({ error: 'Review title is required' }, { status: 400 });
    }
    
    if (!comment || !comment.trim()) {
      console.error('Missing comment');
      return NextResponse.json({ error: 'Review comment is required' }, { status: 400 });
    }
    
    // Check if product exists
    console.log('Finding product with ID:', productId);
    let product;
    try {
      product = await prisma.product.findUnique({
        where: { id: productId },
      });
    } catch (dbError: any) {
      console.error('Database error when finding product:', dbError.message);
      return NextResponse.json({ error: 'Database error. Please try again.' }, { status: 500 });
    }
    
    if (!product) {
      console.error('Product not found with ID:', productId);
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    console.log('Product found:', product.name);
    
    // Check for existing review
    console.log('Checking for existing review by user:', session.user.id);
    let existingReview;
    try {
      existingReview = await prisma.review.findFirst({
        where: {
          productId,
          userId: session.user.id,
        },
        include: { images: true },
      });
    } catch (dbError: any) {
      console.error('Database error when finding existing review:', dbError.message);
      return NextResponse.json({ error: 'Database error. Please try again.' }, { status: 500 });
    }
    
    // Create or update review
    let review;
    try {
      if (existingReview) {
        console.log('Updating existing review:', existingReview.id);
        
        // Delete existing images if there are new ones
        if (images && existingReview.images.length > 0) {
          try {
            console.log('Deleting existing review images');
            // Delete from ImageKit
            for (const image of existingReview.images) {
              await imagekit.deleteFile(image.fileId);
            }
            
            // Delete from database
            await prisma.reviewImage.deleteMany({
              where: { reviewId: existingReview.id }
            });
          } catch (imageError) {
            console.error('Error deleting existing images:', imageError);
            // Continue with update even if image deletion fails
          }
        }
        
        // Update review
        review = await prisma.review.update({
          where: { id: existingReview.id },
          data: {
            rating,
            title,
            comment,
            updatedAt: new Date(),
            images: {
              create: images ? images.map((image: any) => ({
                url: image.url,
                fileId: image.fileId,
              })) : [],
            },
          },
          include: { images: true },
        });
        console.log('Review updated successfully, ID:', review.id);
      } else {
        console.log('Creating new review');
        
        // Create review
        review = await prisma.review.create({
          data: {
            productId,
            userId: session.user.id,
            username: session.user.name || 'Anonymous',
            rating,
            title,
            comment,
            verified: true,
            images: {
              create: images ? images.map((image: any) => ({
                url: image.url,
                fileId: image.fileId,
              })) : [],
            },
          },
          include: { images: true },
        });
        console.log('Review created successfully, ID:', review.id);
      }
    } catch (dbError: any) {
      console.error('Database error creating/updating review:', dbError.message);
      return NextResponse.json({ 
        error: 'Failed to save review. Database error: ' + dbError.message 
      }, { status: 500 });
    }
    
    // Update product rating and review count
    try {
      console.log('Updating product rating');
      const allReviews = await prisma.review.findMany({
        where: { productId },
        select: { rating: true },
      });
      
      const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
      const newRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;
      
      await prisma.product.update({
        where: { id: productId },
        data: {
          rating: newRating,
          reviewCount: allReviews.length,
        },
      });
      console.log('Product rating updated:', { 
        newRating, 
        reviewCount: allReviews.length 
      });
    } catch (ratingError: any) {
      console.error('Error updating product rating:', ratingError.message);
      // Continue even if rating update fails
    }
    
    console.log('========== REVIEW SUBMISSION COMPLETE ==========');
    return NextResponse.json({ 
      success: true,
      review: {
        id: review.id,
        rating: review.rating,
        title: review.title
      }
    });
  } catch (error: any) {
    console.error('Unhandled error in review submission:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a review
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('id');

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    // Find the review
    const review = await prisma.review.findUnique({
      where: { id: reviewId },
      include: { images: true },
    });

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Check if user owns the review or is an admin
    if (review.userId !== session.user.id && session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Not authorized to delete this review' },
        { status: 403 }
      );
    }

    // Delete images from ImageKit
    if (review.images && review.images.length > 0) {
      try {
        for (const image of review.images) {
          await imagekit.deleteFile(image.fileId);
        }
      } catch (error) {
        console.error('Failed to delete images from ImageKit:', error);
        // Continue with review deletion even if image deletion fails
      }
    }

    // Delete the review
    await prisma.review.delete({
      where: { id: reviewId },
    });

    // Update product rating and review count
    const allReviews = await prisma.review.findMany({
      where: { productId: review.productId },
      select: { rating: true },
    });

    const totalRating = allReviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
    const newRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: newRating,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete review' },
      { status: 500 }
    );
  }
} 