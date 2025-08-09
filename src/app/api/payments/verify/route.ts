
import { NextResponse } from 'next/server';
import { addBooking } from '@/app/actions';

// This endpoint is no longer used for Flutterwave verification,
// but could be adapted for other server-side tasks in the future.
// For now, it will simply confirm the booking passed from the client.

export async function POST(request: Request) {
  
  try {
    const { bookingDetails } = await request.json();

    if (!bookingDetails) {
        return NextResponse.json({ status: 'error', message: 'Missing booking details' }, { status: 400 });
    }

    // In a real-world scenario with bank transfers, you would have a webhook from your payment
    // provider that calls an endpoint like this to confirm payment has been received.
    // For this simulation, we trust the client's confirmation and create the booking directly.
    
    await addBooking(bookingDetails);
    
    return NextResponse.json({
        status: 'success',
        message: 'Booking confirmed!',
        bookingId: bookingDetails.id,
    }, { status: 200 });

  } catch (error) {
    console.error("Booking Confirmation Error:", error);
    return NextResponse.json({
        status: 'error',
        message: 'An error occurred during booking confirmation.',
    }, { status: 500 });
  }
}
