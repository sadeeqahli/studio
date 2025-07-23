
import type { Pitch, Booking, Payout, OwnerBooking, User, Transaction } from './types';

export const placeholderPitches: Pitch[] = [
  {
    id: '1',
    name: 'Lekki AstroTurf',
    location: 'Lekki Phase 1, Lagos',
    price: 25000,
    amenities: ['Floodlights', 'Changing Rooms', 'Parking'],
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'football stadium',
    availableSlots: ['4:00 PM - 5:00 PM', '5:00 PM - 6:00 PM'],
  },
  {
    id: '2',
    name: 'Ikeja 5-a-side',
    location: 'Ikeja GRA, Lagos',
    price: 18000,
    amenities: ['Bibs', 'Water', 'Parking'],
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'soccer field',
    availableSlots: ['6:00 PM - 7:00 PM', '7:00 PM - 8:00 PM'],
  },
  {
    id: '3',
    name: 'Asokoro Green',
    location: 'Asokoro, Abuja',
    price: 22000,
    amenities: ['Floodlights', 'Secure', 'Lounge'],
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'green field',
    availableSlots: ['3:00 PM - 4:00 PM'],
  },
  {
    id: '4',
    name: 'Port Harcourt Pitch',
    location: 'GRA, Port Harcourt',
    price: 20000,
    amenities: ['Floodlights', 'Parking', 'Cafe'],
    imageUrl: 'https://placehold.co/600x400.png',
    imageHint: 'sports field',
    availableSlots: ['5:00 PM - 6:00 PM', '8:00 PM - 9:00 PM'],
  },
];


export const placeholderBookings: Booking[] = [
    { id: 'TXN72362', pitchName: 'Lekki AstroTurf', date: '2024-07-28', time: '4:00 PM', amount: 25500, status: 'Paid' },
    { id: 'TXN19873', pitchName: 'Ikeja 5-a-side', date: '2024-07-25', time: '7:00 PM', amount: 18500, status: 'Paid' },
    { id: 'TXN45612', pitchName: 'Asokoro Green', date: '2024-07-22', time: '3:00 PM', amount: 22500, status: 'Paid' },
    { id: 'TXN88234', pitchName: 'Lekki AstroTurf', date: '2024-08-05', time: '5:00 PM', amount: 25500, status: 'Pending' },
];

export const placeholderPayouts: Payout[] = [
    { bookingId: 'BK1', customerName: 'Ade Williams', grossAmount: 25000, commissionRate: 5, commissionFee: 1250, netPayout: 23750, date: '2024-07-28', status: 'Paid Out' },
    { bookingId: 'BK2', customerName: 'Chioma Nwosu', grossAmount: 25000, commissionRate: 5, commissionFee: 1250, netPayout: 23750, date: '2024-07-28', status: 'Paid Out' },
    { bookingId: 'BK3', customerName: 'Femi Adebayo', grossAmount: 18000, commissionRate: 5, commissionFee: 900, netPayout: 17100, date: '2024-07-29', status: 'Paid Out' },
    { bookingId: 'BK4', customerName: 'Aisha Bello', grossAmount: 22000, commissionRate: 5, commissionFee: 1100, netPayout: 20900, date: '2024-07-30', status: 'Paid Out' },
    { bookingId: 'BK5', customerName: 'Emeka Okafor', grossAmount: 18000, commissionRate: 10, commissionFee: 1800, netPayout: 16200, date: '2024-08-01', status: 'Pending' },
]

export const ownerBookings: OwnerBooking[] = [
    { id: 'BK1', customer: 'Ade Williams', pitch: 'Lekki AstroTurf', date: '2024-07-28', time: '4:00 PM', amount: 25000, status: 'Paid'},
    { id: 'BK2', customer: 'Chioma Nwosu', pitch: 'Lekki AstroTurf', date: '2024-07-28', time: '5:00 PM', amount: 25000, status: 'Paid'},
    { id: 'BK3', customer: 'Femi Adebayo', pitch: 'Ikeja 5-a-side', date: '2024-07-29', time: '6:00 PM', amount: 18000, status: 'Pending'},
    { id: 'BK4', customer: 'Aisha Bello', pitch: 'Asokoro Green', date: '2024-07-30', time: '3:00 PM', amount: 22000, status: 'Paid'},
    { id: 'BK5', customer: 'Emeka Okafor', pitch: 'Lekki AstroTurf', date: '2024-08-01', time: '7:00 PM', amount: 25000, status: 'Cancelled'},
]

export const placeholderUsers: User[] = [
  { id: 'USR001', name: 'Max Robinson', email: 'm@example.com', role: 'Player', registeredDate: '2024-07-15', status: 'Active', totalBookings: 4 },
  { id: 'USR002', name: 'Tunde Ojo', email: 'tunde.ojo@example.com', role: 'Owner', registeredDate: '2024-07-16', status: 'Active', pitchesListed: 2 },
  { id: 'USR003', name: 'Ade Williams', email: 'ade.w@example.com', role: 'Player', registeredDate: '2024-07-18', status: 'Active', totalBookings: 1 },
  { id: 'USR004', name: 'Chioma Nwosu', email: 'chioma.n@example.com', role: 'Player', registeredDate: '2024-07-20', status: 'Active', totalBookings: 1 },
  { id: 'USR005', name: 'Lekki Goals Arena', email: 'contact@lekkigoals.com', role: 'Owner', registeredDate: '2024-07-21', status: 'Suspended', pitchesListed: 1 },
  { id: 'USR006', name: 'Femi Adebayo', email: 'femi.a@example.com', role: 'Player', registeredDate: '2024-07-22', status: 'Active', totalBookings: 1 },
  { id: 'USR007', name: 'Aisha Bello', email: 'aisha.b@example.com', role: 'Player', registeredDate: '2024-07-25', status: 'Active', totalBookings: 1 },
];


export const placeholderTransactions: Transaction[] = [
    { id: 'TRN001', date: '2024-07-28', description: 'Weekly Payout', amount: -85000, type: 'Withdrawal' },
    { id: 'TRN002', date: '2024-07-28', description: 'Commission for booking BK1', amount: -1250, type: 'Commission' },
    { id: 'TRN003', date: '2024-07-28', description: 'Booking payment from Ade Williams', amount: 25000, type: 'Credit' },
    { id: 'TRN004', date: '2024-07-27', description: 'Commission for booking BK2', amount: -1250, type: 'Commission' },
    { id: 'TRN005', date: '2024-07-27', description: 'Booking payment from Chioma Nwosu', amount: 25000, type: 'Credit' },
    { id: 'TRN006', date: '2024-07-26', description: 'Wallet Deposit', amount: 50000, type: 'Deposit' },
];
