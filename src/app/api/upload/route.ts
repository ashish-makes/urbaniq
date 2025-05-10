import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import ImageKit from 'imagekit';

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { fileName, folder, fileData } = body;

    if (!fileName || !fileData) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    console.log('Uploading image to ImageKit:', { fileName, folder: folder || 'default' });

    // Upload to ImageKit using server-side SDK
    const uploadResponse = await imagekit.upload({
      file: fileData, // base64 encoded file
      fileName: fileName,
      folder: folder || '/product-reviews',
    });

    console.log('ImageKit upload successful:', {
      fileId: uploadResponse.fileId,
      size: uploadResponse.size,
      url: uploadResponse.url
    });

    return NextResponse.json({
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      name: fileName
    });
  } catch (error: any) {
    console.error('Error uploading to ImageKit:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to upload image',
        details: error.stack
      }, 
      { status: 500 }
    );
  }
} 