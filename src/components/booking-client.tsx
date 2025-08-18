"use client";

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Pitch, Booking, User } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, ArrowLeft, Banknote, Calendar as CalendarIcon, Loader2, ShieldCheck, Clock, Copy, Check } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, setHours, setMinutes, addMinutes } from 'date-fns';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { addBooking, getUserById, updateUserBookingCount } from '@/app/actions';
import { getCookie } from 'cookies-next';

type BookingStatus = 'idle' | 'confirming' | 'success';

interface BookingClientProps {
    pitch: Pitch;
    owner: User;
    initialBookings: Booking[];
}

function generateTimeSlots(pitch: Pitch, date: Date): string[] {
    const slots = [];
    let currentTime = new Date(date);
    currentTime.setHours(0, 0, 0, 0); // Start from midnight

    const endTime = addDays(new Date(currentTime), 1);

    while (currentTime < endTime) {
        slots.push(format(currentTime, 'hh:mm a'));
        currentTime = addMinutes(currentTime, pitch.slotInterval);
    }

    return slots;
}


function PaymentPage({
    totalPrice,
    pitch,
    owner,
    selectedDate,
    selectedSlots,
    currentUser,
    onPaymentConfirmed,
    onBack
}: {
    totalPrice: number;
    pitch: Pitch;
    owner: User;
    selectedDate: Date;
    selectedSlots: string[];
    currentUser: User;
    onPaymentConfirmed: (bookingId: string) => void;
    onBack: () => void;
}) {
    const { toast } = useToast();
    const [bookingStatus, setBookingStatus] = React.useState<BookingStatus>('idle');
    const [copied, setCopied] = React.useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = React.useState<'card' | 'bank_transfer' | 'ussd'>('card');
    const [cardDetails, setCardDetails] = React.useState({
        number: '',
        expiry: '',
        cvv: '',
        name: ''
    });

    // Generate unique virtual account number and reference
    const virtualAccountNumber = `8${owner.id.replace(/\D/g, '').slice(0, 9)}`.padEnd(10, '0');
    const paymentReference = `9JPC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast({ title: "Copied!", description: `${label} copied to clipboard.` });
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFlutterwavePayment = async () => {
        setBookingStatus('confirming');

        const bookingId = `TXN-${pitch.id.slice(-4)}-${Date.now()}`;
        
        try {
            // In a real implementation, you would initialize Flutterwave here
            const flutterwaveConfig = {
                public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || 'FLWPUBK_TEST-xxx',
                tx_ref: paymentReference,
                amount: totalPrice,
                currency: 'NGN',
                payment_options: 'card,banktransfer,ussd',
                customer: {
                    email: currentUser.email || `${currentUser.id}@9japitchconnect.com`,
                    phone_number: currentUser.phone || '08000000000',
                    name: currentUser.name,
                },
                customizations: {
                    title: '9ja Pitch Connect',
                    description: `Booking payment for ${pitch.name}`,
                    logo: 'https://9japitchconnect.com/logo.png',
                },
                split_payment: {
                    id: 'SPLIT_001', // Your split payment configuration ID
                    type: 'percentage',
                    splits: [
                        {
                            type: 'flat',
                            account: owner.flutterwaveSubaccountId || 'RS_XXXX', // Owner's subaccount
                            amount: totalPrice * 0.95 // 95% to owner (5% commission)
                        },
                        {
                            type: 'flat', 
                            account: 'RS_ADMIN_ACCOUNT', // Platform admin account
                            amount: totalPrice * 0.05 // 5% platform commission
                        }
                    ]
                }
            };

            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 3000));

            // Create booking record
            const newBooking: Booking = {
                id: bookingId,
                pitchName: pitch.name,
                date: format(selectedDate, 'yyyy-MM-dd'),
                time: selectedSlots.join(', '),
                amount: totalPrice,
                status: 'Paid',
                customerName: currentUser.name,
                bookingType: 'Online',
                paymentMethod: selectedPaymentMethod === 'card' ? 'Card' : selectedPaymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'USSD',
                paymentReference: paymentReference
            };

            // Calculate commission split and cashback
            const platformCommission = totalPrice * 0.05; // 5% commission
            const ownerAmount = totalPrice - platformCommission;
            const cashbackAmount = 30; // ₦30 cashback reward
            const adminNetAmount = platformCommission - cashbackAmount;

            // Add booking
            await addBooking(newBooking);

            // Update owner's virtual account balance
            const { updateOwnerBalance, updateUserRewards } = await import('@/app/actions');
            await updateOwnerBalance(owner.id, ownerAmount);

            // Add cashback to user's rewards wallet
            await updateUserRewards(currentUser.id, cashbackAmount, 'Booking Cashback');

            // Update user's total bookings for loyalty tracking
            await updateUserBookingCount(currentUser.id);

            setBookingStatus('success');
            
            // Show success message with cashback info
            toast({
                title: "Payment Successful!",
                description: `Booking confirmed! You've earned ₦${cashbackAmount} cashback.`,
            });

            onPaymentConfirmed(bookingId);
        } catch (error) {
            toast({
                title: "Payment Failed",
                description: "Something went wrong. Please try again.",
                variant: "destructive",
            });
            setBookingStatus('idle');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto p-6">
                <div className="mb-6">
                    <Button variant="ghost" onClick={onBack} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Booking
                    </Button>
                    <h1 className="text-3xl font-bold">Complete Payment</h1>
                    <p className="text-muted-foreground">Secure payment powered by Flutterwave</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Payment Methods */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Choose Payment Method</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 gap-3">
                                    <div 
                                        className={cn(
                                            "border rounded-lg p-4 cursor-pointer transition-colors",
                                            selectedPaymentMethod === 'card' ? "border-primary bg-primary/5" : "border-border"
                                        )}
                                        onClick={() => setSelectedPaymentMethod('card')}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                                                {selectedPaymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-primary" />}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Debit/Credit Card</h3>
                                                <p className="text-sm text-muted-foreground">Pay securely with your card</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div 
                                        className={cn(
                                            "border rounded-lg p-4 cursor-pointer transition-colors",
                                            selectedPaymentMethod === 'bank_transfer' ? "border-primary bg-primary/5" : "border-border"
                                        )}
                                        onClick={() => setSelectedPaymentMethod('bank_transfer')}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                                                {selectedPaymentMethod === 'bank_transfer' && <div className="w-2 h-2 rounded-full bg-primary" />}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">Bank Transfer</h3>
                                                <p className="text-sm text-muted-foreground">Transfer to our virtual account</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div 
                                        className={cn(
                                            "border rounded-lg p-4 cursor-pointer transition-colors",
                                            selectedPaymentMethod === 'ussd' ? "border-primary bg-primary/5" : "border-border"
                                        )}
                                        onClick={() => setSelectedPaymentMethod('ussd')}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                                                {selectedPaymentMethod === 'ussd' && <div className="w-2 h-2 rounded-full bg-primary" />}
                                            </div>
                                            <div>
                                                <h3 className="font-semibold">USSD</h3>
                                                <p className="text-sm text-muted-foreground">Pay with your mobile banking</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Payment Details Form */}
                        {selectedPaymentMethod === 'card' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Card Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <Label htmlFor="card-number">Card Number</Label>
                                        <Input 
                                            id="card-number"
                                            placeholder="1234 5678 9012 3456"
                                            value={cardDetails.number}
                                            onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="expiry">Expiry Date</Label>
                                            <Input 
                                                id="expiry"
                                                placeholder="MM/YY"
                                                value={cardDetails.expiry}
                                                onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="cvv">CVV</Label>
                                            <Input 
                                                id="cvv"
                                                placeholder="123"
                                                value={cardDetails.cvv}
                                                onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="name">Cardholder Name</Label>
                                        <Input 
                                            id="name"
                                            placeholder="John Doe"
                                            value={cardDetails.name}
                                            onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {selectedPaymentMethod === 'bank_transfer' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Bank Transfer Details</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-muted/50 p-4 rounded-lg space-y-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Bank Name:</span>
                                            <span className="font-semibold">Flutterwave (Providus Bank)</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Account Name:</span>
                                            <span className="font-semibold">9ja Pitch Connect</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Account Number:</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-semibold">{virtualAccountNumber}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(virtualAccountNumber, 'Account number')}>
                                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-muted-foreground">Reference:</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm">{paymentReference}</span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleCopy(paymentReference, 'Payment reference')}>
                                                    {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <Alert>
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertTitle>Important!</AlertTitle>
                                        <AlertDescription>
                                            Please include the reference number when making your transfer. This helps us track your payment automatically.
                                        </AlertDescription>
                                    </Alert>
                                </CardContent>
                            </Card>
                        )}

                        {selectedPaymentMethod === 'ussd' && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>USSD Payment Codes</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div className="bg-muted/50 p-3 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold">GTBank</span>
                                                <span className="font-mono">*737*000*{totalPrice}*{virtualAccountNumber}#</span>
                                            </div>
                                        </div>
                                        <div className="bg-muted/50 p-3 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold">Access Bank</span>
                                                <span className="font-mono">*901*000*{totalPrice}*{virtualAccountNumber}#</span>
                                            </div>
                                        </div>
                                        <div className="bg-muted/50 p-3 rounded-lg">
                                            <div className="flex justify-between items-center">
                                                <span className="font-semibold">Zenith Bank</span>
                                                <span className="font-mono">*966*000*{totalPrice}*{virtualAccountNumber}#</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div className="space-y-6">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-4">
                                    <Image 
                                        src={pitch.imageUrl}
                                        alt={pitch.name}
                                        width={80}
                                        height={60}
                                        className="object-cover rounded-lg"
                                    />
                                    <div>
                                        <h3 className="font-semibold">{pitch.name}</h3>
                                        <p className="text-sm text-muted-foreground">{pitch.location}</p>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Date</span>
                                        <span>{format(selectedDate, 'PPP')}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Time Slots</span>
                                        <span>{selectedSlots.length} hour(s)</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Price per hour</span>
                                        <span>₦{pitch.price.toLocaleString()}</span>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>₦{totalPrice.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-green-600">
                                        <span>Cashback Reward</span>
                                        <span>+₦30</span>
                                    </div>
                                </div>
                                
                                <Separator />
                                
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-primary">₦{totalPrice.toLocaleString()}</span>
                                </div>
                                
                                <Button 
                                    className="w-full" 
                                    size="lg"
                                    onClick={handleFlutterwavePayment}
                                    disabled={bookingStatus === 'confirming'}
                                >
                                    {bookingStatus === 'confirming' ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing Payment...</>
                                    ) : (
                                        <>
                                            <ShieldCheck className="mr-2 h-4 w-4" />
                                            Pay ₦{totalPrice.toLocaleString()}
                                        </>
                                    )}
                                </Button>
                                
                                <div className="text-xs text-center text-muted-foreground">
                                    <p>🔒 Secured by Flutterwave</p>
                                    <p>You'll earn ₦30 cashback on this booking</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}


export function BookingClient({ pitch, owner, initialBookings }: BookingClientProps) {
    const router = useRouter();
    const [currentUser, setCurrentUser] = React.useState<User | null>(null);
    const [isLoadingUser, setIsLoadingUser] = React.useState(true);
    const [selectedDate, setSelectedDate] = React.useState<Date | undefined>();
    const [selectedSlots, setSelectedSlots] = React.useState<string[]>([]);
    const [agreedToTerms, setAgreedToTerms] = React.useState(false);
    const [showPaymentPage, setShowPaymentPage] = React.useState(false);

    React.useEffect(() => {
        // Set date on client mount to avoid hydration mismatch
        setSelectedDate(new Date());

        const fetchUser = async () => {
            setIsLoadingUser(true);
            const userId = getCookie('loggedInUserId');
            if (userId) {
                const user = await getUserById(String(userId));
                setCurrentUser(user || null);
            }
            setIsLoadingUser(false);
        };
        fetchUser();
    }, []);

    const dateKey = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : '';

    const bookedSlotsForDate = React.useMemo(() => {
        if (!pitch) return new Set();
        return new Set(
            initialBookings
                .filter(b => b.date === dateKey && b.status === 'Paid')
                .flatMap(b => b.time.split(', '))
        );
    }, [pitch, dateKey, initialBookings]);

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

    const handlePaymentConfirmed = (bookingId: string) => {
        router.push(`/dashboard/receipt/${bookingId}`);
    };

    const totalPrice = pitch.price * selectedSlots.length;

    if (isLoadingUser || !selectedDate) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="ml-2">Loading booking page...</p>
            </div>
        );
    }

    if (!currentUser) {
         return (
            <div className="flex items-center justify-center h-full">
                <Card className="max-w-md w-full text-center">
                    <CardHeader>
                        <CardTitle>Authentication Error</CardTitle>
                        <CardDescription>We couldn't verify your session. Please log in again to book a pitch.</CardDescription>
                    </CardHeader>
                    <CardFooter className="flex justify-center">
                         <Button asChild>
                            <Link href="/login">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Go to Login
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        );
    }

    if (showPaymentPage && selectedDate && currentUser) {
        return (
            <PaymentPage
                totalPrice={totalPrice}
                pitch={pitch}
                owner={owner}
                selectedDate={selectedDate}
                selectedSlots={selectedSlots}
                currentUser={currentUser}
                onPaymentConfirmed={handlePaymentConfirmed}
                onBack={() => setShowPaymentPage(false)}
            />
        );
    }

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
                                disabled={selectedSlots.length === 0 || !agreedToTerms}
                                onClick={() => setShowPaymentPage(true)}
                            >
                                <Banknote className="mr-2 h-4 w-4" />
                                Proceed to Pay
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
             
            <TermsDialogContent />
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
                <p><strong>3.2 Pricing:</strong> Prices are set by pitch owners and are displayed in Nigerian Naira (₦). Prices may vary based on location, pitch quality, or time of booking. A service fee may be added by 9ja Pitch Connect to cover platform costs.</p>
                <p><strong>3.3 Payment Terms:</strong> Payments are processed securely via third-party payment providers. Full payment is required at the time of booking to confirm your reservation. All payments are non-refundable unless otherwise stated in the Cancellation Policy.</p>
                <p><strong>3.4 Payment Authorization:</strong> By entering payment details, you authorize 9ja Pitch Connect and its payment partners to process the transaction. You confirm that you are the authorized user of the payment method provided.</p>

                <h4>4. Cancellation and Refund Policy</h4>
                <p><strong>4.1 User Cancellations:</strong> Cancellations must be made at least 24 hours before the booked time to be eligible for a refund, subject to the pitch owner’s cancellation policy. A processing fee may be deducted from refunds.</p>
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