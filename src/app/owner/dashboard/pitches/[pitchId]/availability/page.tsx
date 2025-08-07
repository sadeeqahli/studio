

"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { placeholderPitches, updatePitch, placeholderBookings } from "@/lib/placeholder-data"
import type { Pitch } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Lock, Unlock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export default function ManageAvailabilityPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const [pitch, setPitch] = React.useState<Pitch | null>(null)
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())
    const pitchId = params.pitchId as string;

    React.useEffect(() => {
        if (pitchId) {
            const foundPitch = placeholderPitches.find(p => p.id === pitchId);
            if (foundPitch) {
                setPitch(foundPitch)
            } else {
                toast({
                    title: "Pitch not found",
                    variant: "destructive"
                })
                router.push("/owner/dashboard/pitches")
            }
        }
    }, [pitchId, router, toast])

    const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

    const bookedSlotsForDate = React.useMemo(() => {
        if (!pitch) return new Set();
        return new Set(
            placeholderBookings
                .filter(b => b.pitchName === pitch.name && b.date === dateKey && b.status === 'Paid')
                .flatMap(b => b.time.split(', '))
        );
    }, [pitch, dateKey]);

    const handleToggleSlotBlock = (slotToToggle: string) => {
        if (!pitch || !selectedDate) return;

        const currentBlockedSlots = pitch.manuallyBlockedSlots?.[dateKey] || [];
        const isBlocked = currentBlockedSlots.includes(slotToToggle);

        const newBlockedSlots = isBlocked
            ? currentBlockedSlots.filter(s => s !== slotToToggle)
            : [...currentBlockedSlots, slotToToggle];

        const updatedPitch = {
            ...pitch,
            manuallyBlockedSlots: {
                ...pitch.manuallyBlockedSlots,
                [dateKey]: newBlockedSlots
            }
        };

        updatePitch(updatedPitch);
        setPitch(updatedPitch); // Update local state to trigger re-render
        
        toast({
            title: `Slot ${isBlocked ? 'Unblocked' : 'Blocked'}`,
            description: `The slot "${slotToToggle}" is now ${isBlocked ? 'available' : 'unavailable'} for booking.`
        });
    }

    if (!pitch) {
        return <div>Loading...</div>
    }

    const allDaySlots = pitch.allDaySlots || [];
    const manuallyBlockedSlotsForDate = new Set(pitch.manuallyBlockedSlots?.[dateKey] || []);

    return (
        <div>
            <Button asChild variant="ghost" className="mb-4">
                <Link href="/owner/dashboard/pitches">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Pitches
                </Link>
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Availability for "{pitch.name}"</CardTitle>
                    <CardDescription>Select a date to view its schedule. You can block unbooked time slots to prevent bookings.</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8">
                    <div className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            className="rounded-md border"
                        />
                    </div>
                    <div className="space-y-4">
                        <CardTitle className="text-lg">
                           Schedule for <span className="font-semibold text-primary">{selectedDate ? format(selectedDate, "PPP") : "..."}</span>
                        </CardTitle>
                        
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2 border rounded-md p-2">
                             {allDaySlots.length > 0 ? (
                                allDaySlots.map((slot) => {
                                    const isBooked = bookedSlotsForDate.has(slot);
                                    const isBlocked = manuallyBlockedSlotsForDate.has(slot);
                                    const isDisabled = isBooked;

                                    return (
                                        <div key={slot} className={cn("flex items-center justify-between p-2 rounded-md", isBooked && "bg-destructive/10", isBlocked && "bg-yellow-400/20")}>
                                            <div className="flex flex-col">
                                                <span>{slot}</span>
                                                {isBooked && <Badge variant="destructive" className="w-fit mt-1">Booked by Customer</Badge>}
                                                {isBlocked && <Badge variant="secondary" className="w-fit mt-1">Manually Blocked</Badge>}
                                            </div>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                onClick={() => handleToggleSlotBlock(slot)}
                                                disabled={isDisabled}
                                                aria-label={isBlocked ? "Unblock slot" : "Block slot"}
                                            >
                                                {isBlocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-sm text-muted-foreground p-4 text-center bg-muted rounded-md">
                                    No time slots have been configured for this pitch.
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
                 <CardFooter>
                    <p className="text-xs text-muted-foreground">
                        Booked slots cannot be changed. To block a slot from being booked, click the lock icon. Click it again to unblock it.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
