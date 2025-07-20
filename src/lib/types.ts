
export type Pitch = {
  id: string;
  name: string;
  location: string;
  price: number; // in Naira
  amenities: string[];
  imageUrl: string;
  imageHint: string;
  availableSlots: string[];
};

export type Booking = {
    id: string;
    pitchName: string;
    date: string;
    time: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Cancelled';
};

// Extended type for receipt page
export type ReceiptBooking = Booking & {
  pitchLocation: string;
  userName: string;
  paymentMethod: string;
};

export type Payout = {
    bookingId: string;
    customerName: string;
    grossAmount: number;
    commissionRate: number;
    commissionFee: number;
    netPayout: number;
    date: string;
    status: 'Paid Out' | 'Pending';
};
