
'use server';

// =================================================================================
// START: FIRESTORE INTEGRATION GUIDE
// =================================================================================
//
// To connect to Firestore, you would first initialize the Firebase Admin SDK.
// This is typically done in a separate configuration file (e.g., /src/lib/firebase.ts).
//
// import { initializeApp, getApps } from 'firebase/app';
// import { getFirestore } from 'firebase/firestore';
//
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// };
//
// // Initialize Firebase
// let app;
// if (!getApps().length) {
//   app = initializeApp(firebaseConfig);
// }
//
// const db = getFirestore(app);
//
// After initialization, you would import `db` here and replace the placeholder
// array manipulations with Firestore's `getDoc`, `getDocs`, `addDoc`, etc.
//
// =================================================================================

import { revalidatePath } from 'next/cache';
import {
  placeholderCredentials,
  placeholderPitches,
  placeholderBookings,
  placeholderPayouts,
  placeholderActivities,
  placeholderAdminWithdrawals,
  placeholderPayoutsToOwners,
  updatePitch as originalUpdatePitch,
} from '@/lib/placeholder-data';
import type { Pitch, Booking, User, Activity, AdminWithdrawal, OwnerWithdrawal, Payout, ReceiptBooking } from '@/lib/types';

// USER ACTIONS
export async function getUsers(): Promise<User[]> {
  // FIRESTORE: Replace with a call like `getDocs(collection(db, 'users'))`
  // IMPORTANT FIX: Using structuredClone or a simple return to avoid stripping undefined fields.
  // JSON.parse(JSON.stringify(...)) was causing crashes by removing optional properties.
  return structuredClone(placeholderCredentials);
}

export async function getUserById(id: string): Promise<User | undefined> {
  // FIRESTORE: Replace with `getDoc(doc(db, 'users', id))`
  const users = await getUsers();
  return users.find(u => u.id === id);
}

export async function addUser(user: User & { action?: 'Logged In' | 'Signed Up' }): Promise<void> {
    const newUser: User = {
        id: user.id,
        name: user.name,
        email: user.email,
        password: user.password,
        role: user.role,
        registeredDate: user.registeredDate,
        status: user.status,
        totalBookings: user.totalBookings,
        pitchesListed: user.pitchesListed,
        subscriptionPlan: user.subscriptionPlan,
        transactionPin: user.transactionPin,
    };

    if (user.action === 'Signed Up') {
        const userExists = placeholderCredentials.some(
            u => u.email.toLowerCase() === newUser.email.toLowerCase() && u.role === newUser.role
        );
        if (!userExists) {
            placeholderCredentials.push(newUser);
            placeholderActivities.unshift({
                id: `ACT-${Date.now()}`,
                userName: newUser.name,
                userRole: newUser.role as 'Player' | 'Owner',
                action: 'Signed Up',
                timestamp: new Date().toISOString(),
            });
        }
    } else if (user.action === 'Logged In') {
        placeholderActivities.unshift({
            id: `ACT-${Date.now()}`,
            userName: newUser.name,
            userRole: newUser.role as 'Player' | 'Owner',
            action: 'Logged In',
            timestamp: new Date().toISOString(),
        });
    } else {
        // Fallback for just adding a user without a specific action (e.g. from tests or seeds)
        const userExists = placeholderCredentials.some(u => u.id === newUser.id);
        if (!userExists) {
             placeholderCredentials.push(newUser);
        }
    }
    
    // Revalidate paths to ensure the UI updates.
    revalidatePath('/admin/dashboard/users');
    revalidatePath('/(auth)/login');
}


export async function updateUser(updatedUser: User): Promise<void> {
    // FIRESTORE: Replace with `updateDoc(doc(db, 'users', updatedUser.id), updatedUser)`
    const index = placeholderCredentials.findIndex(u => u.id === updatedUser.id);
    if (index !== -1) {
        placeholderCredentials[index] = updatedUser;
        revalidatePath('/admin/dashboard/users');
        revalidatePath(`/dashboard/profile`);
        revalidatePath(`/owner/dashboard/profile`);
    }
}

export async function deleteUser(userId: string): Promise<void> {
    // FIRESTORE: Replace with `deleteDoc(doc(db, 'users', userId))`
    const index = placeholderCredentials.findIndex(u => u.id === userId);
    if (index !== -1) {
        placeholderCredentials.splice(index, 1);
        revalidatePath('/admin/dashboard/users');
    }
}


// PITCH ACTIONS
export async function getPitches(): Promise<Pitch[]> {
  // FIRESTORE: Replace with `getDocs(collection(db, 'pitches'))`
  return structuredClone(placeholderPitches);
}

export async function getOwnerPitches(ownerId: string): Promise<Pitch[]> {
    // FIRESTORE: Replace with a query: `getDocs(query(collection(db, 'pitches'), where('ownerId', '==', ownerId)))`
    const allPitches = await getPitches();
    return allPitches.filter(p => p.ownerId === ownerId);
}

export async function getPitchById(id: string): Promise<Pitch | undefined> {
    // FIRESTORE: Replace with `getDoc(doc(db, 'pitches', id))`
    const allPitches = await getPitches();
    const pitch = allPitches.find(p => p.id === id);
    if (!pitch) {
        return undefined;
    }
    return pitch;
}


