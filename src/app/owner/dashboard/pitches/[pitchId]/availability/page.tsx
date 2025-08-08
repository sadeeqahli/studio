

import * as React from "react"
import { notFound, useRouter } from "next/navigation"
import { getBookingsByPitch, getPitchById, addBooking } from "@/app/actions"
import type { Pitch, Booking } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserPlus, Loader2, Calendar as CalendarIcon, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { format, addMinutes, getDay, setHours, setMinutes } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ManageAvailabilityClient } from "@/components/owner/manage-availability-client"

export default async function ManageAvailabilityServerPage({ params }: { params: { pitchId: string } }) {
    const pitchId = params.pitchId;
    const pitch = await getPitchById(pitchId);
    
    if (!pitch) {
        notFound();
    }

    const initialBookings = await getBookingsByPitch(pitch.name);
    
    return <ManageAvailabilityClient pitch={pitch} initialBookings={initialBookings} />;
}
