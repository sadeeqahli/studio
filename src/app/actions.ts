
'use server';

import { revalidatePath } from 'next/cache';
import {
  placeholderCredentials,
  placeholderPitches,
  placeholderBookings,
  placeholderPayouts,
  placeholderActivities,
  placeholderAdminWithdrawals,
  placeholderPayoutsToOwners,
  addUserCredential as originalAddUser,
  updatePitch as originalUpdatePitch,
  addPitch as originalAddPitch,
} from '@/lib/placeholder-data';
import type { Pitch, Booking, User, Activity, AdminWithdrawal, OwnerWithdrawal, Payout } from '@/lib/types';
import { notFound } from 'next/navigation';

// USER ACTIONS
export async function getUsers(): Promise<User[]> {
  return placeholderCredentials;
}

export async function getUserById(id: string): Promise<User | undefined> {
  return placeholderCredentials.find(u => u.id === id);
}

export async function addUser(user: User): Promise<void> {
    originalAddUser(user);
    revalidatePath('/admin/dashboard/users');
    revalidatePath('/(auth)/login');
}

export async function updateUser(updatedUser: User): Promise<void> {
    const index = placeholderCredentials.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
        placeholderCredentials[index] = updatedUser;
        revalidatePath('/admin/dashboard/users');
        revalidatePath(`/dashboard/profile`);
        revalidatePath(`/owner/dashboard/profile`);
    }
}

export async function deleteUser(userId: string): Promise<void> {
    const index = placeholderCredentials.findIndex(u => u.id === userId);
    if (index !== -1) {
        placeholderCredentials.splice(index, 1);
        revalidatePath('/admin/dashboard/users');
    }
}


// PITCH ACTIONS
export async function getPitches(): Promise<Pitch[]> {
  return placeholderPitches;
}

export async function getOwnerPitches(ownerId: string): Promise<Pitch[]> {
    return placeholderPitches.filter(p => p.ownerId === ownerId);
}

export async function getPitchById(id: string): Promise<Pitch | undefined> {
    const pitch = placeholderPitches.find(p => p.id === id);
    if (!pitch) {
        // Instead of throwing notFound immediately, return undefined.
        // The calling component can handle the "not found" state.
        return undefined;
    }
    return pitch;
}


export async function addPitch(pitchData: Pitch): Promise<void> {
    originalAddPitch(pitchData);
    revalidatePath('/owner/dashboard/pitches');
    revalidatePath('/admin/dashboard/pitches');
}

export async function updatePitch(pitchData: Pitch): Promise<void> {
    originalUpdatePitch(pitchData);
    revalidatePath('/owner/dashboard/pitches');
    revalidatePath('/admin/dashboard/pitches');
    revalidatePath(`/owner/dashboard/pitches/${pitchData.id}/availability`);
}


// BOOKING ACTIONS
export async function getBookings(): Promise<Booking[]> {
  return placeholderBookings;
}

export async function getBookingById(bookingId: string): Promise<Booking | undefined> {
    return placeholderBookings.find(b => b.id === bookingId);
}

export async function getBookingsByPitch(pitchName: string): Promise<Booking[]> {
    return placeholderBookings.filter(b => b.pitchName === pitchName);
}

export async function getBookingsByOwner(ownerId: string): Promise<Booking[]> {
    const ownerPitches = placeholderPitches.filter(p => p.ownerId === ownerId).map(p => p.name);
    return placeholderBookings.filter(b => ownerPitches.includes(b.pitchName));
}

export async function getBookingsByUser(userName: string): Promise<Booking[]> {
    return placeholderBookings.filter(b => b.customerName === userName);
}

export async function addBooking(booking: Booking): Promise<void> {
    placeholderBookings.unshift(booking);
    
    // For Online bookings, create a corresponding payout record
    if (booking.bookingType === 'Online') {
        const owner = await getUserByPitchName(booking.pitchName);
        const commissionRate = owner?.subscriptionPlan === 'Plus' ? 0.05 : owner?.subscriptionPlan === 'Pro' ? 0.03 : 0.10;
        const commissionAmount = booking.amount * commissionRate;
        const netPayout = booking.amount - commissionAmount;

        const newPayout: Payout = {
            bookingId: booking.id,
            customerName: booking.customerName!,
            grossAmount: booking.amount,
            commissionRate: commissionRate * 100,
            commissionFee: commissionAmount,
            netPayout: netPayout,
            date: new Date().toISOString().split('T')[0],
            status: 'Paid Out', // Or 'Pending' based on logic
            ownerName: owner!.name,
        };
        placeholderPayouts.unshift(newPayout);
    }

    revalidatePath('/dashboard/history');
    revalidatePath('/owner/dashboard/bookings');
    revalidatePath('/admin/dashboard/bookings');
    revalidatePath('/owner/dashboard');
    revalidatePath('/admin/dashboard');
    revalidatePath('/owner/dashboard/wallet');
}

// PAYOUT & REVENUE ACTIONS
export async function getPayouts(): Promise<Payout[]> {
  return placeholderPayouts;
}

export async function getPayoutsByOwner(ownerName: string): Promise<Payout[]> {
    return placeholderPayouts.filter(p => p.ownerName === ownerName);
}


// ACTIVITY ACTIONS
export async function getActivities(): Promise<Activity[]> {
  return placeholderActivities;
}

// WALLET/TRANSACTION ACTIONS (ADMIN)
export async function getAdminWithdrawals(): Promise<AdminWithdrawal[]> {
    return placeholderAdminWithdrawals;
}

export async function addAdminWithdrawal(withdrawal: AdminWithdrawal): Promise<void> {
    placeholderAdminWithdrawals.unshift(withdrawal);
    revalidatePath('/admin/dashboard/wallet');
}


// WALLET/TRANSACTION ACTIONS (OWNER)
export async function getOwnerWithdrawals(ownerName: string | 'all'): Promise<OwnerWithdrawal[]> {
    if (ownerName === 'all') {
        return placeholderPayoutsToOwners;
    }
    return placeholderPayoutsToOwners.filter(w => w.ownerName === ownerName);
}


export async function addOwnerWithdrawal(withdrawal: OwnerWithdrawal): Promise<void> {
    placeholderPayoutsToOwners.unshift(withdrawal);
    revalidatePath('/owner/dashboard/wallet');
}


// HELPER ACTIONS
export async function getUserByPitchName(pitchName: string): Promise<User | undefined> {
    const pitch = placeholderPitches.find(p => p.name === pitchName);
    if (!pitch || !pitch.ownerId) return undefined;
    return await getUserById(pitch.ownerId);
}
