'use client';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

// Separate component that uses useSearchParams
const CheckoutContent = () => {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');

  const fetchClientSecret = async () => {
    const response = await axios.post('/api/payment', { bookingId });
    return response.data.clientSecret;
  };

  const options = { fetchClientSecret };

  return (
    <EmbeddedCheckoutProvider stripe={stripePromise} options={options}>
      <EmbeddedCheckout />
    </EmbeddedCheckoutProvider>
  );
};

// Main page component with Suspense
const CheckoutPage = () => {
  return (
    <div id='checkout'>
      <Suspense fallback={null}>
        <CheckoutContent />
      </Suspense>
    </div>
  );
};

export default CheckoutPage;
