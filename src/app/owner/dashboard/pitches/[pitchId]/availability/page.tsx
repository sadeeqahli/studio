

"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import { placeholderPitches, updatePitch, placeholderBookings, placeholderPayouts, placeholderCredentials } from "@/lib/placeholder-data"
import type { Pitch, Booking } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, PlusCircle, UserPlus, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


function AddManualBookingDialog({
    slot,
    pitch,
    date,
    onManualBooking,
}: {
    slot: string
    pitch: Pitch
    date: Date
    onManualBooking: (booking: Booking) => void
}) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [customerName, setCustomerName] = React.useState("");

    const handleConfirmBooking = () => {
        if (!customerName) {
            toast({ title: "Customer name is required", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        setTimeout(() => {
            const newBookingId = `TXN-OFFLINE-${Math.floor(Math.random() * 90000) + 10000}`;
            const owner = placeholderCredentials.find(u => u.id === pitch.ownerId);
            
            const newBooking: Booking = {
                id: newBookingId,
                pitchName: pitch.name,
                date: format(date, 'yyyy-MM-dd'),
                time: slot,
                amount: pitch.price,
                status: 'Paid',
                customerName: customerName,
                bookingType: 'Offline',
            };
            
             // Calculate commission based on owner's plan
            const commissionRate = owner?.subscriptionPlan === 'Plus' ? 0.05 : owner?.subscriptionPlan === 'Pro' ? 0.03 : 0.10;
            const commissionAmount = pitch.price * commissionRate;

            placeholderPayouts.unshift({
                bookingId: newBookingId,
                customerName: customerName,
                grossAmount: pitch.price,
                commissionRate: commissionRate * 100,
                commissionFee: commissionAmount,
                netPayout: pitch.price - commissionAmount,
                date: new Date().toISOString().split('T')[0],
                status: 'Paid Out',
                ownerName: owner!.name,
            });
            
            onManualBooking(newBooking);

            toast({
                title: "Manual Booking Created",
                description: `Slot ${slot} has been booked for ${customerName}.`,
            });
            setIsLoading(false);
            setIsOpen(false);
            setCustomerName("");
        }, 1000);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                 <Button variant="outline" size="sm" className="h-8">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Book Manually
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Manual Booking</DialogTitle>
                    <DialogDescription>
                        Manually book the slot for <span className="font-bold">{slot}</span> on <span className="font-bold">{format(date, "PPP")}</span>. This will be recorded in your history.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                     <Label htmlFor="customer-name">Customer Name</Label>
                     <Input 
                        id="customer-name" 
                        placeholder="Enter customer's full name"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmBooking} disabled={isLoading}>
                         {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...</> : 'Confirm Booking'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default function ManageAvailabilityPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const [pitch, setPitch] = React.useState<Pitch | null>(null)
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date())
    const [bookings, setBookings] = React.useState<Booking[]>(placeholderBookings);

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
        if (!pitch) return new Map();
        
        const slotMap = new Map<string, Booking>();
        bookings
            .filter(b => b.pitchName === pitch.name && b.date === dateKey && b.status === 'Paid')
            .forEach(b => {
                 b.time.split(', ').forEach(timeSlot => {
                    slotMap.set(timeSlot, b);
                });
            });
        return slotMap;

    }, [pitch, dateKey, bookings]);
    
    const handleManualBooking = (newBooking: Booking) => {
        // Add to global bookings
        placeholderBookings.unshift(newBooking);
        // Refresh local state to trigger re-render
        setBookings([...placeholderBookings]);
    }


    if (!pitch) {
        return <div>Loading...</div>
    }

    const allDaySlots = pitch.allDaySlots || [];

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
                    <CardTitle>Manage Schedule for "{pitch.name}"</CardTitle>
                    <CardDescription>Select a date to view its schedule. You can create manual bookings for walk-in customers.</CardDescription>
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
                                    const bookingDetails = bookedSlotsForDate.get(slot);
                                    const isBooked = !!bookingDetails;

                                    return (
                                        <div key={slot} className={cn("flex items-center justify-between p-2 rounded-md", isBooked && "bg-muted")}>
                                            <div className="flex flex-col">
                                                <span>{slot}</span>
                                                {isBooked && (
                                                    <Badge variant={bookingDetails.bookingType === 'Offline' ? 'secondary' : 'destructive'} className="w-fit mt-1">
                                                        {bookingDetails.bookingType === 'Offline' ? 'Manual Booking' : 'Online Booking'} by {bookingDetails.customerName}
                                                    </Badge>
                                                )}
                                            </div>
                                             {!isBooked && selectedDate && (
                                                <AddManualBookingDialog
                                                    slot={slot}
                                                    pitch={pitch}
                                                    date={selectedDate}
                                                    onManualBooking={handleManualBooking}
                                                />
                                            )}
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-sm text-muted-foreground p-4 text-center bg-muted rounded-md">
                                    No time slots have been configured for this pitch. Go to 'Edit Pitch' to add slots.
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
                 <CardFooter>
                    <p className="text-xs text-muted-foreground">
                        Slots booked by players online cannot be changed. You can add manual bookings for any available time slots.
                    </p>
                </CardFooter>
            </Card>
        </div>
    )
}
