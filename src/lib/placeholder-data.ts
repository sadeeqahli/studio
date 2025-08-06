

import type { Pitch, Booking, Payout, OwnerBooking, User, Transaction, AdminWithdrawal, Activity } from './types';

// This is a new data structure to simulate a user credential store.
export let placeholderCredentials: User[] = [
    { id: 'USR001', name: 'Max Robinson', email: 'm@example.com', password: 'password', role: 'Player', registeredDate: '2024-07-15', status: 'Active', totalBookings: 4 },
    { id: 'USR002', name: 'Tunde Ojo', email: 'tunde.ojo@example.com', password: 'password', role: 'Owner', registeredDate: '2024-07-16', status: 'Active', pitchesListed: 2 },
    { id: 'USR003', name: 'Ade Williams', email: 'ade.w@example.com', password: 'password', role: 'Player', registeredDate: '2024-07-18', status: 'Active', totalBookings: 1 },
    { id: 'USR004', name: 'Chioma Nwosu', email: 'chioma.n@example.com', password: 'password', role: 'Player', registeredDate: '2024-07-20', status: 'Active', totalBookings: 1 },
    { id: 'USR005', name: 'Lekki Goals Arena', email: 'contact@lekkigoals.com', password: 'password', role: 'Owner', registeredDate: '2024-07-21', status: 'Suspended', pitchesListed: 1 },
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


export let placeholderPitches: Pitch[] = [
  {
    id: '1',
    name: 'Lekki AstroTurf',
    location: 'Lekki Phase 1, Lagos',
    price: 25000,
    amenities: ['Floodlights', 'Changing Rooms', 'Parking'],
    imageUrl: 'https://images.unsplash.com/photo-1596352321429-514303685a97?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw1fHxzb2NjZXIlMjBhc3Ryb3R1cmZ8ZW58MHx8fHwxNzUzNzYwODQ0fDA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'astroturf pitch',
    availableSlots: ['4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM'],
    status: 'Active',
  },
  {
    id: '2',
    name: 'Ikeja 5-a-side',
    location: 'Ikeja GRA, Lagos',
    price: 18000,
    amenities: ['Bibs', 'Water', 'Parking'],
    imageUrl: 'https://images.unsplash.com/photo-1521952210435-373f9b234475?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHw1LWEtc2lkZSUyMGZvb3RiYWxsfGVufDB8fHx8MTc1Mzc2MDkwMHww&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: '5-a-side soccer',
    availableSlots: ['6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'],
    status: 'Active',
  },
  {
    id: '3',
    name: 'Asokoro Green',
    location: 'Asokoro, Abuja',
    price: 22000,
    amenities: ['Floodlights', 'Secure', 'Lounge'],
    imageUrl: 'https://images.unsplash.com/photo-1622953443487-735264b51936?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGZvb3RiYWxsJTIwZmllbGR8ZW58MHx8fHwxNzUzNzYwOTYyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'green field',
    availableSlots: ['3:00 PM - 4:00 PM'],
    status: 'Active',
  },
  {
    id: '4',
    name: 'Port Harcourt Pitch',
    location: 'GRA, Port Harcourt',
    price: 20000,
    amenities: ['Floodlights', 'Parking', 'Cafe'],
    imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHBsYXllcnxlbnwwfHx8fDE3NTM3NjEwMTB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    imageHint: 'football players',
    availableSlots: ['5:00 PM - 6:00 PM', '8:00 PM - 9:00 PM'],
    status: 'Active',
  },
];


export const placeholderBookings: Booking[] = [
    { id: 'TXN72362', customerName: 'Ade Williams', pitchName: 'Lekki AstroTurf', date: '2024-07-28', time: '4:00 PM', amount: 25500, status: 'Paid' },
    { id: 'TXN19873', customerName: 'Femi Adebayo', pitchName: 'Ikeja 5-a-side', date: '2024-07-25', time: '7:00 PM', amount: 18500, status: 'Paid' },
    { id: 'TXN45612', customerName: 'Aisha Bello', pitchName: 'Asokoro Green', date: '2024-07-22', time: '3:00 PM', amount: 22500, status: 'Paid' },
    { id: 'TXN88234', customerName: 'Chioma Nwosu', pitchName: 'Lekki AstroTurf', date: '2024-08-05', time: '5:00 PM', amount: 25500, status: 'Pending' },
];

export const placeholderPayouts: Payout[] = [
    { bookingId: 'TXN72362', customerName: 'Ade Williams', grossAmount: 25000, commissionRate: 10, commissionFee: 2500, netPayout: 22500, date: '2024-07-28', status: 'Paid Out' },
    { bookingId: 'TXN19873', customerName: 'Femi Adebayo', grossAmount: 18500, commissionRate: 10, commissionFee: 1850, netPayout: 16650, date: '2024-07-25', status: 'Paid Out' },
    { bookingId: 'TXN45612', customerName: 'Aisha Bello', grossAmount: 22500, commissionRate: 10, commissionFee: 2250, netPayout: 20250, date: '2024-07-22', status: 'Paid Out' },
    { bookingId: 'TXN88234', customerName: 'Chioma Nwosu', grossAmount: 25500, commissionRate: 10, commissionFee: 2550, netPayout: 22950, date: '2024-08-05', status: 'Pending' },
    { bookingId: 'BK5', customerName: 'Emeka Okafor', grossAmount: 18000, commissionRate: 10, commissionFee: 1800, netPayout: 16200, date: '2024-08-01', status: 'Pending' },
]

export const ownerBookings: OwnerBooking[] = [
    { id: 'BK1', customer: 'Ade Williams', pitch: 'Lekki AstroTurf', date: '2024-07-28', time: '4:00 PM', amount: 25000, status: 'Paid'},
    { id: 'BK2', customer: 'Chioma Nwosu', pitch: 'Lekki AstroTurf', date: '2024-07-28', time: '5:00 PM', amount: 25000, status: 'Paid'},
    { id: 'BK3', customer: 'Femi Adebayo', pitch: 'Ikeja 5-a-side', date: '2024-07-29', time: '6:00 PM', amount: 18000, status: 'Pending'},
    { id: 'BK4', customer: 'Aisha Bello', pitch: 'Asokoro Green', date: '2024-07-30', time: '3:00 PM', amount: 22000, status: 'Paid'},
    { id: 'BK5', customer: 'Emeka Okafor', pitch: 'Lekki AstroTurf', date: '2024-08-01', time: '7:00 PM', amount: 25000, status: 'Cancelled'},
]


export const placeholderTransactions: Transaction[] = [
    { id: 'TRN003', date: '2024-07-28', description: 'Credit from booking payment', amount: 22500, type: 'Credit', bookingId: 'TXN72362' },
    { id: 'TRN005', date: '2024-07-27', description: 'Credit from booking payment', amount: 16650, type: 'Credit', bookingId: 'TXN19873'},
];

export const placeholderAdminWithdrawals: AdminWithdrawal[] = [
    { id: 'WDL001', date: '2024-07-20', amount: 5000, bankName: 'GTBank', accountNumber: '****3456', status: 'Successful' },
    { id: 'WDL002', date: '2024-07-10', amount: 2000, bankName: 'Kuda MFB', accountNumber: '****9876', status: 'Successful' },
];

export function updatePitch(updatedPitch: Pitch): void {
    const index = placeholderPitches.findIndex(p => p.id === updatedPitch.id);
    if (index !== -1) {
        placeholderPitches[index] = updatedPitch;
    }
}
