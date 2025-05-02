import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { z } from "zod";

// Validation schema
const verifyTokenSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
});

export async function POST(request: Request) {
  try {
    console.log('Verify Reset Token API called');
    
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Request body parsed:', body);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }
    
    // Validate request body
    const validation = verifyTokenSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation error:', validation.error.errors);
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { token, email } = validation.data;
    console.log('Validation successful for token verification');

    // Find the token in the database
    const resetToken = await prisma.verificationToken.findUnique({
      where: {
        identifier_token: {
          identifier: `reset:${email}`,
          token,
        },
      },
    });

    // Check if token exists and is not expired
    const valid = resetToken && resetToken.expires > new Date();
    
    if (!valid) {
      console.log('Invalid or expired token');
      return NextResponse.json({ valid: false });
    }

    console.log('Token verified successfully');
    return NextResponse.json({ valid: true });
    
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "An error occurred verifying the token" },
      { status: 500 }
    );
  }
} 