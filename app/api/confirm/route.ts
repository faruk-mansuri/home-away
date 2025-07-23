import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
import { redirect } from 'next/navigation';

import { NextResponse, type NextRequest } from 'next/server';
import db from '@/utils/db';

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const session_Id = searchParams.get('session_id') as string;

  try {
    const session = await stripe.checkout.sessions.retrieve(session_Id);
    const bookingId = session.metadata?.bookingId;

    if (session.status !== 'complete' && !bookingId) {
      throw new Error('Something went wrong with the payment session.');
    }
    await db.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: true,
      },
    });
  } catch (error) {
    console.log('Error retrieving session:', error);
    return NextResponse.json({
      status: 500,
      statusText: 'Internal Server Error',
    });
  }
  return redirect('/bookings');
};
