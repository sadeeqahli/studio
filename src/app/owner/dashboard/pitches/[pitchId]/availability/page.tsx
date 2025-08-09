
"use client"

import * as React from "react"
import { notFound } from "next/navigation"
import { getBookingsByPitch, getPitchById } from "@/app/actions"
import type { Pitch, Booking } from "@/lib/types"
import { ManageAvailabilityClient } from "@/components/owner/manage-availability-client"

export default function ManageAvailabilityServerPage({ params }: { params: { pitchId: string } }) {
    const [pitch, setPitch] = React.useState<Pitch | null>(null);
    const [initialBookings, setInitialBookings] = React.useState<Booking[]>([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchData = async () => {
            const pitchData = await getPitchById(params.pitchId);
            if (!pitchData) {
                notFound();
                return;
            }
            const bookingsData = await getBookingsByPitch(pitchData.name);
            setPitch(pitchData);
            setInitialBookings(bookingsData);
            setLoading(false);
        };
        fetchData();
    }, [params.pitchId]);
    
    if (loading || !pitch) {
        // You can return a loading spinner here
        return <div>Loading...</div>;
    }
    
    return <ManageAvailabilityClient pitch={pitch} initialBookings={initialBookings} />;
}
