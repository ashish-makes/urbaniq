import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  try {
    console.log("Testing database connection...");
    
    // Try to perform a simple database operation
    // Check if we can connect to MongoDB by counting users
    const userCount = await prisma.user.count();
    
    return NextResponse.json({
      status: "success",
      message: "Database connection successful",
      userCount
    });
  } catch (error) {
    console.error("Database connection error:", error);
    return NextResponse.json(
      { 
        status: "error", 
        message: "Failed to connect to database",
        error: error instanceof Error ? error.message : String(error) 
      },
      { status: 500 }
    );
  }
} 