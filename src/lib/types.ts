

export type Pitch = {
  id: string;
  name: string;
  location: string;
  price: number; // in Naira
  amenities: string[];
  imageUrl: string;
  imageHint: string;
  allDaySlots: string[]; // Master list of all possible slots for a pitch
  manuallyBlockedSlots?: { [date: string]: string[] }; // For owners to block slots
  status: 'Active' | 'Unlisted';
  ownerId: string;
};

export type Booking = {
    id: string;
    pitchName: string;
    date: string;
    time: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Cancelled';
    customerName: string;
    bookingType: 'Online' | 'Offline'; // To distinguish between player and owner bookings
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
    ownerName: string;
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
    password?: string;
    role: 'Player' | 'Owner' | 'Admin';
    registeredDate: string;
    status: 'Active' | 'Suspended';
    totalBookings?: number;
    pitchesListed?: number;
    subscriptionPlan?: 'Starter' | 'Plus' | 'Pro';
}

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number; // Positive for credit, negative for debit
  type: 'Credit' | 'Withdrawal';
  bookingId?: string;
}

export type WithdrawalReceipt = {
    id:string;
    date: string;
    amount: number;
    bankName: string;
    accountNumber: string;
    accountName: string;
    status: 'Successful' | 'Pending' | 'Failed';
};

export type AdminWithdrawal = {
    id: string;
    date: string;
    amount: number;
    bankName: string;
    accountNumber: string;
    status: 'Successful' | 'Pending' | 'Failed';
    ownerName: string; // To specify who made the withdrawal (Admin or Owner Name)
};

export type OwnerWithdrawal = {
    id: string;
    date: string;
    amount: number;
    status: 'Successful' | 'Pending' | 'Failed';
    ownerName: string;
};

export type Activity = {
    id: string;
    userName: string;
    userRole: 'Player' | 'Owner';
    action: 'Logged In' | 'Signed Up';
    timestamp: string;
};
