

import type { Pitch, Booking, Payout, OwnerBooking, User, Transaction, AdminWithdrawal, Activity, OwnerWithdrawal } from './types';
import { format } from 'date-fns';

// This is a new data structure to simulate a user credential store.
export let placeholderCredentials: User[] = [
    { id: 'USR001', name: 'Max Robinson', email: 'm@example.com', password: 'password', role: 'Player', registeredDate: '2024-07-15', status: 'Active', totalBookings: 4 },
    { id: 'USR002', name: 'Tunde Ojo', email: 'tunde.ojo@example.com', password: 'password', role: 'Owner', registeredDate: '2024-07-16', status: 'Active', pitchesListed: 0, subscriptionPlan: 'Starter' },
    { id: 'USR003', name: 'Ade Williams', email: 'ade.w@example.com', password: 'password', role: 'Player', registeredDate: '2024-07-18', status: 'Active', totalBookings: 1 },
    { id: 'USR004', name: 'Chioma Nwosu', email: 'chioma.n@example.com', password: 'password', role: 'Player', registeredDate: '2024-07-20', status: 'Active', totalBookings: 1 },
    { id: 'USR005', name: 'Lekki Goals Arena', email: 'contact@lekkigoals.com', password: 'password', role: 'Owner', registeredDate: '2024-07-21', status: 'Suspended', pitchesListed: 1, subscriptionPlan: 'Plus' },
    { id: 'USR006', name: 'Femi Adebayo', email: 'femi.a@example.com', password: 'password', role: 'Player', registeredDate: '2024-07-22', status: 'Active', totalBookings: 1 },
    { id: 'USR007', name: 'Aisha Bello', email: 'aisha.b@example.com', password: 'password', role: 'Player', registeredDate: '2024-07-25', status: 'Active', totalBookings: 1 },
];

export let placeholderActivities: Activity[] = [
    { id: '1', userName: 'Aisha Bello', userRole: 'Player', action: 'Logged In', timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString() },
    { id: '2', userName: 'Femi Adebayo', userRole: 'Player', action: 'Signed Up', timestamp: new Date(Date.now() - 1000 * 60 * 12).toISOString() },
    { id: '3', userName: 'Tunde Ojo', userRole: 'Owner', action: 'Logged In', timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() },
    { id: '4', userName: 'Max Robinson', userRole: 'Player', action: 'Logged In', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString() },
];


export function addUserCredential(user: User) {
    // Check if user already exists
    if (placeholderCredentials.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
        return; // Or throw an error
    }
    placeholderCredentials.unshift(user); // Add to the main user list as well
    // Also add a "Signed Up" activity
    placeholderActivities.unshift({
        id: `ACT-${Date.now()}`,
        userName: user.name,
        userRole: user.role as 'Player' | 'Owner',
        action: 'Signed Up',
        timestamp: new Date().toISOString(),
    });
}

// NOTE: This placeholderUsers variable is now deprecated and should not be used.
// It is maintained for any legacy components that might still reference it, but `placeholderCredentials` is the source of truth.
export let placeholderUsers: User[] = placeholderCredentials;

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);

const todayStr = format(today, 'yyyy-MM-dd');
const tomorrowStr = format(tomorrow, 'yyyy-MM-dd');

const standardSlots = [
    "9:00 AM - 10:00 AM", "10:00 AM - 11:00 AM", "11:00 AM - 12:00 PM",
    "12:00 PM - 1:00 PM", "1:00 PM - 2:00 PM", "2:00 PM - 3:00 PM",
    "3:00 PM - 4:00 PM", "4:00 PM - 5:00 PM", "5:00 PM - 6:00 PM",
    "6:00 PM - 7:00 PM", "7:00 PM - 8:00 PM", "8:00 PM - 9:00 PM"
];

export let placeholderPitches: Pitch[] = [];


export const placeholderBookings: Booking[] = [];

export const placeholderPayouts: Payout[] = [];

export const ownerBookings: OwnerBooking[] = [];


export const placeholderTransactions: Transaction[] = [];

export const placeholderAdminWithdrawals: AdminWithdrawal[] = [
    { id: 'WDL001', date: '2024-07-20', amount: 5000, bankName: 'GTBank', accountNumber: '****3456', status: 'Successful', ownerName: 'Admin' },
    { id: 'WDL002', date: '2024-07-10', amount: 2000, bankName: 'Kuda MFB', accountNumber: '****9876', status: 'Successful', ownerName: 'Admin' },
];

export let placeholderPayoutsToOwners: OwnerWithdrawal[] = [];


export function updatePitch(updatedPitch: Pitch): void {
    const index = placeholderPitches.findIndex(p => p.id === updatedPitch.id);
    if (index !== -1) {
        placeholderPitches[index] = updatedPitch;
    }
}

export function addPitch(newPitch: Pitch): void {
    placeholderPitches.unshift(newPitch);
}
