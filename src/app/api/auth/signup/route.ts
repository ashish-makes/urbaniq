import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcrypt";
import { z } from "zod";
import crypto from "crypto";
import { sendVerificationEmail } from "../../../../lib/email";

// Validation schema for a new signup
const signupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" }),
});

// Validation schema for resend request
const resendSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  resend: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    console.log('Signup/Verification API called');
    
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Request body parsed:', { 
        ...body, 
        password: body.password ? '***HIDDEN***' : undefined 
      });
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: "Invalid request format" },
        { status: 400 }
      );
    }
    
    // Check if this is a resend request
    if (body.resend) {
      return handleResendRequest(body);
    }
    
    // Regular signup flow
    // Validate request body
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation error:', validation.error.errors);
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name, email, password } = validation.data;
    console.log('Validation successful for:', email);

    // Check if email already exists
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log('User already exists:', email);
        return NextResponse.json(
          { error: "A user with this email already exists" },
          { status: 409 }
        );
      }
    } catch (findError) {
      console.error('Error checking for existing user:', findError);
      return NextResponse.json(
        { error: "Database error while checking user" },
        { status: 500 }
      );
    }

    // Hash the password
    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 10);
      console.log('Password hashed successfully');
    } catch (hashError) {
      console.error('Error hashing password:', hashError);
      return NextResponse.json(
        { error: "Error processing password" },
        { status: 500 }
      );
    }

    // Generate and send OTP
    return await generateAndSendOTP(email, name, hashedPassword);
    
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An error occurred during signup" },
      { status: 500 }
    );
  }
}

/**
 * Handles resend verification code requests
 */
async function handleResendRequest(body: any) {
  // Validate the resend request
  const validation = resendSchema.safeParse(body);
  if (!validation.success) {
    console.error('Resend validation error:', validation.error.errors);
    return NextResponse.json(
      { error: validation.error.errors[0].message },
      { status: 400 }
    );
  }

  const { email } = validation.data;
  console.log('Processing resend request for:', email);
  
  try {
    // Check if there's an existing verification process
    const userDataToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: `${email}:userData`,
        expires: {
          gt: new Date()
        }
      }
    });

    if (!userDataToken || !userDataToken.token) {
      console.log('No valid registration in progress for this email:', email);
      return NextResponse.json(
        { error: "No valid registration in progress for this email" },
        { status: 400 }
      );
    }

    // Parse the stored user data
    const userData = JSON.parse(userDataToken.token);
    
    // Delete old OTP if exists
    await prisma.verificationToken.deleteMany({
      where: {
        identifier: email,
      }
    });
    
    // Generate new OTP and send again
    return await generateAndSendOTP(
      email, 
      userData.name, 
      userData.password, 
      true
    );
    
  } catch (error) {
    console.error('Error processing resend request:', error);
    return NextResponse.json(
      { error: "Failed to resend verification code" },
      { status: 500 }
    );
  }
}

/**
 * Generates an OTP, stores it in the database, and sends it to the user
 */
async function generateAndSendOTP(
  email: string, 
  name: string, 
  hashedPassword: string,
  isResend = false
) {
  // Generate OTP (6-digit number)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
  
  try {
    // Store the verification data in the database
    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: otp,
        expires: otpExpiry
      }
    });
    
    console.log(`OTP generated${isResend ? ' (resend)' : ''} and stored for:`, email);
    
    // If not a resend, store user data temporarily
    if (!isResend) {
      // Store user data temporarily in another verification token
      const userData = JSON.stringify({
        name,
        email,
        password: hashedPassword,
      });
      
      // Create a user data token with the same expiry
      await prisma.verificationToken.create({
        data: {
          identifier: `${email}:userData`,
          token: userData,
          expires: otpExpiry
        }
      });
    }
    
    // Send OTP to user's email
    try {
      await sendVerificationEmail(email, name, otp);
      console.log(`Verification email${isResend ? ' (resend)' : ''} sent to:`, email);
    } catch (emailError) {
      console.error('Error sending verification email:', emailError);
      // Continue even if email sending fails - we'll handle it on the frontend
    }
    
    return NextResponse.json({
      success: true,
      message: `Verification code ${isResend ? 're-' : ''}sent to your email`,
      email: email
    });
    
  } catch (otpError) {
    console.error(`Error generating OTP${isResend ? ' (resend)' : ''}:`, otpError);
    return NextResponse.json(
      { error: "Error creating verification process" },
      { status: 500 }
    );
  }
} 