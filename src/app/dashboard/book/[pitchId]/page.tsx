
"use client";

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { placeholderPitches, placeholderBookings, placeholderPayouts } from '@/lib/placeholder-data';
import { Pitch } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, ArrowLeft, Banknote, Calendar as CalendarIcon, Loader2, ShieldCheck, Clock, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

type BookingStatus = 'idle' | 'confirming' | 'confirmed';

function PaymentConfirmationView({ countdown }: { countdown: number }) {
    return (
        <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle>Confirming Your Payment...</CardTitle>
                <CardDescription>Please do not close or refresh this page.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4">
                <div className="relative h-24 w-24">
                    <Loader2 className="absolute h-full w-full animate-spin text-primary" />
                    <span className="absolute inset-0 flex items-center justify-center text-lg font-bold text-primary">
                        {countdown}
                    </span>
                </div>
                <p className="text-sm text-muted-foreground">Securely processing your transaction.</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-green-500" />
                    <span>SSL Encrypted</span>
                </div>
            </CardContent>
        </Card>
    );
}


export default function BookingPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [pitch, setPitch] = React.useState<Pitch | null>(null);
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
    const [selectedSlots, setSelectedSlots] = React.useState<string[]>([]);
    const [agreedToTerms, setAgreedToTerms] = React.useState(false);
    const [bookingStatus, setBookingStatus] = React.useState<BookingStatus>('idle');
    const [countdown, setCountdown] = React.useState(5);
    const [isCopied, setIsCopied] = React.useState(false);
    const pitchId = React.use(Promise.resolve(params.pitchId as string));
    
    const COMMISSION_RATE = 0.05; // 5% commission for this example
    
    React.useEffect(() => {
        const foundPitch = placeholderPitches.find(p => p.id === pitchId);
        if (foundPitch) {
            setPitch(foundPitch);
        }
    }, [pitchId]);

    const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';
    
    // New logic to get booked slots for the selected date
    const bookedSlotsForDate = React.useMemo(() => {
        if (!pitch) return new Set();
        return new Set(
            placeholderBookings
                .filter(b => b.pitchName === pitch.name && b.date === dateKey && b.status === 'Paid')
                .map(b => b.time) 
        );
    }, [pitch, dateKey]);

    const allDaySlots = pitch ? pitch.availableSlots[dateKey] || [] : [];
    
    React.useEffect(() => {
        // Reset selected slots if the date changes
        setSelectedSlots([]);
    }, [selectedDate]);
    
    React.useEffect(() => {
        let timer: NodeJS.Timeout;
        if (bookingStatus === 'confirming' && countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (bookingStatus === 'confirming' && countdown === 0) {
            const newBookingId = `TXN${Math.floor(Math.random() * 90000) + 10000}`;
            const totalAmount = pitch!.price * selectedSlots.length;
            const userName = 'Max Robinson';

            const newBooking = {
                id: newBookingId,
                pitchName: pitch!.name,
                date: format(selectedDate!, 'yyyy-MM-dd'),
                time: `${selectedSlots.join(', ')}`,
                amount: totalAmount,
                status: 'Paid' as const,
                paymentMethod: 'Bank Transfer',
                userName: userName,
                customerName: userName,
                pitchLocation: pitch!.location,
            };

            try {
                localStorage.setItem('latestBooking', JSON.stringify(newBooking));
            } catch (error) {
                console.error("Could not save to localStorage", error);
            }
            
            placeholderBookings.unshift(newBooking as any);
            const commissionAmount = totalAmount * COMMISSION_RATE;
            placeholderPayouts.unshift({
                bookingId: newBookingId,
                customerName: userName,
                grossAmount: totalAmount,
                commissionRate: COMMISSION_RATE * 100,
                commissionFee: commissionAmount,
                netPayout: totalAmount - commissionAmount,
                date: new Date().toISOString().split('T')[0],
                status: 'Paid Out',
            });

            toast({
                title: "Booking Confirmed!",
                description: `Your booking for ${pitch?.name} at ${selectedSlots[0]} is successful.`,
            });

            setBookingStatus('confirmed');
            router.push(`/dashboard/receipt/${newBookingId}`);
        }
        return () => clearTimeout(timer);
    }, [bookingStatus, countdown, pitch, selectedSlots, router, toast, selectedDate]);

    const handleConfirmBooking = () => {
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

        setBookingStatus('confirming');
    };

    const handleSlotSelection = (slot: string, checked: boolean) => {
        setSelectedSlots(prev => {
            if (checked) {
                return [...prev, slot];
            } else {
                return prev.filter(s => s !== slot);
            }
        });
    };

    if (bookingStatus === 'confirming') {
        return <PaymentConfirmationView countdown={countdown} />;
    }

    if (!pitch) {
        return (
            <div className="flex items-center justify-center h-full">
                <Card className="max-w-md w-full">
                    <CardHeader>
                        <CardTitle>Pitch Not Found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>The pitch you are looking for does not exist or could not be loaded.</p>
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
    const virtualAccountNumber = `9${pitch.id.padStart(9, '0')}`;
    const ownerName = "Tunde Ojo";

    const handleCopy = () => {
        navigator.clipboard.writeText(virtualAccountNumber);
        setIsCopied(true);
        toast({ title: 'Copied!', description: 'Account number copied to clipboard.' });
        setTimeout(() => setIsCopied(false), 2000);
    };
    
    return (
        <Dialog>
            <div>
                <Button asChild variant="ghost" className="mb-4">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pitches
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight mb-6">Confirm Your Booking</h1>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div>
                        <Card className="overflow-hidden">
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
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Booking Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="date">Select Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant={"outline"}
                                                    className={cn(
                                                        "w-full justify-start text-left font-normal",
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
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Select Time Slot(s)</h3>
                                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                                        {allDaySlots.map(slot => {
                                            const isBooked = bookedSlotsForDate.has(slot);
                                            const isChecked = selectedSlots.includes(slot);
                                            return (
                                                <div key={slot} className="flex items-center space-x-2">
                                                    <Checkbox
                                                        id={slot}
                                                        checked={isChecked}
                                                        onCheckedChange={(checked) => handleSlotSelection(slot, checked as boolean)}
                                                        disabled={isBooked}
                                                    />
                                                    <Label htmlFor={slot} className={cn("flex justify-between items-center w-full", isBooked ? "cursor-not-allowed text-muted-foreground" : "")}>
                                                        <span>{slot}</span>
                                                            {isBooked ? 
                                                            <Badge variant="destructive">Booked</Badge> 
                                                            : <Badge variant="outline" className="text-green-600 border-green-400">Available</Badge>}
                                                    </Label>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {allDaySlots.length === 0 && (
                                         <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>No Slots</AlertTitle>
                                            <AlertDescription>
                                                There are currently no available slots for this date.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold mb-2">Payment Method</h3>
                                     <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2"><Banknote className="h-5 w-5" /> Bank Transfer</CardTitle>
                                            <CardDescription>Transfer the total amount to the account below. Your booking will be confirmed upon receipt of payment.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Bank Name:</span>
                                                <span className="font-semibold">Providus Bank (Virtual)</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Account Name:</span>
                                                <span className="font-semibold">9ja Pitch Connect - {ownerName}</span>
                                            </div>
                                             <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-muted-foreground">Account Number:</span>
                                                    <p className="font-semibold font-mono">{virtualAccountNumber}</p>
                                                </div>
                                                <Button type="button" variant="ghost" size="icon" onClick={handleCopy}>
                                                    {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                    <span className="sr-only">Copy account number</span>
                                                </Button>
                                            </div>
                                            <Alert className="mt-4">
                                                <AlertCircle className="h-4 w-4" />
                                                <AlertDescription>
                                                  Use your Booking ID as the payment reference to confirm your booking instantly.
                                                </AlertDescription>
                                            </Alert>
                                        </CardContent>
                                    </Card>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs text-muted-foreground">Please read these Terms carefully before making any payment or booking. If you do not agree with these Terms, you may not use the app or its services.</p>
                                    <div className="flex items-center space-x-2">
                                        <Checkbox id="terms" onCheckedChange={(checked) => setAgreedToTerms(checked as boolean)} />
                                        <Label htmlFor="terms" className="text-sm text-muted-foreground">
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
                                    onClick={handleConfirmBooking} 
                                    disabled={selectedSlots.length === 0 || !agreedToTerms || bookingStatus !== 'idle'}
                                >
                                    {bookingStatus === 'idle' ? `Confirm & Pay ₦${totalPrice.toLocaleString()}` : <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>}
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
                <TermsDialogContent />
            </div>
        </Dialog>
    );
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
                <p><strong>3.2 Pricing:</strong> Prices are set by pitch owners and displayed in Nigerian Naira (₦). Prices may vary based on location, pitch quality, or time of booking. A service fee may be added by 9ja Pitch Connect to cover platform costs.</p>
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

    