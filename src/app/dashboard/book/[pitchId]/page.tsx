
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


export default function BookingPage() {
    const params = useParams();
    const router = useRouter();
    const { toast } = useToast();
    const [pitch, setPitch] = React.useState<Pitch | null>(null);
    const [selectedSlot, setSelectedSlot] = React.useState<string | null>(null);
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
                        </CardContent>
                        <CardFooter>
                            <Button 
                                className="w-full" 
                                size="lg" 
                                onClick={handleConfirmBooking} 
                                disabled={!selectedSlot || isLoading}
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
        </div>
    );
}

