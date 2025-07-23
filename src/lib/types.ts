
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

export type OwnerBooking = {
  id: string;
  customer: string;
  pitch: string;
  date: string;
  time: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Cancelled';
}

export type User = {
    id: string;
    name: string;
    email: string;
    role: 'Player' | 'Owner' | 'Admin';
    registeredDate: string;
    status: 'Active' | 'Suspended';
    totalBookings?: number;
    pitchesListed?: number;
}

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number; // Positive for credit, negative for debit
  type: 'Credit' | 'Commission' | 'Withdrawal' | 'Deposit';
}

    