import { NextRequest, NextResponse } from "next/server";
import stripe from "@/lib/stripe";

// Define the request body type
interface CheckoutRequest {
  items: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
  }[];
  successUrl?: string;
  cancelUrl?: string;
  customerEmail?: string;
  customerName?: string;
  userId?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json() as CheckoutRequest;
    
    if (!body || !body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    // Get the URLs for success and cancel
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const successUrl = body.successUrl || `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = body.cancelUrl || `${origin}/cart`;

    // Create metadata to pass customer info and products to the webhook
    const metadata = {
      customerEmail: body.customerEmail || '',
      customerName: body.customerName || '',
      userId: body.userId || '',
      items: JSON.stringify(body.items),
    };

    // Format line items for Stripe
    const lineItems = body.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: {
            productId: item.id,
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe uses cents
      },
      quantity: item.quantity,
    }));

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB'], // Add countries you ship to
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 500, currency: 'usd' }, // $5.00 shipping
            display_name: 'Standard Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 3 },
              maximum: { unit: 'business_day', value: 5 },
            },
          },
        },
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: { amount: 1500, currency: 'usd' }, // $15.00 shipping
            display_name: 'Express Shipping',
            delivery_estimate: {
              minimum: { unit: 'business_day', value: 1 },
              maximum: { unit: 'business_day', value: 2 },
            },
          },
        },
      ],
      allow_promotion_codes: true, // Enable promotion code field on checkout
      customer_email: body.customerEmail, // Pre-fill customer email if available
      metadata: metadata, // Store metadata for webhook processing
    });

    // Return the session ID to the client
    return NextResponse.json({ sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
} 