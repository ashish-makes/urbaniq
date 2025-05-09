import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";

export async function GET(request: NextRequest) {
  try {
    // Get session ID from query parameter
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    
    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing session ID parameter" },
        { status: 400 }
      );
    }
    
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['line_items', 'payment_intent', 'customer']
    });
    
    // Return the session to the client
    return NextResponse.json({ success: true, session });
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve checkout session' },
      { status: 500 }
    );
  }
} 