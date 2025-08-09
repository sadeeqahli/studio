
import * as React from 'react';
import { notFound } from 'next/navigation';
import { getPitchById, getBookingsByPitch, getUserById } from '@/app/actions';
import { BookingClient } from '@/components/booking-client';


export default async function BookingPage({ params }: { params: { pitchId: string } }) {
    const { pitchId } = params;

    // Fetch pitch and owner data on the server
    const pitch = await getPitchById(pitchId);
    if (!pitch) {
        notFound();
    }

    const [pitchBookings, owner] = await Promise.all([
        getBookingsByPitch(pitch.name),
        getUserById(pitch.ownerId),
    ]);

    if (!owner) {
        // Redirect or show an error if owner data is missing
        notFound();
    }

    // Pass server-fetched data as props to the client component.
    // The current user will now be fetched on the client to avoid server-side cookie issues.
    return (
        <BookingClient
            pitch={pitch}
            owner={owner}
            initialBookings={pitchBookings}
        />
    );
}
