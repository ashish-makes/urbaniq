# Stripe Integration Setup

This guide will help you set up Stripe for the checkout functionality in your e-commerce application.

## Step 1: Create a Stripe Account

1. Sign up for a Stripe account at [stripe.com](https://stripe.com)
2. Complete the onboarding process

## Step 2: Get Your API Keys

1. In your Stripe Dashboard, go to Developers > API keys
2. You'll need two keys:
   - **Publishable Key**: Starts with `pk_test_` (for test mode) or `pk_live_` (for production)
   - **Secret Key**: Starts with `sk_test_` (for test mode) or `sk_live_` (for production)

## Step 3: Set Up Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```
# Stripe API Keys
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here

# Your site URL (used for Stripe webhook setup)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Replace the placeholder values with your actual Stripe API keys.

## Step 4: Test the Integration

1. For testing purposes, Stripe provides test card information:
   - Card number: `4242 4242 4242 4242`
   - Expiration date: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

2. To test different scenarios like declined payments, use these cards:
   - Declined: `4000 0000 0000 0002`
   - Insufficient funds: `4000 0000 0000 9995`

## Step 5: Going to Production

When you're ready to go live:

1. Complete your Stripe account verification 
2. Switch your API keys from test to live
3. Update your environment variables with live keys
4. Test thoroughly with real cards

## Additional Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Stripe API Reference](https://stripe.com/docs/api)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) 