import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { z } from "zod";

// Validation schema
const verifySchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
});

export async function POST(request: Request) {
  try {
    console.log('Verify OTP API called');
    
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
    const validation = verifySchema.safeParse(body);
    if (!validation.success) {
      console.error('Validation error:', validation.error.errors);
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { email, otp } = validation.data;
    console.log('Validation successful for:', email);

    try {
      // Check if OTP exists and is valid
      const verificationToken = await prisma.verificationToken.findFirst({
        where: {
          identifier: email,
          token: otp,
          expires: {
            gt: new Date()
          }
        }
      });

      if (!verificationToken) {
        console.log('Invalid or expired OTP for:', email);
        return NextResponse.json(
          { error: "Invalid or expired verification code" },
          { status: 400 }
        );
      }

      // Get the stored user data
      const userDataToken = await prisma.verificationToken.findFirst({
        where: {
          identifier: `${email}:userData`,
          expires: {
            gt: new Date()
          }
        }
      });

      if (!userDataToken || !userDataToken.token) {
        console.log('User data not found for:', email);
        return NextResponse.json(
          { error: "Registration data not found or expired" },
          { status: 400 }
        );
      }

      // Parse the user data
      const userData = JSON.parse(userDataToken.token);
      
      // Create the user
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: "USER",
          emailVerified: new Date(),
        },
      });

      console.log('User created successfully after verification:', user.id);
      
      // Clean up verification tokens
      await prisma.verificationToken.deleteMany({
        where: {
          OR: [
            { identifier: email },
            { identifier: `${email}:userData` }
          ]
        }
      });
      
      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return NextResponse.json({
        success: true,
        message: "Email verified and account created successfully",
        user: userWithoutPassword
      });
    } catch (verifyError: any) {
      console.error('Error verifying OTP:', verifyError);
      
      // Check for specific Prisma errors
      if (verifyError.code === 'P2002') {
        return NextResponse.json(
          { error: "This email is already in use" },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: "Error during verification process" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "An error occurred during verification" },
      { status: 500 }
    );
  }
} 