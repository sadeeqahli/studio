
import * as React from "react"
import { notFound } from "next/navigation"
import { getBookingsByPitch, getPitchById } from "@/app/actions"
import type { Pitch, Booking } from "@/lib/types"
import { ManageAvailabilityClient } from "@/components/owner/manage-availability-client"

// This is now an async Server Component.
// It fetches data on the server before rendering the page.
export default async function ManageAvailabilityServerPage({ params }: { params: { pitchId: string } }) {
    const pitchId = params.pitchId;
    
    // Fetch data directly on the server.
    const pitch = await getPitchById(pitchId);
    
    if (!pitch) {
        // If the pitch isn't found, show a 404 page.
        notFound();
    }

    // Fetch the bookings for this specific pitch.
    const initialBookings = await getBookingsByPitch(pitch.name);
    
    // Render the client component and pass the fetched data as props.
    return <ManageAvailabilityClient pitch={pitch} initialBookings={initialBookings} />;
}
