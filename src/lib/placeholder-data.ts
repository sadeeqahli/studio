// =================================================================================
// DEPRECATION NOTICE: This file serves as a temporary, in-memory database.
// To move to a production environment, you should replace all functions using
// this data with calls to a real database like Firebase Firestore.
//
// The functions for manipulating this data have been moved to `/src/app/actions.ts`
// to better simulate a real client-server architecture. This file should eventually
// be removed entirely once a real database is connected.
// =================================================================================


import type { User, Pitch, Booking, Payout, Activity, AdminWithdrawal, OwnerWithdrawal, RewardTransaction, Referral } from './types';

// This is a new data structure to simulate a user credential store.
export let placeholderCredentials: User[] = [
  {
    id: 'ADMIN-001',
    name: 'Admin User',
    email: 'admin@9japitchconnect.com',
    password: 'admin123',
    role: 'Admin',
    registeredDate: '2024-01-01',
    status: 'Active',
    totalBookings: 0,
    rewardBalance: 0,
  },
  {
    id: 'user1',
    name: 'John Doe',
    email: 'johndoe@gmail.com',
    password: 'password123',
    role: 'Player',
    registeredDate: '2024-01-15',
    status: 'Active',
    totalBookings: 0,
    rewardBalance: 0,
    referralCode: 'JOHN001',
  },
  {
    id: 'user2',
    name: 'Jane Smith',
    email: 'janesmith@yahoo.com',
    password: 'password456',
    role: 'Player',
    registeredDate: '2024-02-10',
    status: 'Active',
    totalBookings: 0,
    rewardBalance: 0,
    referralCode: 'JANE002',
  },
  {
    id: 'owner1',
    name: 'Mike Johnson',
    email: 'mikejohnson@gmail.com',
    password: 'ownerpass123',
    role: 'Owner',
    registeredDate: '2024-01-20',
    status: 'Active',
    totalBookings: 0,
    pitchesListed: 2,
    subscriptionPlan: 'Plus',
    transactionPin: '1234',
    rewardBalance: 0,
  },
  {
    id: 'owner2',
    name: 'Sarah Wilson',
    email: 'sarahwilson@yahoo.com',
    password: 'ownerpass456',
    role: 'Owner',
    registeredDate: '2024-02-05',
    status: 'Active',
    totalBookings: 0,
    pitchesListed: 1,
    subscriptionPlan: 'Starter',
    transactionPin: '5678',
    rewardBalance: 0,
  },
];

export let placeholderActivities: Activity[] = [
    { id: '1', userName: 'Aisha Bello', userRole: 'Player', action: 'Logged In', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: '2', userName: 'Femi Adebayo', userRole: 'Player', action: 'Signed Up', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
    { id: '3', userName: 'Tunde Ojo', userRole: 'Owner', action: 'Logged In', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: '4', userName: 'Max Robinson', userRole: 'Player', action: 'Logged In', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
];

export let placeholderPitches: Pitch[] = [
];


export const placeholderBookings: Booking[] = [
];

export const placeholderPayouts: Payout[] = [
];


export const placeholderTransactions: Transaction[] = [
];

export const placeholderAdminWithdrawals: AdminWithdrawal[] = [
];

export function updatePitch(updatedPitch: Pitch): void {
    const index = placeholderPitches.findIndex(p => p.id === updatedPitch.id);
    if (index !== -1) {
        placeholderPitches[index] = updatedPitch;
    }
}

export let placeholderPayoutsToOwners: OwnerWithdrawal[] = [];

// Reward Transactions
export const placeholderRewardTransactions: RewardTransaction[] = [
  {
    id: 'RWD-001',
    userId: 'USR-001',
    type: 'Cashback',
    amount: 500,
    description: 'Cashback from booking BK-001',
    date: '2024-01-15',
    relatedBookingId: 'BK-001',
    status: 'Active'
  },
  {
    id: 'RWD-002',
    userId: 'USR-002',
    type: 'Referral Bonus',
    amount: 5000,
    description: 'Referral bonus for 10 successful referrals',
    date: '2024-01-10',
    status: 'Active'
  }
];

// Referrals
export const placeholderReferrals: Referral[] = [
  {
    id: 'REF-001',
    referrerId: 'USR-002',
    refereeId: 'USR-003',
    refereeEmail: 'referee@example.com',
    refereeName: 'John Doe',
    status: 'Completed',
    completedBookings: 1,
    bonusAwarded: false,
    dateReferred: '2024-01-01',
    dateCompleted: '2024-01-05'
  }
];

// Export the updatePitch function
export { updatePitch };