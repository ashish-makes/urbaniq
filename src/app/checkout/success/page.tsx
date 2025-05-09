'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { CheckCircle, ArrowRight, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';

interface OrderData {
  orderNumber: string;
  total: number;
}

// Inner component that safely uses useSearchParams
function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [orderStatus, setOrderStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const { items, subtotal, clearCart } = useCart();
  const { data: session } = useSession();
  
  // Use a ref to track if we've already processed the checkout to prevent multiple calls
  const checkoutProcessed = useRef(false);
  
  useEffect(() => {
    // Only process the checkout once
    if (sessionId && !checkoutProcessed.current && items.length > 0) {
      // Check if this session has already been processed using sessionStorage
      const processedSessions = JSON.parse(sessionStorage.getItem('processedCheckoutSessions') || '[]');
      if (processedSessions.includes(sessionId)) {
        console.log("Session already processed, skipping:", sessionId);
        checkoutProcessed.current = true;
        return;
      }
      
      const processCheckout = async () => {
        try {
          // Mark as processed immediately to prevent race conditions
          checkoutProcessed.current = true;
          
          // Add to processed sessions in sessionStorage
          processedSessions.push(sessionId);
          sessionStorage.setItem('processedCheckoutSessions', JSON.stringify(processedSessions));
          
          console.log("Processing checkout for session:", sessionId);
          
          // First, retrieve the Stripe session details
          const stripeSessionResponse = await fetch(`/api/checkout/session?sessionId=${sessionId}`);
          
          if (!stripeSessionResponse.ok) {
            throw new Error('Failed to retrieve checkout session');
          }
          
          const sessionData = await stripeSessionResponse.json();
          console.log("Retrieved session data:", sessionData);
          
          // Get shipping and customer information from the session
          const { shipping, customer, customer_details, amount_total, payment_intent } = sessionData.session;
          
          // Ensure we have the necessary data
          if (!customer_details && !customer) {
            throw new Error('Missing customer information in Stripe session');
          }
          
          // Create a default shipping address if one isn't provided
          const shippingAddress = shipping?.address || {
            line1: customer_details?.address?.line1 || '',
            line2: customer_details?.address?.line2 || '',
            city: customer_details?.address?.city || '',
            state: customer_details?.address?.state || '',
            postal_code: customer_details?.address?.postal_code || '',
            country: customer_details?.address?.country || 'US'
          };
          
          // Extract payment intent ID (either from string or object)
          const paymentIntentId = typeof payment_intent === 'string' 
            ? payment_intent 
            : payment_intent?.id;
          
          // Prepare order data
          const orderData = {
            customerEmail: customer?.email || customer_details?.email,
            customerName: customer?.name || customer_details?.name,
            userId: session?.user?.id,
            items: items.map((item: {
              id: string;
              productId: string;
              name: string;
              price: number;
              quantity: number;
              image: string;
            }) => ({
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              image: item.image
            })),
            shipping: {
              address: shippingAddress,
              name: shipping?.name || customer_details?.name || '',
            },
            payment: {
              method: 'stripe',
              id: paymentIntentId
            },
            subtotal: subtotal,
            tax: (amount_total / 100) * 0.07, // Calculate tax from the final amount
            shippingCost: shipping?.cost || 5.00,
            total: amount_total / 100, // Convert from cents to dollars
            currency: 'USD'
          };
          
          // Create order via API
          console.log("Sending order data:", orderData);
          try {
            const createOrderResponse = await fetch('/api/orders', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(orderData)
            });
            
            if (!createOrderResponse.ok) {
              const errorData = await createOrderResponse.json().catch(() => ({}));
              console.error("Order creation failed:", createOrderResponse.status, errorData);
              throw new Error(`Failed to create order: ${errorData.error || createOrderResponse.statusText}`);
            }
            
            const createdOrder = await createOrderResponse.json();
            console.log("Order created:", createdOrder);
            
            // Store order data for display
            setOrderData({
              orderNumber: createdOrder.order.orderNumber,
              total: createdOrder.order.total
            });
            
            // Clear the cart
            clearCart();
            
            // Set success status
            setOrderStatus('success');
          } catch (orderError) {
            console.error("Error creating order:", orderError);
            throw orderError;
          }
        } catch (error) {
          console.error("Error processing checkout:", error);
          setOrderStatus('error');
        }
      };
      
      processCheckout();
    } else if (sessionId && !items.length) {
      // If we have a session ID but no items in cart, assume it's already been processed
      setOrderStatus('success');
    } else if (!sessionId) {
      // No session ID means error
      setOrderStatus('error');
    }
  }, [sessionId, items, subtotal, clearCart, session]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          {orderStatus === 'loading' ? (
            <div>
              <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <h1 className="text-2xl font-bold mb-2">Processing your order...</h1>
              <p className="text-gray-500">Just a moment while we confirm your payment</p>
            </div>
          ) : orderStatus === 'success' ? (
            <div>
              <div className="mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={40} className="text-green-600" />
                </div>
                <h1 className="text-3xl font-bold mb-3">Order Confirmed!</h1>
                <p className="text-gray-600 mb-2">
                  Thank you for your purchase. We've received your order and we'll process it right away.
                </p>
                <p className="text-gray-500 text-sm">
                  Order reference: <span className="font-medium">{orderData?.orderNumber || sessionId?.substring(0, 8) || 'N/A'}</span>
                </p>
                {orderData?.total && (
                  <p className="text-gray-500 text-sm mt-1">
                    Total: <span className="font-medium">${orderData.total.toFixed(2)}</span>
                  </p>
                )}
              </div>
              
              <div className="bg-gray-50 p-6 rounded-xl mb-10">
                <h2 className="font-semibold mb-2">What happens next?</h2>
                <p className="text-gray-600 text-sm mb-4">
                  You'll receive an email confirmation shortly. Once your order ships, we'll send you a tracking number.
                </p>
                <div className="text-xs text-gray-500 flex justify-center gap-4">
                  <div>
                    <span className="inline-block bg-gray-200 w-6 h-6 rounded-full text-center line-height-6 mb-1">1</span>
                    <p>Order Processing</p>
                  </div>
                  <div className="border-t-2 border-dashed border-gray-300 w-4 mt-3"></div>
                  <div>
                    <span className="inline-block bg-gray-200 w-6 h-6 rounded-full text-center line-height-6 mb-1">2</span>
                    <p>Order Shipped</p>
                  </div>
                  <div className="border-t-2 border-dashed border-gray-300 w-4 mt-3"></div>
                  <div>
                    <span className="inline-block bg-gray-200 w-6 h-6 rounded-full text-center line-height-6 mb-1">3</span>
                    <p>Delivery</p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/products">
                  <div className="group inline-flex items-center justify-center py-2 px-6 rounded-full bg-black text-white hover:bg-black/90 transition-all font-medium">
                    <ShoppingBag size={16} className="mr-2" />
                    <span>Continue Shopping</span>
                  </div>
                </Link>
                <Link href="/user/dashboard">
                  <div className="group inline-flex items-center justify-center py-2 px-6 rounded-full bg-white text-black border border-gray-200 hover:bg-gray-50 transition-all font-medium">
                    <span className="mr-1">View My Orders</span>
                    <ArrowRight size={16} />
                  </div>
                </Link>
              </div>
            </div>
          ) : (
            <div>
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h1 className="text-2xl font-bold mb-3">Something went wrong</h1>
              <p className="text-gray-600 mb-8">
                We couldn't process your order. Please try again or contact our support team.
              </p>
              <Link href="/cart">
                <div className="group inline-flex items-center justify-center py-2 px-6 rounded-full bg-black text-white hover:bg-black/90 transition-all font-medium">
                  <span>Return to Cart</span>
                </div>
              </Link>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Main page component with Suspense boundary
export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 py-16 px-4">
          <div className="max-w-lg mx-auto text-center">
            <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
            <h1 className="text-2xl font-bold mb-2">Loading order details...</h1>
            <p className="text-gray-500">Please wait while we retrieve your order information</p>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <CheckoutSuccessContent />
    </Suspense>
  );
} 