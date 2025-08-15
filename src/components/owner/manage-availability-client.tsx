
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
import { format, addMinutes, addDays } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function generateTimeSlots(pitch: Pitch, date: Date): string[] {
    const slots = [];
    const baseDate = new Date(date);
    baseDate.setHours(0, 0, 0, 0);

    let currentTime = new Date(baseDate);
    const endTime = addDays(new Date(baseDate), 1);

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
    const [startTime, setStartTime] = React.useState<string>("");
    const [endTime, setEndTime] = React.useState<string>("");
    const [availableSlots, setAvailableSlots] = React.useState<string[]>([]);
    
    // Generate hourly time slots for selection
    const generateHourlySlots = () => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            const time = `${hour.toString().padStart(2, '0')}:00`;
            slots.push(time);
        }
        return slots;
    };

    const hourlySlots = generateHourlySlots();
    
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
        }
    }, [selectedDate, pitch, isOpen, bookings]);
    
    const manualBookingsOnDate = bookings.filter(b => 
        b.pitchName === pitch.name &&
        b.date === (selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '') &&
        b.bookingType === 'Offline'
    ).length;

    const limitReached = manualBookingsOnDate >= 2;

    // Generate time slots between start and end time
    const generateSelectedTimeSlots = (start: string, end: string) => {
        if (!start || !end) return [];
        
        const startHour = parseInt(start.split(':')[0]);
        const endHour = parseInt(end.split(':')[0]);
        
        if (startHour >= endHour) return [];
        
        const slots = [];
        const baseDate = selectedDate ? new Date(selectedDate) : new Date();
        baseDate.setHours(0, 0, 0, 0);
        
        for (let hour = startHour; hour < endHour; hour += pitch.slotInterval / 60) {
            const slotTime = new Date(baseDate);
            slotTime.setHours(Math.floor(hour), (hour % 1) * 60);
            slots.push(format(slotTime, 'hh:mm a'));
        }
        
        return slots;
    };

    const selectedTimeSlots = generateSelectedTimeSlots(startTime, endTime);


    const handleConfirmBooking = async () => {
        if (!customerName) {
            toast({ title: "Customer name is required", variant: "destructive" });
            return;
        }
        if (!startTime || !endTime) {
            toast({ title: "Please select start and end time", variant: "destructive" });
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

        const startHour = parseInt(startTime.split(':')[0]);
        const endHour = parseInt(endTime.split(':')[0]);
        
        if (startHour >= endHour) {
            toast({ title: "End time must be after start time", variant: "destructive" });
            return;
        }

        // Check if any of the selected slots are already booked
        const conflictingSlots = selectedTimeSlots.filter(slot => !availableSlots.includes(slot));
        if (conflictingSlots.length > 0) {
            toast({ 
                title: "Time slot conflict", 
                description: `Some selected time slots are already booked: ${conflictingSlots.join(', ')}`,
                variant: "destructive" 
            });
            return;
        }

        setIsLoading(true);

        const newBookingId = `TXN-OFFLINE-${Math.floor(Math.random() * 90000) + 10000}`;
        
        const newBooking: Booking = {
            id: newBookingId,
            pitchName: pitch.name,
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: selectedTimeSlots.join(', '),
            amount: 0,
            status: 'Paid',
            customerName: customerName,
            bookingType: 'Offline',
        };
        
        await addBooking(newBooking);
        onManualBooking(newBooking);

        toast({
            title: "Manual Booking Created",
            description: `Time slots ${startTime} - ${endTime} booked for ${customerName}.`,
        });
        setIsLoading(false);
        setIsOpen(false);
        setCustomerName("");
        setStartTime("");
        setEndTime("");
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
                <div className="py-4 space-y-6">
                    <div className="grid gap-6">
                        <div className="space-y-3">
                            <Label className="text-sm font-medium">Select Date</Label>
                            <div className="flex justify-center">
                                <Calendar
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    className="rounded-lg border shadow-sm bg-background"
                                    disabled={(date) => date < new Date()}
                                />
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="start-time">Start Time</Label>
                                <Select onValueChange={setStartTime} value={startTime}>
                                    <SelectTrigger id="start-time">
                                        <SelectValue placeholder="Select start time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hourlySlots.map(time => (
                                            <SelectItem key={time} value={time}>
                                                {format(new Date(`2000-01-01T${time}`), 'h:mm a')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div className="space-y-2">
                                <Label htmlFor="end-time">End Time</Label>
                                <Select onValueChange={setEndTime} value={endTime}>
                                    <SelectTrigger id="end-time">
                                        <SelectValue placeholder="Select end time" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {hourlySlots.map(time => (
                                            <SelectItem key={time} value={time}>
                                                {format(new Date(`2000-01-01T${time}`), 'h:mm a')}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {startTime && endTime && selectedTimeSlots.length > 0 && (
                            <div className="p-3 bg-muted/50 rounded-lg">
                                <Label className="text-sm font-medium mb-2 block">Selected Time Slots:</Label>
                                <div className="flex flex-wrap gap-1">
                                    {selectedTimeSlots.map(slot => (
                                        <Badge key={slot} variant="outline" className="text-xs">
                                            {slot}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="space-y-2">
                            <Label htmlFor="customer-name">Customer Name</Label>
                            <Input 
                                id="customer-name" 
                                placeholder="Enter customer's full name"
                                value={customerName}
                                onChange={(e) => setCustomerName(e.target.value)}
                            />
                        </div>
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

    

    