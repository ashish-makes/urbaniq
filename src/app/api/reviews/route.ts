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
  try {
    const session = await getServerSession(authOptions);
    
    // Check if user is authenticated
    if (!session || !session.user) {
      console.log('Unauthorized: No session or user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    console.log('Review submission data:', data);
    
    const { productId, rating, title, comment, images } = data;

    if (!productId || !rating || !title || !comment) {
      console.log('Missing required fields:', { productId, rating, title, comment });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      console.log('Product not found with ID:', productId);
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if the user has already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId,
        userId: session.user.id,
      },
      include: {
        images: true,
      },
    });

    let review;
    
    if (existingReview) {
      console.log('Updating existing review:', existingReview.id);
      
      // Delete old images if new ones are provided
      if (images && existingReview.images.length > 0) {
        try {
          // Delete existing images from ImageKit
          for (const image of existingReview.images) {
            await imagekit.deleteFile(image.fileId);
          }
          
          // Delete existing image records
          await prisma.reviewImage.deleteMany({
            where: {
              reviewId: existingReview.id
            }
          });
        } catch (error) {
          console.error('Failed to delete old review images:', error);
          // Continue with update even if image deletion fails
        }
      }
      
      // Update the existing review
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
        include: {
          images: true,
        },
      });
      
      console.log('Review updated successfully:', review.id);
    } else {
      console.log('Creating new review with:', {
        productId,
        userId: session.user.id,
        username: session.user.name || 'Anonymous',
        rating,
        title,
        comment,
        imagesCount: images ? images.length : 0
      });

      // Create a new review
      review = await prisma.review.create({
        data: {
          productId,
          userId: session.user.id,
          username: session.user.name || 'Anonymous',
          rating,
          title,
          comment,
          verified: true, // User is logged in so we consider this verified
          images: {
            create: images ? images.map((image: any) => ({
              url: image.url,
              fileId: image.fileId,
            })) : [],
          },
        },
        include: {
          images: true,
        },
      });

      console.log('Review created successfully:', review.id);
    }

    // Update product rating and review count
    const allReviews = await prisma.review.findMany({
      where: { productId },
      select: { rating: true },
    });

    const totalRating = allReviews.reduce((sum: number, review: { rating: number }) => sum + review.rating, 0);
    const newRating = totalRating / allReviews.length;

    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: newRating,
        reviewCount: allReviews.length,
      },
    });

    return NextResponse.json(review);
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create review' },
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