import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { items, clearCart } = useCart();
  const { status } = useSession();

  const createCheckoutSession = async () => {
    if (status === 'unauthenticated') {
      // Redirect to login if user is not authenticated
      router.push('/login?redirect=checkout');
      return;
    }

    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          })),
        }),
      });

      const { url, error: responseError } = await response.json();

      if (responseError) {
        setError(responseError);
        setIsLoading(false);
        return;
      }

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
        // Note: we don't clear the cart here because the user might cancel checkout
        // The cart will be cleared when the user completes the payment and returns to success page
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setError('Failed to create checkout session');
      console.error('Checkout error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createCheckoutSession,
    isLoading,
    error,
  };
} 