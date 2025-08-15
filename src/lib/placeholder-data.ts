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
    // Admin account - keep this for platform management
    {
        id: 'USR-ADMIN-001',
        name: 'Platform Admin',
        email: 'admin@9japitchconnect.com',
        password: 'admin123',
        role: 'Admin',
        registeredDate: new Date().toISOString().split('T')[0],
        status: 'Active',
        action: 'System Account'
    }
    // All other placeholder data removed - real data will be populated when users sign up
];

export let placeholderActivities: Activity[] = [
];

export let placeholderPitches: Pitch[] = [
    // No placeholder pitches - will be populated when owners add their pitches
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
];

// Referrals
export const placeholderReferrals: Referral[] = [
];

// Export the updatePitch function
export { updatePitch };