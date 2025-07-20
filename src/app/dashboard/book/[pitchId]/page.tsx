
"use client";

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { placeholderPitches } from '@/lib/placeholder-data';
import { Pitch } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { AlertCircle, ArrowLeft, Banknote, CreditCard, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';


export default function BookingPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [pitch, setPitch] = React.useState<Pitch | null>(null);
    const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);
    const [agreedToTerms, setAgreedToTerms] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    
    React.useEffect(() => {
        const foundPitch = placeholderPitches.find(p => p.id === params.pitchId);
        if (foundPitch) {
            setPitch(foundPitch);
        }
    }, [params.pitchId]);

    const handleConfirmBooking = () => {
        if (!selectedSlot) {
            toast({
                title: "Selection required",
                description: "Please select a time slot before confirming.",
                variant: "destructive",
            });
            return;
        }
        if (!agreedToTerms) {
            toast({
                title: "Agreement required",
                description: "You must agree to the terms and conditions.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        // Simulate payment processing
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Booking Confirmed!",
                description: `Your booking for ${pitch?.name} at ${selectedSlot} is successful.`,
            });
            router.push('/dashboard/history');
        }, 2000);
    };

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
    
    return (
        <Dialog>
            <div>
                <Button asChild variant="ghost" className="mb-4">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Pitches
                    </Link>
                </Button>
                <h1 className="text-2xl font-bold tracking-tight mb-6">Confirm Your Booking</h1>
                <div className="grid md:grid-cols-2 gap-8">
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
                                <p className="text-2xl font-bold text-primary">₦{pitch.price.toLocaleString()}<span className="text-base font-normal text-muted-foreground">/hr</span></p>
                            </CardContent>
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle>Booking Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <h3 className="font-semibold mb-2">Select a Time Slot</h3>
                                    {pitch.availableSlots.length > 0 ? (
                                        <RadioGroup onValueChange={setSelectedSlot}>
                                            <div className="space-y-2">
                                                {pitch.availableSlots.map(slot => (
                                                    <div key={slot} className="flex items-center space-x-2">
                                                        <RadioGroupItem value={slot} id={slot} />
                                                        <Label htmlFor={slot}>{slot}</Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </RadioGroup>
                                    ) : (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>No Slots</AlertTitle>
                                            <AlertDescription>
                                                There are currently no available slots for this pitch.
                                            </AlertDescription>
                                        </Alert>
                                    )}
                                </div>
                                
                                <div>
                                    <h3 className="font-semibold mb-2">Payment Method</h3>
                                    <Tabs defaultValue="card">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="card"><CreditCard className="mr-2 h-4 w-4" />Card</TabsTrigger>
                                            <TabsTrigger value="transfer"><Banknote className="mr-2 h-4 w-4" />Transfer</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="card" className="mt-4 p-4 border rounded-md">
                                            <p className="text-sm text-muted-foreground">You will be redirected to a secure payment gateway to complete your transaction with a credit/debit card.</p>
                                        </TabsContent>
                                        <TabsContent value="transfer" className="mt-4 p-4 border rounded-md">
                                            <p className="text-sm text-muted-foreground">Account details for bank transfer will be shown on the next page. Your booking will be confirmed upon receipt of payment.</p>
                                        </TabsContent>
                                    </Tabs>
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
                                    disabled={!selectedSlot || isLoading || !agreedToTerms}
                                >
                                    {isLoading ? (
                                        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</>
                                    ) : (
                                        `Confirm & Pay ₦${pitch.price.toLocaleString()}`
                                    )}
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
                <p><strong>1.1 Acceptance of Terms:</strong> By using Naija Pitch Connect, you confirm that you are at least 18 years old or have the consent of a parent/guardian, and you agree to comply with these Terms.</p>
                <p><strong>1.2 Service Description:</strong> Naija Pitch Connect provides a platform to search, book, and pay for football pitches based on time-duration pricing (e.g., hourly or half-hourly rates). The app integrates Google Maps for location-based services and facilitates secure payments via third-party providers.</p>
                <p><strong>1.3 Modification of Terms:</strong> Naija Pitch Connect reserves the right to update or modify these Terms at any time. Changes will be communicated via the app or email, and continued use of the app constitutes acceptance of the updated Terms.</p>

                <h4>2. User Responsibilities</h4>
                <p><strong>2.1 Account Creation:</strong> To book a pitch, you must create an account with accurate information (e.g., name, phone number, email). You are responsible for maintaining the confidentiality of your account credentials and all activities under your account.</p>
                <p><strong>2.2 Accurate Information:</strong> You agree to provide truthful and complete information when booking a pitch. Misrepresentation may result in booking cancellation or account suspension.</p>
                <p><strong>2.3 Compliance with Venue Rules:</strong> You must adhere to the rules and regulations of the booked pitch, as set by the pitch owner. Naija Pitch Connect is not responsible for disputes arising from non-compliance with venue policies.</p>
                <p><strong>2.4 Prohibited Conduct:</strong> You may not use the app to:
                    <ul>
                        <li>Engage in illegal activities or violate any laws.</li>
                        <li>Book pitches for commercial purposes without prior approval from Naija Pitch Connect.</li>
                        <li>Misuse the platform, including making fraudulent bookings or payments.</li>
                    </ul>
                </p>

                <h4>3. Booking and Payment</h4>
                <p><strong>3.1 Booking Process:</strong> Bookings are made through the Naija Pitch Connect app by selecting a pitch, date, time, and duration. Availability is displayed in real-time, subject to confirmation by the pitch owner. You must review booking details (e.g., pitch location, price, duration) before proceeding to payment.</p>
                <p><strong>3.2 Pricing:</strong> Prices are set by pitch owners and displayed in Nigerian Naira (₦). Prices may vary based on location, pitch quality, or time of booking. A service fee may be added by Naija Pitch Connect to cover platform costs.</p>
                <p><strong>3.3 Payment Terms:</strong> Payments are processed securely via third-party payment providers. Full payment is required at the time of booking to confirm your reservation. All payments are non-refundable unless otherwise stated in the Cancellation Policy.</p>
                <p><strong>3.4 Payment Authorization:</strong> By entering payment details, you authorize Naija Pitch Connect and its payment partners to process the transaction. You confirm that you are the authorized user of the payment method provided.</p>

                <h4>4. Cancellation and Refund Policy</h4>
                <p><strong>4.1 User Cancellations:</strong> Cancellations must be made at least 24 hours before the booked time slot to be eligible for a refund, subject to the pitch owner’s cancellation policy. A processing fee may be deducted from refunds.</p>
                <p><strong>4.2 Pitch Owner Cancellations:</strong> If a pitch owner cancels a booking, Naija Pitch Connect will notify you and provide a full refund or offer an alternative pitch/time slot.</p>
                <p><strong>4.3 No-Show Policy:</strong> Failure to arrive at the booked pitch without prior cancellation will result in no refund.</p>

                <h4>5. Liability and Disclaimers</h4>
                <p><strong>5.1 Platform Role:</strong> Naija Pitch Connect acts as an intermediary between users and pitch owners. We do not own or operate the pitches and are not responsible for their condition, safety, or availability.</p>
                <p><strong>5.2 User Safety:</strong> You are responsible for ensuring your safety and the safety of others during your booking. Naija Pitch Connect is not liable for injuries, damages, or losses incurred at the pitch.</p>

                <h4>6. Intellectual Property</h4>
                <p><strong>6.1 Ownership:</strong> All content on the Naija Pitch Connect app (e.g., logos, text, design) is owned by Naija Pitch Connect or its licensors and protected by intellectual property laws.</p>

                <h4>7. Privacy</h4>
                <p><strong>7.1 Data Collection:</strong> We collect personal information to process bookings and improve services. Our Privacy Policy details how we handle your data.</p>

                <h4>8. Termination</h4>
                <p><strong>8.1 Account Termination:</strong> Naija Pitch Connect reserves the right to suspend or terminate your account for violating these Terms.</p>

                <h4>9. Governing Law and Dispute Resolution</h4>
                <p><strong>9.1 Governing Law:</strong> These Terms are governed by the laws of the Federal Republic of Nigeria. Disputes will be subject to the jurisdiction of courts in Lagos, Nigeria.</p>

                <h4>10. Contact Information</h4>
                <p>For questions, complaints, or support, contact us at:
                    <ul>
                        <li>Email: support@naijapitchconnect.com</li>
                        <li>Phone: +234 (0) 801 234 5678</li>
                        <li>Website: <a href="https://naijapitchconnect.com" target="_blank" rel="noopener noreferrer">www.naijapitchconnect.com</a></li>
                    </ul>
                </p>

                <h4>11. Acknowledgment</h4>
                <p>
                    By proceeding to payment, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions, as well as our Privacy Policy. You confirm that you are authorized to make the booking and payment, and you accept responsibility for complying with all applicable rules and policies.
                </p>
            </div>
        </ScrollArea>
    </DialogContent>
);

