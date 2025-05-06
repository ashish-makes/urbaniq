import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function GET(req: NextRequest) {
  // Check database connection and tables
  try {
    // Log database collections
    const collections = await prisma.$runCommandRaw({
      listCollections: 1
    });
    
    // Count users
    const userCount = await prisma.user.count();
    
    // Count verification tokens
    const verificationTokenCount = await prisma.verificationToken.count();
    
    // Get a sample verification token (without exposing sensitive data)
    const sampleVerificationToken = await prisma.verificationToken.findFirst({
      select: {
        identifier: true,
        expires: true,
      }
    });
    
    return NextResponse.json({
      status: "ok",
      database: {
        connected: true,
        collections,
        stats: {
          users: userCount,
          verificationTokens: verificationTokenCount
        },
        sampleVerificationToken
      }
    });
  } catch (error) {
    console.error("Debug route error:", error);
    return NextResponse.json({
      status: "error",
      error: String(error)
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Create a test user directly with Prisma
    const hashedPassword = await bcrypt.hash("TestPassword123!", 10);
    
    const user = await prisma.user.create({
      data: {
        name: "Debug Test User",
        email: `debug_${Date.now()}@example.com`,
        password: hashedPassword,
        role: "USER",
        emailVerified: new Date()
      }
    });
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      status: "ok",
      message: "Test user created successfully",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Debug user creation error:", error);
    return NextResponse.json({
      status: "error",
      error: String(error)
    }, { status: 500 });
  }
} 