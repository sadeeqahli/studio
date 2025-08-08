

// =================================================================================
// DEPRECATION NOTICE: This file serves as a temporary, in-memory database.
// To move to a production environment, you should replace all functions using
// this data with calls to a real database like Firebase Firestore.
//
// The functions for manipulating this data have been moved to `/src/app/actions.ts`
// to better simulate a real client-server architecture. This file should eventually
// be removed entirely once a real database is connected.
// =================================================================================


import type { Pitch, Booking, Payout, OwnerBooking, User, Transaction, AdminWithdrawal, Activity, OwnerWithdrawal } from './types';

// This is a new data structure to simulate a user credential store.
export let placeholderCredentials: User[] = [
    { id: 'USR001', name: 'Max Robinson', email: 'm@example.com', password: 'password', role: 'Player', registeredDate: '2024-07-15', status: 'Active', totalBookings: 4 },
    { id: 'USR002', name: 'Tunde Ojo', email: 'tunde.ojo@example.com', password: 'password', role: 'Owner', registeredDate: '2024-07-16', status: 'Active', pitchesListed: 2, subscriptionPlan: 'Starter' },
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

export function addPitch(newPitch: Pitch): void {
    placeholderPitches.unshift(newPitch);
}
    
export let placeholderPayoutsToOwners: OwnerWithdrawal[] = [];

    