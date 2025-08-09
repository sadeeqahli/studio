
import * as React from 'react';
import { notFound } from 'next/navigation';
import { getPitchById, getBookingsByPitch, getUserById } from '@/app/actions';
import { cookies } from 'next/headers';
import { getCookie } from 'cookies-next';
import { BookingClient } from '@/components/booking-client';


export default async function BookingPage({ params }: { params: { pitchId: string } }) {
    const { pitchId } = params;

    // Fetch all data on the server
    const pitch = await getPitchById(pitchId);
    if (!pitch) {
        notFound();
    }

    const [pitchBookings, owner, currentUser] = await Promise.all([
        getBookingsByPitch(pitch.name),
        getUserById(pitch.ownerId),
        getCookie('loggedInUserId', { cookies }) ? getUserById(getCookie('loggedInUserId', { cookies })!) : Promise.resolve(null)
    ]);

    if (!owner || !currentUser) {
        // Redirect or show an error if essential data is missing
        notFound();
    }

    // Pass all fetched data as props to the client component
    return (
        <BookingClient
            pitch={pitch}
            owner={owner}
            currentUser={currentUser}
            initialBookings={pitchBookings}
        />
    );
}

