
import { NextResponse } from 'next/server';
import Flutterwave from 'flutterwave-node-v3';
import { addBooking } from '@/app/actions';
import type { PaymentVerificationResponse } from '@/lib/types';

// This is your backend endpoint. It's secure because it runs on the server.
export async function POST(request: Request) {
  
  // 1. Get the transaction ID and booking details from the frontend.
  const { transaction_id, bookingDetails } = await request.json();

  if (!transaction_id || !bookingDetails) {
    return NextResponse.json({ status: 'error', message: 'Missing transaction details' }, { status: 400 });
  }

  try {
    // 2. Initialize Flutterwave with your SECRET KEY from the .env file.
    //    This is secure because process.env is only available on the server.
    const flw = new Flutterwave(
      process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
      process.env.FLUTTERWAVE_SECRET_KEY!
    );

    // 3. Call Flutterwave's API to get the real status of the transaction.
    //    This is the most important step for security.
    const response = await flw.Transaction.verify({ id: String(transaction_id) });

    // 4. Check if the payment was successful and if the details match.
    if (
      response.status === 'success' &&
      response.data.amount === bookingDetails.amount &&
      response.data.currency === 'NGN'
    ) {
      // 5. Payment is verified and successful!
      //    Now, we can safely add the booking to our database.
      await addBooking(bookingDetails);
      
      const verificationResponse: PaymentVerificationResponse = {
        status: 'success',
        message: 'Payment verified and booking confirmed!',
        bookingId: bookingDetails.id,
      };

      return NextResponse.json(verificationResponse, { status: 200 });
    } else {
      // 6. If payment failed or details don't match, reject it.
      const verificationResponse: PaymentVerificationResponse = {
        status: 'error',
        message: 'Payment verification failed.',
      };
      return NextResponse.json(verificationResponse, { status: 400 });
    }
  } catch (error) {
    console.error("Verification Error:", error);
    const verificationResponse: PaymentVerificationResponse = {
      status: 'error',
      message: 'An error occurred during verification.',
    };
    return NextResponse.json(verificationResponse, { status: 500 });
  }
}
