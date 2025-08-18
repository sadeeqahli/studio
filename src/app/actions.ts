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
  placeholderRewardTransactions,
  placeholderReferrals,
  updatePitch as originalUpdatePitch,
} from '@/lib/placeholder-data';
import type { Pitch, Booking, User, Activity, AdminWithdrawal, OwnerWithdrawal, Payout, ReceiptBooking, RewardTransaction, Referral } from '@/lib/types';

// USER ACTIONS
export async function getUsers(): Promise<User[]> {
  // FIRESTORE: Replace with a call like `getDocs(collection(db, 'users'))`
  return structuredClone(placeholderCredentials);
}

export async function getUserById(id: string): Promise<User | undefined> {
  // FIRESTORE: Replace with `getDoc(doc(db, 'users', id))`
  const users = await getUsers();
  return users.find(u => u.id === id);
}

// Generate virtual account number for pitch owners
function generateVirtualAccountNumber(userId: string): string {
  // Create a 10-digit account number starting with 8
  const numericId = userId.replace(/\D/g, '').slice(0, 9);
  return `8${numericId.padEnd(9, '0')}`;
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
        totalBookings: user.totalBookings || 0,
        pitchesListed: user.pitchesListed,
        subscriptionPlan: user.subscriptionPlan,
        transactionPin: user.transactionPin,
        rewardBalance: user.rewardBalance || 0,
        referralCode: user.referralCode,
        referredBy: user.referredBy,
    };

    // Generate virtual account for pitch owners
    if (newUser.role === 'Owner') {
        newUser.virtualAccountNumber = generateVirtualAccountNumber(newUser.id);
        newUser.virtualAccountBalance = 0;
    }

    // Ensure user is added to the main list first
    const userExists = placeholderCredentials.some(
        u => u.email.toLowerCase() === newUser.email.toLowerCase() && u.role === newUser.role
    );

    if (!userExists) {
        placeholderCredentials.push(newUser);
    }

    // Then, handle the activity log based on the action
    if (user.action === 'Signed Up' || user.action === 'Logged In') {
        placeholderActivities.unshift({
            id: `ACT-${Date.now()}`,
            userName: newUser.name,
            userRole: newUser.role as 'Player' | 'Owner',
            action: user.action,
            timestamp: new Date().toISOString(),
        });
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

export async function addBooking(booking: Booking & { userId?: string }): Promise<void> {
    // FIRESTORE: Replace with `setDoc(doc(db, 'bookings', booking.id), booking)`
    placeholderBookings.unshift(booking);

    // Update user's total bookings count
    if (booking.userId) {
        const user = await getUserById(booking.userId);
        if (user) {
            const updatedUser = {
                ...user,
                totalBookings: (user.totalBookings || 0) + 1
            };
            await updateUser(updatedUser);
        }
    }

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

        // Add cashback (2% of booking amount)
        if (booking.userId) {
            const cashbackAmount = booking.amount * 0.02;
            const cashbackTransaction: RewardTransaction = {
                id: `RWD-CB-${Date.now()}`,
                userId: booking.userId,
                type: 'Cashback',
                amount: cashbackAmount,
                description: `Cashback from booking ${booking.id}`,
                date: new Date().toISOString().split('T')[0],
                relatedBookingId: booking.id,
                status: 'Active'
            };

            await addRewardTransaction(cashbackTransaction);

            // Check for referral completion
            const user = await getUserById(booking.userId);
            if (user?.referredBy) {
                const referrer = await getUserByReferralCode(user.referredBy);
                if (referrer) {
                    // Update referral status
                    const referral = placeholderReferrals.find(r => 
                        r.referrerId === referrer.id && r.refereeId === user.id
                    );
                    if (referral && referral.status === 'Pending') {
                        referral.status = 'Completed';
                        referral.completedBookings = 1;
                        referral.dateCompleted = new Date().toISOString().split('T')[0];

                        // Check if referrer qualifies for bonus
                        await processReferralBonus(referrer.id);
                    }
                }
            }
        }
    }

    revalidatePath('/dashboard/history');
    revalidatePath('/owner/dashboard/bookings');
    revalidatePath('/admin/dashboard/bookings');
    revalidatePath('/owner/dashboard');
    revalidatePath('/admin/dashboard');
    revalidatePath('/owner/dashboard/wallet');
    revalidatePath('/dashboard/rewards');
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


// REWARD WALLET ACTIONS
export async function getRewardTransactions(userId?: string): Promise<RewardTransaction[]> {
    // FIRESTORE: Replace with `getDocs(query(collection(db, 'rewardTransactions'), where('userId', '==', userId)))`
    const allTransactions = structuredClone(placeholderRewardTransactions);
    if (userId) {
        return allTransactions.filter(t => t.userId === userId);
    }
    return allTransactions;
}

export async function addRewardTransaction(transaction: RewardTransaction): Promise<void> {
    // FIRESTORE: Replace with `addDoc(collection(db, 'rewardTransactions'), transaction)`
    placeholderRewardTransactions.unshift(transaction);

    // Update user's reward balance
    const user = await getUserById(transaction.userId);
    if (user) {
        const currentBalance = user.rewardBalance || 0;
        const newBalance = transaction.type === 'Used' 
            ? currentBalance - Math.abs(transaction.amount)
            : currentBalance + transaction.amount;

        await updateUser({
            ...user,
            rewardBalance: Math.max(0, newBalance)
        });
    }

    revalidatePath('/dashboard/rewards');
    revalidatePath('/dashboard');
}

export async function useRewardBalance(userId: string, amount: number, bookingId: string): Promise<boolean> {
    const user = await getUserById(userId);
    if (!user || !user.rewardBalance || user.rewardBalance < amount) {
        return false;
    }

    const transaction: RewardTransaction = {
        id: `RWD-USE-${Date.now()}`,
        userId,
        type: 'Used',
        amount: -amount,
        description: `Reward used for booking ${bookingId}`,
        date: new Date().toISOString().split('T')[0],
        relatedBookingId: bookingId,
        status: 'Used'
    };

    await addRewardTransaction(transaction);
    return true;
}

// REFERRAL ACTIONS
export async function getReferrals(referrerId?: string): Promise<Referral[]> {
    // FIRESTORE: Replace with `getDocs(query(collection(db, 'referrals'), where('referrerId', '==', referrerId)))`
    const allReferrals = structuredClone(placeholderReferrals);
    if (referrerId) {
        return allReferrals.filter(r => r.referrerId === referrerId);
    }
    return allReferrals;
}

export async function addReferral(referral: Referral): Promise<void> {
    // FIRESTORE: Replace with `addDoc(collection(db, 'referrals'), referral)`
    placeholderReferrals.unshift(referral);
    revalidatePath('/dashboard/referrals');
}

export async function processReferralBonus(userId: string): Promise<void> {
    const userReferrals = await getReferrals(userId);
    const completedReferrals = userReferrals.filter(r => r.status === 'Completed' && r.completedBookings >= 1);

    // Check if user has 10 or more completed referrals and hasn't received bonus yet
    if (completedReferrals.length >= 10) {
        const unbonusedReferrals = completedReferrals.filter(r => !r.bonusAwarded);

        if (unbonusedReferrals.length >= 10) {
            // Award 5000 naira bonus
            const bonusTransaction: RewardTransaction = {
                id: `RWD-REF-${Date.now()}`,
                userId,
                type: 'Referral Bonus',
                amount: 5000,
                description: 'Referral bonus for 10 successful referrals',
                date: new Date().toISOString().split('T')[0],
                status: 'Active'
            };

            await addRewardTransaction(bonusTransaction);

            // Mark referrals as bonus awarded
            unbonusedReferrals.slice(0, 10).forEach(r => {
                r.bonusAwarded = true;
            });
        }
    }
}

export async function generateReferralCode(userId: string): Promise<string> {
    const user = await getUserById(userId);
    if (!user) throw new Error('User not found');

    if (user.referralCode) {
        return user.referralCode;
    }

    const code = `${user.name.slice(0, 4).toUpperCase()}${userId.slice(-3)}`;
    await updateUser({
        ...user,
        referralCode: code
    });

    return code;
}

export async function getUserByReferralCode(code: string): Promise<User | undefined> {
    const users = await getUsers();
    return users.find(u => u.referralCode === code);
}

// HELPER ACTIONS
export async function getUserByPitchName(pitchName: string): Promise<User | undefined> {
    const allPitches = await getPitches();
    const pitch = allPitches.find(p => p.name === pitchName);
    if (!pitch || !pitch.ownerId) return undefined;
    return await getUserById(pitch.ownerId);
}

export async function updateUserBookingCount(userId: string) {
  try {
    const users = (await import('@/lib/placeholder-data')).users;
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].totalBookings = (users[userIndex].totalBookings || 0) + 1;
    }
  } catch (error) {
    console.error('Error updating user booking count:', error);
  }
}

export async function updateOwnerBalance(ownerId: string, amount: number) {
  try {
    const users = (await import('@/lib/placeholder-data')).users;
    const ownerIndex = users.findIndex(u => u.id === ownerId);
    if (ownerIndex !== -1) {
      users[ownerIndex].walletBalance = (users[ownerIndex].walletBalance || 0) + amount;
    }
  } catch (error) {
    console.error('Error updating owner balance:', error);
  }
}

export async function updateUserRewards(userId: string, amount: number, description: string) {
  try {
    const users = (await import('@/lib/placeholder-data')).users;
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex !== -1) {
      users[userIndex].rewardBalance = (users[userIndex].rewardBalance || 0) + amount;
      // In a real app, you'd also log the reward transaction
    }
  } catch (error) {
    console.error('Error updating user rewards:', error);
  }
}