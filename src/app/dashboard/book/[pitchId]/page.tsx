
"use client";

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Pitch, Booking, User, PaymentVerificationResponse } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, ArrowLeft, Banknote, Calendar as CalendarIcon, Loader2, ShieldCheck, Clock, Copy, Check, Lock, CreditCard } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, setHours, setMinutes, addMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { getPitchById, getBookingsByPitch, addBooking, getUserById } from '@/app/actions';

declare global {
  interface Window {
    FlutterwaveCheckout: (options: any) => void;
  }
}

type BookingStatus = 'idle' | 'processing_payment' | 'verifying';

function PaymentConfirmationView({ status }: { status: 'processing_payment' | 'verifying' }) {
    const messages = {
        processing_payment: {
            title: 'Processing Your Payment...',
            description: 'Please complete the payment in the popup. Do not close this page.',
        },
        verifying: {
            title: 'Verifying Your Payment...',
            description: 'This will just take a moment. Please do not close or refresh this page.',
        }
    }

    return (
        <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle>{messages[status].title}</CardTitle>
                <CardDescription>{messages[status].description}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 p-8">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span>Securely processing your transaction.</span>
                </div>
            </CardContent>
        </Card>
    );
}

export default function BookingPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const [pitch, setPitch] = React.useState<Pitch | null>(null);
    const [owner, setOwner] = React.useState<User | null>(null);
    const [currentUser, setCurrentUser] = React.useState<User | null>(null);
    const [pitchBookings, setPitchBookings] = React.useState<Booking[]>([]);
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
    const [selectedSlots, setSelectedSlots] = React.useState<string[]>([]);
    const [agreedToTerms, setAgreedToTerms] = React.useState(false);
    const [bookingStatus, setBookingStatus] = React.useState<BookingStatus>('idle');
    const pitchId = params.pitchId as string;
    
    React.useEffect(() => {
        if (!pitchId) return;

        const loadData = async () => {
            const pitchData = await getPitchById(pitchId);
            setPitch(pitchData || null);

            if (pitchData) {
                const bookingsData = await getBookingsByPitch(pitchData.name);
                setPitchBookings(bookingsData);
                const ownerData = await getUserById(pitchData.ownerId);
                setOwner(ownerData || null);
            }

            const currentUserId = localStorage.getItem('loggedInUserId');
            if (currentUserId) {
                const currentUserData = await getUserById(currentUserId);
                setCurrentUser(currentUserData || null);
            }
        };

        loadData();
    }, [pitchId]);

    const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    
    const bookedSlotsForDate = React.useMemo(() => {
        if (!pitch) return new Set();
        return new Set(
            pitchBookings
                .filter(b => b.date === dateKey && b.status === 'Paid')
                .flatMap(b => b.time.split(', '))
        );
    }, [pitch, dateKey, pitchBookings]);

    const allDaySlots = React.useMemo(() => {
        if (!pitch || !selectedDate) return [];
        return generateTimeSlots(pitch, selectedDate);
    }, [pitch, selectedDate]);
    
    React.useEffect(() => {
        setSelectedSlots([]);
    }, [selectedDate]);

    const handleSlotSelection = (slot: string, checked: boolean) => {
        setSelectedSlots(prev => {
            if (checked) {
                return [...prev, slot];
            } else {
                return prev.filter(s => s !== slot);
            }
        });
    };
    
    const handleFlutterwavePayment = async () => {
         if (!selectedDate) {
            toast({ title: "Please select a date.", variant: "destructive" });
            return;
        }
        if (selectedSlots.length === 0) {
            toast({ title: "Please select at least one time slot.", variant: "destructive" });
            return;
        }
        if (!agreedToTerms) {
            toast({ title: "Please agree to the terms.", variant: "destructive" });
            return;
        }
        if (!currentUser || !pitch) {
            toast({ title: "Could not retrieve user or pitch data.", variant: "destructive" });
            return;
        }

        setBookingStatus('processing_payment');

        const totalAmount = pitch.price * selectedSlots.length;
        const bookingId = `TXN-${pitch.id.slice(-4)}-${Date.now()}`;

        const bookingDetailsForVerification: Booking = {
            id: bookingId,
            pitchName: pitch.name,
            date: format(selectedDate, 'yyyy-MM-dd'),
            time: selectedSlots.join(', '),
            amount: totalAmount,
            status: 'Paid',
            customerName: currentUser.name,
            bookingType: 'Online',
        };

        const paymentConfig = {
            public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
            tx_ref: bookingId,
            amount: totalAmount,
            currency: "NGN",
            payment_options: "card,mobilemoney,ussd",
            redirect_url: '', // This will be handled by the callback
            customer: {
                email: currentUser.email,
                name: currentUser.name,
            },
            customizations: {
                title: "9ja Pitch Connect Booking",
                description: `Payment for ${pitch.name}`,
                logo: "https://www.linkpicture.com/q/logo_6.svg",
            },
            callback: async function (data: any) {
                // This function is called when the user completes the payment popup.
                setBookingStatus('verifying');
                const transaction_id = data.transaction_id;
                
                // Now, send the transaction ID to our secure backend to verify.
                const response = await fetch('/api/payments/verify', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ transaction_id, bookingDetails: bookingDetailsForVerification }),
                });

                const result: PaymentVerificationResponse = await response.json();

                if (result.status === 'success' && result.bookingId) {
                    toast({
                        title: "Payment Successful!",
                        description: result.message,
                    });
                    // Redirect to the receipt page
                    router.push(`/dashboard/receipt/${result.bookingId}`);
                } else {
                    toast({
                        title: "Payment Failed",
                        description: result.message || "An unknown error occurred.",
                        variant: "destructive",
                    });
                    setBookingStatus('idle'); // Reset status on failure
                }
            },
            onclose: function() {
                // This is called if the user closes the popup without paying.
                setBookingStatus('idle');
                toast({
                    title: "Payment Cancelled",
                    description: "You have cancelled the payment process.",
                    variant: "destructive"
                });
            },
        };

        if (window.FlutterwaveCheckout) {
            window.FlutterwaveCheckout(paymentConfig);
        } else {
            toast({
                title: "Error",
                description: "Payment gateway script could not be loaded. Please refresh the page.",
                variant: "destructive",
            });
            setBookingStatus('idle');
        }
    };

    if (bookingStatus === 'processing_payment' || bookingStatus === 'verifying') {
        return <PaymentConfirmationView status={bookingStatus} />;
    }

    if (!pitch || !owner) {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle>Loading Pitch...</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Loading pitch details, please wait.</p>
                        <Loader2 className="h-8 w-8 animate-spin text-primary mt-4" />
                    </CardContent>
                    <CardFooter>
                         <Button asChild variant="outline">
                            <Link href="/dashboard">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    const totalPrice = pitch.price * selectedSlots.length;
    
    return (
        <Dialog>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-3">
                    <Button asChild variant="ghost" className="mb-4 px-0">
                        <Link href="/dashboard">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pitches
                        </Link>
                    </Button>
                    <h1 className="text-2xl font-bold tracking-tight">Confirm Your Booking</h1>
                </div>

                {/* Left Side */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Booking Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <Label htmlFor="date">Select Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal mt-1",
                                                !selectedDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={selectedDate}
                                            onSelect={setSelectedDate}
                                            initialFocus
                                            fromDate={new Date()}
                                            toDate={addDays(new Date(), 7)}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <h3 className="font-semibold mb-2 text-sm">Select Time Slot(s)</h3>
                                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto pr-2 border rounded-md p-2">
                                    {allDaySlots.map(slot => {
                                        const isBooked = bookedSlotsForDate.has(slot);
                                        const isDisabled = isBooked;
                                        const isChecked = selectedSlots.includes(slot);
                                        return (
                                            <div key={slot} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={slot}
                                                    checked={isChecked}
                                                    onCheckedChange={(checked) => handleSlotSelection(slot, checked as boolean)}
                                                    disabled={isDisabled}
                                                />
                                                <Label htmlFor={slot} className={cn("flex justify-between items-center w-full text-xs font-normal", isDisabled ? "cursor-not-allowed text-muted-foreground" : "")}>
                                                    <span className="font-mono">{slot}</span>
                                                        {isBooked ? 
                                                            <Badge variant="destructive">Booked</Badge> :
                                                            <Badge variant="outline" className="text-green-600 border-green-400">Free</Badge>
                                                        }
                                                </Label>
                                            </div>
                                        )
                                    })}
                                </div>
                                {allDaySlots.length === 0 && (
                                     <Alert variant="destructive" className="mt-2">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>No Slots Available</AlertTitle>
                                        <AlertDescription>
                                            The owner has not configured any time slots for this day.
                                        </AlertDescription>
                                    </Alert>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="overflow-hidden sticky top-20">
                        <Image 
                            src={pitch.imageUrl}
                            alt={pitch.name}
                            width={600}
                            height={400}
                            data-ai-hint={pitch.imageHint}
                            className="object-cover w-full aspect-video"
                        />
                        <CardHeader>
                            <CardTitle>{pitch.name}</CardTitle>
                            <CardDescription>{pitch.location}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Price per hour</span>
                                    <span className="font-semibold">₦{pitch.price.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Duration</span>
                                    <span className="font-semibold">{selectedSlots.length} hour(s)</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between">
                                    <span className="text-lg font-bold">Total</span>
                                    <span className="text-lg font-bold text-primary">₦{totalPrice.toLocaleString()}</span>
                                </div>
                            </div>
                             <div className="mt-4 space-y-2">
                                <div className="flex items-center space-x-2">
                                    <Checkbox id="terms" onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
                                    <Label htmlFor="terms" className="text-xs text-muted-foreground leading-snug">
                                        I have read and agree to the {' '}
                                        <DialogTrigger>
                                            <span className="underline hover:text-primary cursor-pointer">terms and conditions</span>
                                        </DialogTrigger>
                                        .
                                    </Label>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full" 
                                size="lg" 
                                onClick={handleFlutterwavePayment} 
                                disabled={selectedSlots.length === 0 || !agreedToTerms || bookingStatus !== 'idle'}
                            >
                                <CreditCard className="mr-2 h-4 w-4" />
                                {`Pay with Flutterwave ₦${totalPrice.toLocaleString()}`}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <TermsDialogContent />
            </div>
        </Dialog>
    );
}

function generateTimeSlots(pitch: Pitch, date: Date): string[] {
    const dayOfWeek = format(date, 'EEEE'); // e.g., "Monday"
    const operatingHours = pitch.operatingHours.find(h => h.day === dayOfWeek);

    if (!operatingHours) {
        return [];
    }
    
    const slots = [];
    const [startHour, startMinute] = operatingHours.startTime.split(':').map(Number);
    const [endHour, endMinute] = operatingHours.endTime.split(':').map(Number);

    let currentTime = setMinutes(setHours(date, startHour), startMinute);
    const endTime = setMinutes(setHours(date, endHour), endMinute);

    while (currentTime < endTime) {
        slots.push(format(currentTime, 'hh:mm a'));
        currentTime = addMinutes(currentTime, pitch.slotInterval);
    }

    return slots;
}

const TermsDialogContent = () => (
    <DialogContent className="max-w-3xl">
        <DialogHeader>
            <DialogTitle>Terms and Conditions</DialogTitle>
            <DialogDescription>
                Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-6">
            <div className="prose prose-sm dark:prose-invert max-w-none">
                <p>
                    Please read these Terms carefully before making any payment or booking. If you do not agree with these Terms, you may not use the app or its services.
                </p>

                <h4>1. General</h4>
                <p><strong>1.1 Acceptance of Terms:</strong> By using 9ja Pitch Connect, you confirm that you are at least 18 years old or have the consent of a parent/guardian, and you agree to comply with these Terms.</p>
                <p><strong>1.2 Service Description:</strong> 9ja Pitch Connect provides a platform to search, book, and pay for football pitches based on time-duration pricing (e.g., hourly or half-hourly rates). The app integrates Google Maps for location-based services and facilitates secure payments via third-party providers.</p>
                <p><strong>1.3 Modification of Terms:</strong> 9ja Pitch Connect reserves the right to update or modify these Terms at any time. Changes will be communicated via the app or email, and continued use of the app constitutes acceptance of the updated Terms.</p>

                <h4>2. User Responsibilities</h4>
                <p><strong>2.1 Account Creation:</strong> To book a pitch, you must create an account with accurate information (e.g., name, phone number, email). You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.</p>
                <p><strong>2.2 Accurate Information:</strong> You agree to provide truthful and complete information when booking a pitch. Misrepresentation may result in booking cancellation or account suspension.</p>
                <p><strong>2.3 Compliance with Venue Rules:</strong> You must adhere to the rules and regulations of the booked pitch, as set by the pitch owner. 9ja Pitch Connect is not responsible for disputes arising from non-compliance with venue policies.</p>
                <div><strong>2.4 Prohibited Conduct:</strong> You may not use the app to:</div>
                <ul>
                    <li>Engage in illegal activities or violate any laws.</li>
                    <li>Book pitches for commercial purposes without prior approval from 9ja Pitch Connect.</li>
                    <li>Misuse the platform, including making fraudulent bookings or payments.</li>
                </ul>

                <h4>3. Booking and Payment</h4>
                <p><strong>3.1 Booking Process:</strong> Bookings are made through the 9ja Pitch Connect app by selecting a pitch, date, time, and duration. Availability is displayed in real-time, subject to confirmation by the pitch owner. You must review booking details (e.g., pitch location, price, duration) before proceeding to payment.</p>
                <p><strong>3.2 Pricing:</strong> Prices are set by pitch owners and are displayed in Nigerian Naira (₦). Prices may vary based on location, pitch quality, or time of booking. A service fee may be added by 9ja Pitch Connect to cover platform costs.</p>
                <p><strong>3.3 Payment Terms:</strong> Payments are processed securely via third-party payment providers. Full payment is required at the time of booking to confirm your reservation. All payments are non-refundable unless otherwise stated in the Cancellation Policy.</p>
                <p><strong>3.4 Payment Authorization:</strong> By entering payment details, you authorize 9ja Pitch Connect and its payment partners to process the transaction. You confirm that you are the authorized user of the payment method provided.</p>

                <h4>4. Cancellation and Refund Policy</h4>
                <p><strong>4.1 User Cancellations:</strong> Cancellations must be made at least 24 hours before the booked time slot to be eligible for a refund, subject to the pitch owner’s cancellation policy. A processing fee may be deducted from refunds.</p>
                <p><strong>4.2 Pitch Owner Cancellations:</strong> If a pitch owner cancels a booking, 9ja Pitch Connect will notify you and provide a full refund or offer an alternative pitch/time slot.</p>
                <p><strong>4.3 No-Show Policy:</strong> Failure to arrive at the booked pitch without prior cancellation will result in no refund.</p>

                <h4>5. Liability and Disclaimers</h4>
                <p><strong>5.1 Platform Role:</strong> 9ja Pitch Connect acts as an intermediary between users and pitch owners. We do not own or operate the pitches and are not responsible for their condition, safety, or availability.</p>
                <p><strong>5.2 User Safety:</strong> You are responsible for ensuring your safety and the safety of others during your booking. 9ja Pitch Connect is not liable for injuries, damages, or losses incurred at the pitch.</p>

                <h4>6. Intellectual Property</h4>
                <p><strong>6.1 Ownership:</strong> All content on the 9ja Pitch Connect app (e.g., logos, text, design) is owned by 9ja Pitch Connect or its licensors and protected by intellectual property laws.</p>

                <h4>7. Privacy</h4>
                <p><strong>7.1 Data Collection:</strong> We collect personal information to process bookings and improve services. Our Privacy Policy details how we handle your data.</p>

                <h4>8. Termination</h4>
                <p><strong>8.1 Account Termination:</strong> 9ja Pitch Connect reserves the right to suspend or terminate your account for violating these Terms.</p>

                <h4>9. Governing Law and Dispute Resolution</h4>
                <p><strong>9.1 Governing Law:</strong> These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes will be subject to the jurisdiction of courts in Lagos, Nigeria.</p>

                <h4>10. Contact Information</h4>
                <p>For questions, complaints, or support, contact us at:</p>
                    <ul>
                        <li>Email: support@9japitchconnect.com</li>
                        <li>Phone: +234 913 047 4356</li>
                        <li>Website: <a href="https://9japitchconnect.com" target="_blank" rel="noopener noreferrer">www.9japitchconnect.com</a></li>
                    </ul>

                <h4>11. Acknowledgment</h4>
                <p>
                    By proceeding to payment, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, as well as our Privacy Policy. You confirm that you are authorized to make the booking and payment, and you accept responsibility for complying with all applicable rules and policies.
                </p>
            </div>
        </ScrollArea>
    </DialogContent>
);