export async function addPitch(pitchData: Pitch): Promise<void> {
    // FIRESTORE: Replace with `setDoc(doc(db, 'pitches', pitchData.id), pitchData)`
    placeholderPitches.unshift(pitchData);
    revalidatePath('/owner/dashboard/pitches', 'layout');
    revalidatePath('/admin/dashboard/pitches', 'layout');
    revalidatePath('/dashboard', 'layout');
}

export async function updatePitch(pitchData: Pitch): Promise<void> {
    // FIRESTORE: Replace with `updateDoc(doc(db, 'pitches', pitchData.id), pitchData)`
    originalUpdatePitch(pitchData);
    revalidatePath('/owner/dashboard/pitches');
    revalidatePath('/admin/dashboard/pitches');
    revalidatePath(`/owner/dashboard/pitches/${pitchData.id}/availability`);
}


// BOOKING ACTIONS
export async function getBookings(): Promise<Booking[]> {
  // FIRESTORE: Replace with `getDocs(collection(db, 'bookings'))`
  return structuredClone(placeholderBookings);
}

export async function getBookingById(bookingId: string): Promise<Booking | undefined> {
    // FIRESTORE: Replace with `getDoc(doc(db, 'bookings', bookingId))`
    const bookings = await getBookings();
    return bookings.find(b => b.id === bookingId);
}

export async function getReceiptBookingById(bookingId: string): Promise<ReceiptBooking | null> {
    // FIRESTORE: In a real DB, this would be a single query, possibly with a join.
    const booking = await getBookingById(bookingId);
    if (!booking) {
        return null;
    }

    const allPitches = await getPitches();
    const pitch = allPitches.find(p => p.name === booking.pitchName);
    const paymentMethod = booking.bookingType === 'Online' ? 'Bank Transfer' : 'Offline/Direct';

    return {
        ...booking,
        pitchLocation: pitch?.location || 'N/A',
        userName: booking.customerName,
        paymentMethod: paymentMethod,
    };
}

export async function getBookingsByPitch(pitchName: string): Promise<Booking[]> {
    // FIRESTORE: Replace with a query: `getDocs(query(collection(db, 'bookings'), where('pitchName', '==', pitchName)))`
    const bookings = await getBookings();
    return bookings.filter(b => b.pitchName === pitchName);
}

export async function getBookingsByOwner(ownerId: string): Promise<Booking[]> {
    const ownerPitches = await getOwnerPitches(ownerId);
    const ownerPitchNames = ownerPitches.map(p => p.name);
    // FIRESTORE: This would be a more complex query, potentially needing to fetch owner pitches first.
    const allBookings = await getBookings();
    return allBookings.filter(b => ownerPitchNames.includes(b.pitchName));
}

export async function getBookingsByUser(userName: string): Promise<Booking[]> {
    // FIRESTORE: Replace with a query
    const allBookings = await getBookings();
    return allBookings.filter(b => b.customerName === userName);
}

export async function addBooking(booking: Booking): Promise<void> {
    // FIRESTORE: Replace with `setDoc(doc(db, 'bookings', booking.id), booking)`
    placeholderBookings.unshift(booking);
    
    // This logic would likely move into a Cloud Function triggered by a new booking document
    // to ensure it's secure and reliable.
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
            status: 'Paid Out',
            ownerName: owner!.name,
        };
        // FIRESTORE: Replace with `addDoc(collection(db, 'payouts'), newPayout)`
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
  // FIRESTORE: Replace with `getDocs(collection(db, 'payouts'))`
  return structuredClone(placeholderPayouts);
}

export async function getPayoutsByOwner(ownerName: string): Promise<Payout[]> {
    // FIRESTORE: Replace with a query
    const allPayouts = await getPayouts();
    return allPayouts.filter(p => p.ownerName === ownerName);
}


// ACTIVITY ACTIONS
export async function getActivities(): Promise<Activity[]> {
  // FIRESTORE: Replace with a query on an 'activities' collection
  return structuredClone(placeholderActivities);
}

// WALLET/TRANSACTION ACTIONS (ADMIN)
export async function getAdminWithdrawals(): Promise<AdminWithdrawal[]> {
    // FIRESTORE: Replace with `getDocs`
    return structuredClone(placeholderAdminWithdrawals);
}

export async function addAdminWithdrawal(withdrawal: AdminWithdrawal): Promise<void> {
    // FIRESTORE: Replace with `addDoc`
    placeholderAdminWithdrawals.unshift(withdrawal);
    revalidatePath('/admin/dashboard/wallet');
}


// WALLET/TRANSACTION ACTIONS (OWNER)
export async function getOwnerWithdrawals(ownerName: string | 'all'): Promise<OwnerWithdrawal[]> {
    // FIRESTORE: Replace with a query
    const allWithdrawals = structuredClone(placeholderPayoutsToOwners);
    if (ownerName === 'all') {
        return allWithdrawals;
    }
    return allWithdrawals.filter(w => w.ownerName === ownerName);
}


export async function addOwnerWithdrawal(withdrawal: OwnerWithdrawal): Promise<void> {
    // FIRESTORE: Replace with `addDoc`
    placeholderPayoutsToOwners.unshift(withdrawal);
    revalidatePath('/owner/dashboard/wallet');
}


// HELPER ACTIONS
export async function getUserByPitchName(pitchName: string): Promise<User | undefined> {
    const allPitches = await getPitches();
    const pitch = allPitches.find(p => p.name === pitchName);
    if (!pitch || !pitch.ownerId) return undefined;
    return await getUserById(pitch.ownerId);
}
