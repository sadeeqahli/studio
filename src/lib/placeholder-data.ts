import type { Pitch, Booking } from './types';

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
    { id: 'TXN72362', pitchName: 'Lekki AstroTurf', date: '2024-07-28', time: '4:00 PM', amount: 25000, status: 'Paid' },
    { id: 'TXN19873', pitchName: 'Ikeja 5-a-side', date: '2024-07-25', time: '7:00 PM', amount: 18000, status: 'Paid' },
    { id: 'TXN45612', pitchName: 'Asokoro Green', date: '2024-07-22', time: '3:00 PM', amount: 22000, status: 'Paid' },
    { id: 'TXN88234', pitchName: 'Lekki AstroTurf', date: '2024-08-05', time: '5:00 PM', amount: 25000, status: 'Pending' },
];
