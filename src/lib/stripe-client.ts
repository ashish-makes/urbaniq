import { loadStripe } from '@stripe/stripe-js';

// Load the Stripe.js script and initialize with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export default stripePromise; 