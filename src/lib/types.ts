export type Pitch = {
  id: string;
  ownerId: string;
  name: string;
  location: string;
  price: number; // in Naira
  amenities: string[];
  imageUrl: string;
  imageHint: string;
  slotInterval: number; // in minutes
  status: 'Active' | 'Unlisted';
  manuallyBlockedSlots: Record<string, string[]>; // e.g. { '2024-08-15': ['10:00 AM', '11:00 AM'] }
};

export type Booking = {
    id: string;
    pitchName: string;
    date: string; // YYYY-MM-DD
    time: string; // e.g. "09:00 AM, 10:00 AM"
    amount: number;
    status: 'Paid' | 'Pending' | 'Cancelled';
    customerName: string;
    bookingType: 'Online' | 'Offline';
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
};

export type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    role: 'Player' | 'Owner' | 'Admin';
    registeredDate: string;
    status: 'Active' | 'Pending' | 'Inactive';
    pitchesListed?: number; // Only for owners
    action?: string;
    subscriptionPlan?: string;
    rewardBalance?: number; // Only for players
    referralCode?: string; // Only for players
    bvn?: string; // Only for owners
    nin?: string; // Only for owners
    addressProofFileName?: string; // Only for owners
    verificationStatus?: 'Pending' | 'Verified' | 'Rejected'; // Only for owners
    trialStartDate?: string; // Only for owners
    trialEndDate?: string; // Only for owners
    isInTrial?: boolean; // Only for owners
};

export type Transaction = {
  id: string;
  date: string;
  description: string;
  amount: number; // Positive for credit, negative for debit
  type: 'Credit' | 'Withdrawal';
  bookingId?: string;
};

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

export type RewardTransaction = {
    id: string;
    userId: string;
    type: 'Cashback' | 'Referral Bonus' | 'Used';
    amount: number;
    description: string;
    date: string;
    relatedBookingId?: string;
    status: 'Active' | 'Used' | 'Expired';
};

export type Referral = {
    id: string;
    referrerId: string;
    refereeId: string;
    refereeEmail: string;
    refereeName: string;
    status: 'Pending' | 'Active' | 'Completed';
    completedBookings: number;
    bonusAwarded: boolean;
    dateReferred: string;
    dateCompleted?: string;
};