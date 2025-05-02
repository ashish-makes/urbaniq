import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { z } from "zod";
import { randomBytes } from "crypto";
import { sendPasswordResetEmail } from "../../../../lib/email";

// Validation schema
const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export async function POST(request: Request) {
  try {
    console.log('Forgot Password API called');
    
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
    const validation = forgotPasswordSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation error:', validation.error.errors);
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email } = validation.data;
    console.log('Validation successful for:', email);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Don't reveal if the user exists or not for security reasons
    // We'll return success regardless but only send email if user exists
    if (!user) {
      console.log('User not found, but not revealing this information');
      // Return success to prevent email enumeration attacks
      return NextResponse.json({
        success: true,
        message: "If your email is registered, you will receive password reset instructions"
      });
    }

    // Generate token
    const token = randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in the database
    try {
      // First, delete any existing reset tokens for this user
      await prisma.verificationToken.deleteMany({
        where: {
          identifier: `reset:${email}`
        }
      });
      
      // Create new reset token
      await prisma.verificationToken.create({
        data: {
          identifier: `reset:${email}`,
          token,
          expires
        }
      });
      
      console.log('Password reset token created for:', email);
    } catch (dbError) {
      console.error('Database error storing reset token:', dbError);
      return NextResponse.json(
        { error: "Error creating password reset token" },
        { status: 500 }
      );
    }

    // Send email with reset link
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    
    try {
      await sendPasswordResetEmail(email, user.name || 'User', resetLink);
      console.log('Password reset email sent to:', email);
    } catch (emailError) {
      console.error('Error sending password reset email:', emailError);
      // Continue even if email sending fails - we'll just return success
    }

    return NextResponse.json({
      success: true,
      message: "Password reset instructions sent to your email"
    });
    
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "An error occurred processing your request" },
      { status: 500 }
    );
  }
} 