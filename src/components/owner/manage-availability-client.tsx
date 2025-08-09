
"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { addBooking } from "@/app/actions"
import type { Pitch, Booking } from "@/lib/types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, UserPlus, Loader2, Calendar as CalendarIcon, Clock } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { Calendar } from "@/components/ui/calendar"
import { format, addMinutes, startOfDay, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function generateTimeSlots(pitch: Pitch, date: Date): string[] {
    const slots = [];
    let currentTime = startOfDay(date);
    const endTime = addDays(startOfDay(date), 1);

    while (currentTime < endTime) {
        slots.push(format(currentTime, 'hh:mm a'));
        currentTime = addMinutes(currentTime, pitch.slotInterval);
    }

    return slots;
}

function AddManualBookingDialog({
    pitch,
    onManualBooking,
    bookings
}: {
    pitch: Pitch
    onManualBooking: (booking: Booking) => void,
    bookings: Booking[]
}) {
    const { toast } = useToast();
    const [isOpen, setIsOpen] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [customerName, setCustomerName] = React.useState("");
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
    const [selectedSlot, setSelectedSlot] = React.useState<string | undefined>();
    const [availableSlots, setAvailableSlots] = React.useState<string[]>([]);
    
    React.useEffect(() => {
        if (selectedDate) {
            const allSlots = generateTimeSlots(pitch, selectedDate);
            const dateKey = format(selectedDate, 'yyyy-MM-dd');
            const bookedSlots = new Set(
                bookings
                    .filter(b => b.pitchName === pitch.name && b.date === dateKey && b.status === 'Paid')
                    .flatMap(b => b.time.split(', '))
            );
            setAvailableSlots(allSlots.filter(slot => !bookedSlots.has(slot)));
            setSelectedSlot(undefined); // Reset slot selection when date changes
        }
    }, [selectedDate, pitch, isOpen, bookings]);
    
    const manualBookingsOnDate = bookings.filter(b => 
        b.pitchName === pitch.name &&
        b.date === (selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '') &&
        b.bookingType === 'Offline'
    ).length;

    const limitReached = manualBookingsOnDate >= 2;


    const handleConfirmBooking = async () => {
        if (!customerName) {
            toast({ title: "Customer name is required", variant: "destructive" });
            return;
        }
         if (!selectedSlot) {
            toast({ title: "Please select a time slot", variant: "destructive" });
            return;
        }
         if (!selectedDate) {
             toast({ title: "Please select a date", variant: "destructive" });
             return;
         }
         if (limitReached) {
             toast({ title: "Daily limit for manual bookings reached.", variant: "destructive" });
             return;
         }

        setIsLoading(true);

        const newBookingId = `TXN-OFFLINE-${Math.floor(Math.random() * 90000) + 10000}`;
        
        const newBooking: Booking = {
            id: newBookingId,
            pitchName: pitch.name,
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: selectedSlot,
            amount: 0,
            status: 'Paid',
            customerName: customerName,
            bookingType: 'Offline',
        };
        
        await addBooking(newBooking);
        onManualBooking(newBooking);

        toast({
            title: "Manual Booking Created",
            description: `Slot ${selectedSlot} has been booked for ${customerName}.`,
        });
        setIsLoading(false);
        setIsOpen(false);
        setCustomerName("");
        setSelectedSlot(undefined);
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                 <Button>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add Manual Booking
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Manual Booking</DialogTitle>
                    <DialogDescription>
                        Manually book a slot for your pitch. This will be recorded in your history.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 space-y-4">
                     <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                             <Label>Date</Label>
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                className="rounded-md border"
                            />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="slot-select">Time Slot</Label>
                             <Select onValueChange={setSelectedSlot} value={selectedSlot} disabled={!selectedDate || availableSlots.length === 0}>
                                <SelectTrigger id="slot-select">
                                    <SelectValue placeholder="Select a time" />
                                </SelectTrigger>
                                <SelectContent>
                                    {availableSlots.map(slot => <SelectItem key={slot} value={slot}>{slot}</SelectItem>)}
                                </SelectContent>
                            </Select>
                             {selectedDate && availableSlots.length === 0 && (
                                <p className="text-xs text-muted-foreground">No available slots for this day.</p>
                            )}
                         </div>
                    </div>
                     <div>
                        <Label htmlFor="customer-name">Customer Name</Label>
                        <Input 
                            id="customer-name" 
                            placeholder="Enter customer's full name"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                    </div>
                </div>
                 {limitReached && (
                    <Badge variant="destructive" className="w-fit">
                        Daily manual booking limit (2) reached for this date.
                    </Badge>
                )}
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleConfirmBooking} disabled={isLoading || limitReached}>
                         {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Booking...</> : 'Confirm Booking'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// This component now receives its data as props and handles all client interactions.
export function ManageAvailabilityClient({ pitch, initialBookings }: { pitch: Pitch, initialBookings: Booking[] }) {
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
    const [bookings, setBookings] = React.useState<Booking[]>(initialBookings);

    React.useEffect(() => {
        // Set date on client mount to avoid hydration mismatch
        setSelectedDate(new Date());
    }, []);

    const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

    const { bookedSlotsForDate, manualBookingsToday, allDaySlots } = React.useMemo(() => {
        if (!pitch || !selectedDate) return { bookedSlotsForDate: new Map(), manualBookingsToday: 0, allDaySlots: [] };
        
        const slotMap = new Map<string, Booking>();
        let manualCount = 0;

        bookings
            .filter(b => b.pitchName === pitch.name && b.date === dateKey && b.status === 'Paid')
            .forEach(b => {
                 b.time.split(', ').forEach(timeSlot => {
                    slotMap.set(timeSlot, b);
                });
                if (b.bookingType === 'Offline') {
                    manualCount++;
                }
            });
            
        const slotsForDay = generateTimeSlots(pitch, selectedDate);
        
        return { bookedSlotsForDate: slotMap, manualBookingsToday: manualCount, allDaySlots: slotsForDay };

    }, [pitch, dateKey, bookings, selectedDate]);
    
    const handleManualBooking = (newBooking: Booking) => {
        setBookings(prev => [newBooking, ...prev]);
    }

    if (!pitch || !selectedDate) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <Button asChild variant="ghost">
                    <Link href="/owner/dashboard/pitches">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Pitches
                    </Link>
                </Button>
                 <AddManualBookingDialog pitch={pitch} onManualBooking={handleManualBooking} bookings={bookings} />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Manage Schedule for "{pitch.name}"</CardTitle>
                    <CardDescription>Select a date to view its schedule. You can create up to 2 manual bookings per day.</CardDescription>
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
                        <div className="flex justify-between items-center">
                            <h3 className="text-lg font-semibold">
                               Schedule for <span className="font-semibold text-primary">{selectedDate ? format(selectedDate, "PPP") : "..."}</span>
                            </h3>
                             <Badge variant={manualBookingsToday >= 2 ? "destructive" : "secondary"}>
                                {manualBookingsToday}/2 Manual Bookings
                            </Badge>
                        </div>
                        
                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2 border rounded-md p-2">
                             {allDaySlots.length > 0 ? (
                                allDaySlots.map((slot) => {
                                    const bookingDetails = bookedSlotsForDate.get(slot);
                                    const isBooked = !!bookingDetails;

                                    return (
                                        <div key={slot} className={cn("flex items-center justify-between p-2 rounded-md", isBooked ? "bg-muted" : "bg-background")}>
                                            <div className="flex items-center gap-2">
                                                 <Clock className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-mono">{slot}</span>
                                            </div>
                                             <div>
                                                {isBooked ? (
                                                     <Badge variant={bookingDetails.bookingType === 'Offline' ? 'secondary' : 'default'} className="text-xs">
                                                        {bookingDetails.bookingType === 'Offline' ? 'Manual' : 'Online'} by {bookingDetails.customerName}
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-green-600 border-green-300">Available</Badge>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                            ) : (
                                <p className="text-sm text-muted-foreground p-4 text-center bg-muted rounded-md">
                                    No slots available for this day.
                                </p>
                            )}
                        </div>
                    </div>
                </CardContent>
                 <CardFooter>
                    <p className="text-xs text-muted-foreground">
                        Use the "Add Manual Booking" button to record offline payments. Online bookings will appear here automatically.
                    </p>
                 </CardFooter>
            </Card>
        </div>
    )
}
