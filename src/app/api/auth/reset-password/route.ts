import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";

// Validation schema
const resetPasswordSchema = z.object({
  token: z.string().min(1, { message: "Token is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

export async function POST(request: Request) {
  try {
    console.log('Reset Password API called');
    
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Request body parsed:', { ...body, password: '[REDACTED]' });
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }
    
    // Validate request body
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation error:', validation.error.errors);
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { token, email, password } = validation.data;
    console.log('Validation successful for password reset');

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
    if (!resetToken || resetToken.expires <= new Date()) {
      console.log('Invalid or expired token');
      return NextResponse.json(
        { error: "This password reset link is invalid or has expired" },
        { status: 400 }
      );
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('User not found');
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    // Delete the reset token to prevent reuse
    await prisma.verificationToken.delete({
      where: {
        identifier_token: {
          identifier: `reset:${email}`,
          token,
        },
      },
    });

    console.log('Password reset successful for:', email);
    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully"
    });
    
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json(
      { error: "An error occurred resetting your password" },
      { status: 500 }
    );
  }
} 